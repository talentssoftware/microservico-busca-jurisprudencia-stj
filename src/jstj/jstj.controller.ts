import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JstjService } from './jstj.service';
import { CreateJstjDto } from './dto/create-jstj.dto';
import { UpdateJstjDto } from './dto/update-jstj.dto';
import { JstjScrapper } from './jstj.scrapper';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDataDto } from '@/jstj/dto/response-data.dto';
import { ExceptionErrorDto } from '@/commonServices/error/exception-error.dto';
import { ResponseJstsDto } from '@/jstj/dto/response-jsts.dto';
import { JwtAuthGuard } from '@/commonServices/auth/guards/jwt-auth.guard';

@ApiTags('jstj')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('jstj')
export class JstjController {
  constructor(
    private readonly jstjService: JstjService,
    private readonly scrapper: JstjScrapper,
  ) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully created.',
    type: ResponseJstsDto,
  })
  async create(@Body() createJstjDto: CreateJstjDto): Promise<ResponseJstsDto> {
    return await this.jstjService.createJQueue(createJstjDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseJstsDto,
    isArray: true,
  })
  async findAll() {
    return this.jstjService.findAllJQueue();
  }

  @Get('/live/:code')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseDataDto,
    isArray: true,
    description: 'It can be 1Mb and take more than 8 minutes to return',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: ExceptionErrorDto,
  })
  async test(@Param('code') code: string): Promise<ResponseDataDto[]> {
    try {
      return this.scrapper.genSearch(code);
    } catch (e) {
      throw new HttpException(e.message, 500);
    }
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseJstsDto,
  })
  findOne(@Param('id') id: string) {
    return this.jstjService.findOneJQueue(+id);
  }

  @Get('/data/:code')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseDataDto,
    isArray: true,
  })
  async JDataByCode(@Param('code') code: string) {
    return this.jstjService.getJDataByCode(code);
  }

  @Get('/data/:process')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseDataDto,
    isArray: true,
  })
  async JDataByProcess(@Param('process') process: string) {
    return this.jstjService.getJDataByProcess(process);
  }

  @Patch(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseJstsDto,
  })
  async update(@Param('id') id: string, @Body() updateJstjDto: UpdateJstjDto) {
    return this.jstjService.updateJQueue(+id, updateJstjDto);
  }

  @Delete(':id')
  @ApiResponse({
    status: HttpStatus.OK,
    type: ResponseJstsDto,
  })
  async remove(@Param('id') id: string) {
    return this.jstjService.removeJQueue(+id);
  }
}
