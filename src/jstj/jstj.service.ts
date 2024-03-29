import { Injectable, Logger } from '@nestjs/common';
import { CreateJstjDto } from './dto/create-jstj.dto';
import { UpdateJstjDto } from './dto/update-jstj.dto';
import { PrismaService } from '@/commonServices/prisma.service';
import { ResponseDataDto } from '@/jstj/dto/response-data.dto';
import { JstjScrapper } from '@/jstj/jstj.scrapper';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ResponseJstsDto } from '@/jstj/dto/response-jsts.dto';

/**
 * Jstj Service
 * JQueue(STJ_Request) é uma fila de processamento de tarefas
 * jData(STJ_Response) é um objeto que contém os dados da requisição
 */
@Injectable()
export class JstjService {
  private readonly logger = new Logger(JstjService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly scrapper: JstjScrapper,
  ) {}

  async createJQueue(createJstjDto: CreateJstjDto): Promise<ResponseJstsDto> {
    const created = await this.prisma.sTJ_Request.create({
      data: {
        code: createJstjDto.code,
        title: createJstjDto.title,
      },
    });
    return new ResponseJstsDto(created);
  }

  async findAllJQueue(): Promise<ResponseJstsDto[]> {
    const process = await this.prisma.sTJ_Request.findMany();
    return process.map((p) => new ResponseJstsDto(p));
  }

  async findOneJQueue(id: number): Promise<ResponseJstsDto> {
    const process = await this.prisma.sTJ_Request.findUnique({
      where: {
        id: id,
      },
    });
    return new ResponseJstsDto(process);
  }

  async updateJQueue(
    id: number,
    updateJstjDto: UpdateJstjDto,
  ): Promise<ResponseJstsDto> {
    const updated = await this.prisma.sTJ_Request.update({
      where: {
        id: id,
      },
      data: {
        code: updateJstjDto.code,
        title: updateJstjDto.title,
      },
    });
    return new ResponseJstsDto(updated);
  }

  async removeJQueue(id: number): Promise<ResponseJstsDto> {
    const deleted = await this.prisma.sTJ_Request.delete({
      where: {
        id: id,
      },
    });
    return new ResponseJstsDto(deleted);
  }

  async getJDataByCode(code: string): Promise<ResponseDataDto[]> {
    const process = await this.prisma.sTJ_Response.findMany({
      where: {
        code: code,
      },
    });
    return process.map((p) => new ResponseDataDto(p));
  }

  /**
   * Retorna os dados de um processo específico
   * @param processCode
   */
  async getJDataByProcess(processCode: string): Promise<ResponseDataDto[]> {
    const process = await this.prisma.sTJ_Response.findMany({
      where: {
        processo: processCode,
      },
    });
    return process.map((p) => new ResponseDataDto(p));
  }

  /**
   * Cron Job
   * A cada 10 minutos, verifica se há requisições no banco de dados
   * que ainda não foram processadas, e as processa.
   * O processamento consiste em fazer uma requisição ao site do STJ
   * e salvar os dados no banco de dados.
   *
   */
  @Cron(CronExpression.EVERY_10_MINUTES)
  async cronSearch() {
    this.logger.log('Cron Job: Verificando fila de processamento JSTJ.');
    try {
      const queue = await this.prisma.sTJ_Request.findMany({
        where: {
          processedAt: null,
        },
        take: 1,
      });
      for (const q of queue) {
        const response = await this.scrapper.genSearch(q.code);

        await this.prisma.sTJ_Response.createMany({
          data: response.map((r) => {
            return {
              code: q.code,
              processo: r.processo,
              relator: r.relator,
              orgaoJulgador: r.orgaoJulgador,
              dataJulgamento: r.dataJulgamento,
              dataPublicacao: r.dataPublicacao,
              notas: r.notas,
              ementa: r.ementa,
              acordao: r.acordao,
              referenciaLegislativa: r.referenciaLegislativa,
            };
          }),
        });
        // Atualiza o campo processedAt
        await this.prisma.sTJ_Request.update({
          where: {
            id: q.id,
          },
          data: {
            processedAt: new Date(),
          },
        });
      }
    } catch (e) {
      this.logger.error(e);
    }
  }
}
