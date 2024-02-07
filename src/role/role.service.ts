import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/commonServices/prisma.service';
import { Prisma, Role } from '@prisma/client';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  async create(createRoleDto: Prisma.RoleCreateInput): Promise<Role> {
    const { name, description } = createRoleDto;
    return this.prisma.role.create({
      data: { name, description },
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoleWhereUniqueInput;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput;
  }): Promise<Role[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.role.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findAllWithCount(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoleWhereUniqueInput;
    where?: Prisma.RoleWhereInput;
    orderBy?: Prisma.RoleOrderByWithRelationInput;
  }): Promise<{ data: Role[]; count: number }> {
    const { skip, take, cursor, where, orderBy } = params;
    const [data, count] = await this.prisma.$transaction([
      this.prisma.role.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
      this.prisma.role.count({ where }),
    ]);
    return { data, count };
  }

  async findOne(
    RoleWhereUniqueInput: Prisma.RoleWhereUniqueInput,
  ): Promise<Role | null> {
    return this.prisma.role.findUniqueOrThrow({
      where: RoleWhereUniqueInput,
    });
  }

  async update(params: {
    where: Prisma.RoleWhereUniqueInput;
    data: Prisma.RoleUpdateInput;
  }): Promise<Role> {
    const { where, data } = params;
    return this.prisma.role.update({
      data,
      where,
    });
  }

  async remove(where: Prisma.RoleWhereUniqueInput): Promise<Role> {
    return this.prisma.role.delete({
      where,
    });
  }

  async count(): Promise<number> {
    return this.prisma.role.count();
  }
}
