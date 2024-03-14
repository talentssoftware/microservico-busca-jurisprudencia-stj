import { ApiProperty } from '@nestjs/swagger';

export class CreateJstjDto {
  @ApiProperty({ required: false })
  title?: string;
  @ApiProperty()
  code: string;
}
