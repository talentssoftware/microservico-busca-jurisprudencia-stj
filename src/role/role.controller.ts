import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '@/commonServices/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";

@ApiTags('Funções')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @Get()
  async findAll(@Query('skip') skip?: number, @Query('take') take?: number) {
    return await this.roleService.findAllWithCount({
      skip: skip || undefined,
      take: take || undefined,
    });
  }

  @Get(':id')
  findOne(@Param('id') id?: number) {
    return this.roleService.findOne({ id });
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update({
      where: { id },
      data: updateRoleDto,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.roleService.remove({ id });
  }
}
