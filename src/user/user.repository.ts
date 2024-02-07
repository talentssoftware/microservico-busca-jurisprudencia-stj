import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '@/commonServices/prisma.service';
import { HashService } from '@/commonServices/hash/hash.service';

@Injectable()
export class UserRepository {
  constructor(
    private prisma: PrismaService,
    private readonly hash: HashService,
  ) {}

  async createUser({
    name,
    email,
    password,
    role,
  }: Prisma.UserCreateInput): Promise<User> {
    const pass = await this.hash.hashPassword(String(password));
    return this.prisma.user.create({
      data: {
        name,
        email,
        password: pass,
        role: role,
      },
    });
  }

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async usersWithCount(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<{ data: User[]; count: number }> {
    const { skip, take, cursor, where, orderBy } = params;
    const [data, count] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
      this.prisma.user.count({ where }),
    ]);
    return { data, count };
  }

  async countUsers(params: { where?: Prisma.UserWhereInput }): Promise<number> {
    const { where } = params;
    return this.prisma.user.count({
      where,
    });
  }

  async getUser(
    UserWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUniqueOrThrow({
      where: UserWhereUniqueInput,
      include: {
        role: true,
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    const { name, email, password, role } = data;
    const pass = password
      ? await this.hash.hashPassword(String(password))
      : password;
    return this.prisma.user.update({
      data: {
        name,
        email,
        role,
        password: pass,
      },
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async login(email: string, password: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return await this.hash.comparePassword(password, user.password);
  }
}
