import { Module } from '@nestjs/common';
import { JstjService } from './jstj.service';
import { JstjController } from './jstj.controller';
import { JstjScrapper } from './jstj.scrapper';

@Module({
  controllers: [JstjController],
  providers: [JstjService, JstjScrapper],
  exports: [JstjService, JstjScrapper],
})
export class JstjModule {}
