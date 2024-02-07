import { ApiProperty } from '@nestjs/swagger';

export class ExceptionErrorDto {
  constructor(data: any) {
    this.statusCode = data.statusCode;
    this.timestamp = data.timestamp;
    this.message = data.message;
    this.path = data.path;
  }

  @ApiProperty({ type: Number, description: 'HTTP Status Code', example: 500 })
  statusCode: number;

  @ApiProperty({
    type: String,
    description: 'Timestamp',
    example: '2024-02-06T00:00:00.000Z',
  })
  timestamp: string;

  @ApiProperty({
    type: String,
    description: 'Error message',
    example: 'Internal Server Error',
  })
  message: string;

  @ApiProperty({
    type: String,
    description: 'Path',
    example: '/jstj/live/123456',
  })
  path: string;
}
