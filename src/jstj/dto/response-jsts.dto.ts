import { ApiProperty } from '@nestjs/swagger';

export class ResponseJstsDto {
  constructor(data: any) {
    this.title = data.title;
    this.code = data.code;
  }
  @ApiProperty({ required: false })
  title: string;
  @ApiProperty()
  code: string;
}
