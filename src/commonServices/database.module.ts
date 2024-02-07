import { Module, Global } from '@nestjs/common';
import { PrismaService } from '@/commonServices/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
