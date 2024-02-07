import { PartialType } from '@nestjs/swagger';
import { CreateJstjDto } from './create-jstj.dto';

export class UpdateJstjDto extends PartialType(CreateJstjDto) {}
