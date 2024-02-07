import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Browser, executablePath, Page } from 'puppeteer';
import { ResponseDataDto } from '@/jstj/dto/response-data.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer-extra');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

interface JstjData {
  processo: string;
  textP: string[];
  textPre: string[];
}

@Injectable()
export class JstjScrapper {
  private readonly logger = new Logger(JstjScrapper.name);
  private browser: Browser;
  /**
   * Constantes
   * @private
   */
  private CONST = {
    url: 'https://scon.stj.jus.br/SCON/',
    title: 'STJ',
    perPage: 10,
    paginate: true, // Se a paginação está ativada
  };

  constructor(private readonly conf: ConfigService) {}

  /**
   * Gera o browser
   * @private
   */
  private async genBrowser() {
    puppeteer.use(StealthPlugin());
    try {
      if (this.conf.get('PUPPETEER_MODE', 'local') == 'local') {
        this.browser = await puppeteer.launch({
          headless: 'new',
          // headless: false,
          slowMo: 100,
          timeout: 0,
          executablePath: executablePath(),
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
      } else {
        this.browser = await puppeteer.connect({
          browserURL: this.conf.getOrThrow('PUPPETEER_ENDPOINT'),
          slowMo: 100,
          protocolTimeout: 0,
        });
        this.logger.log(
          `Browser connected to ${this.conf.getOrThrow(
            'PUPPETEER_ENDPOINT',
          )}, connected: ${this.browser.connected}`,
          'genBrowser',
        );
      }
    } catch (e) {
      this.logger.error(e);
    }
  }

  /**
   * Faz a busca no site do STJ
   * @param code
   */
  public async genSearch(code: string): Promise<ResponseDataDto[]> {
    if (!code || code.length === 0) {
      throw new Error('Empty request');
    }
    if (!this.browser) {
      await this.genBrowser();
    }

    const page = await this.browser.newPage();
    await this.interceptRequest(page);
    try {
      await page.goto(this.CONST.url, { timeout: 0 });
      // Verifica se o título da página é o esperado antes da busca
      await this.checkCaptcha(page);

      // Preencher o campo de pesquisa
      await page.type('#pesquisaLivre', code);
      // Clicar no botão de pesquisa
      await Promise.all([
        page.click('[aria-label="Pesquisar"]'),
        page.waitForNavigation({ timeout: 0 }),
      ]);

      // Verifica se a página mudou para a página de resultados
      await this.checkCaptcha(page);

      // Pega o número de documentos
      const numDocs = await page.$eval('.numDocs', (el) => {
        const text = el.textContent;
        return text.replace(/\D/g, '');
      });
      this.logger.log(`Número de documentos: ${numDocs}`, 'genSearch');

      // Verifica se o número de documentos é menor ou igual ao número de documentos por página, ou se a paginação está desativada
      if (parseInt(numDocs) <= this.CONST.perPage && !this.CONST.paginate) {
        return this.transformData(await this.docExtractor(page));
      } else {
        const docs = await this.getPaginated(
          page,
          parseInt(numDocs),
          this.CONST.perPage,
        );
        return this.transformData(docs.flat());
        // return docs.flat();
      }
    } catch (e) {
      this.logger.error(e);
    } finally {
      await page.close();
    }
  }

  /**
   * Pega os dados da página
   * @param documentoHTML
   * @param page
   * @private
   */
  private async getFromPage(
    documentoHTML: string,
    page: Page,
  ): Promise<JstjData> {
    this.logger.log(`Separação dos dados da página: ${documentoHTML}`);
    const startTime = new Date().getTime(); // Registra o tempo de início

    await page.waitForSelector(documentoHTML);
    const documento = await page.$(`${documentoHTML}`);

    const textPre = await documento.$$eval('.docTexto pre', (element) =>
      element.map((el) => el.textContent.trim()),
    );
    const textP = await documento.$$eval('.docTexto p', (element) =>
      element.map((el) => el.textContent.trim()),
    );

    const processo = await documento.$eval('.docTexto', (element) =>
      element.textContent.trim(),
    );
    const endTime = new Date().getTime(); // Registra o tempo de término
    this.logger.log(
      `getFromPage - Tempo de execução: ${endTime - startTime}ms`,
    );
    this.logger.log(`Processo: ${processo}: ${textPre.length} ${textP.length}`);

    return {
      textPre,
      textP,
      processo,
    };
  }

  /**
   * Pega os dados de todas as páginas
   * @param page
   * @param numDocs
   * @param perPage
   * @private
   * @returns {Promise<JstjData[][]>}
   */
  private async getPaginated(
    page: Page,
    numDocs: number,
    perPage: number,
  ): Promise<JstjData[][]> {
    this.logger.log('Paginando');
    const varDocs: JstjData[][] = [];

    for (let i = 0; i < numDocs; i += perPage + 1) {
      if (i !== 0) {
        this.logger.log(`Paginando para ${i}`);
        await Promise.all([
          page.click(`.iconeProximaPagina`),
          page.waitForNavigation({ timeout: 0 }),
        ]);
        varDocs.push(await this.docExtractor(page));
      } else {
        varDocs.push(await this.docExtractor(page));
      }
    }
    return varDocs;
  }

  /**
   * Extrai os dados da página
   * @param page
   * @private
   */
  private async docExtractor(page: Page): Promise<JstjData[]> {
    this.logger.log('Extraindo dados da página');
    const startTime = new Date().getTime(); // Registra o tempo de início
    await Promise.all([
      // Esperar a página carregar completamente
      await page.waitForSelector('.documento', { timeout: 0 }),
      // Cria uma id randomica para cada elemento e altere o dom.
      await page.$$eval('.documento', (docs) =>
        docs.map((doc) => {
          const id = 'doc' + Math.random().toString(36).substring(2, 15);
          doc.setAttribute('id', id);
        }),
      ),
    ]);

    // Seleciona todos os elementos com a classe "documento"
    const documentos = await page.$$eval('.documento', (docs) =>
      docs.map((doc) => {
        const id = doc.getAttribute('id');
        return `#${id}`;
      }),
    );
    const varDocs = [];
    const promises = documentos.map((documentoHTML) =>
      this.getFromPage(documentoHTML, page),
    );
    varDocs.push(...(await Promise.all(promises)));

    const endTime = new Date().getTime(); // Registra o tempo de término
    this.logger.log(
      `docExtractor - Tempo de execução: ${endTime - startTime}ms`,
    );
    return varDocs;
  }

  /**
   * Verifica se o título da página é o esperado
   * @param page
   * @private
   */
  private async checkCaptcha(page: Page): Promise<void> {
    if (!(await page.title()).includes(this.CONST.title)) {
      throw new Error('Captcha');
    }
  }

  /**
   * Intercepta as requisições da página e bloqueia imagens, estilos e fontes
   * @param page
   * @private
   */
  private async interceptRequest(page: Page): Promise<void> {
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });
  }

  /**
   * Transforma os dados para o formato ResponseDataDto
   * @param data
   * @private
   */
  private transformData(data: JstjData[]): ResponseDataDto[] {
    return data.map((data) => {
      return new ResponseDataDto({
        processo: data.processo,
        relator: data.textPre[0],
        orgaoJulgador: data.textPre[1],
        dataJulgamento: data.textPre[2],
        dataPublicacao: data.textPre[3],
        notas: data.textPre[4],
        referenciaLegislativa: data.textPre[5],
        ementa: data.textP[0],
        acordao: data.textP[1],
      });
    });
  }
}
