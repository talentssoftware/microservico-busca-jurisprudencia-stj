import * as argon2 from 'argon2';
import { PrismaClient } from '@prisma/client';
import { Role } from '../src/commonServices/auth/guards/roles.guard';
import * as process from 'process';

const prisma = new PrismaClient();

async function main() {
  const salt = process.env.ARGON_SALT;
  const pass = await argon2.hash('admin', {
    type: argon2.argon2id,
    salt: Buffer.from(salt, 'hex'),
  });
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      password: pass,
      role: {
        create: {
          name: Role.MASTER,
        },
      },
    },
  });
  const roles = await prisma.role.createMany({
    data: [
      {
        name: Role.VIEWER,
        description: 'Can only view data',
      },
      {
        name: Role.USER,
        description: 'Can view and edit data',
      },
      {
        name: Role.PUBLIC,
        description: 'Can view public data',
      },
    ],
  });
  console.log({ admin, roles });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
