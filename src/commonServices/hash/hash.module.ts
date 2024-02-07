import { Module } from '@nestjs/common';
import { HashService } from '@/commonServices/hash/hash.service';

@Module({
  providers: [HashService],
  exports: [HashService],
})
export class HashModule {}
