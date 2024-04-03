const { PrismaClient } = require('@prisma/client');
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const superadmin = {
    username: 'superadmin',
    name: 'Super Admin',
    email: 'superadmin@mail.com',
    password: await bcrypt.hash("secret", 10),
    role: 'superadmin'
  };

  await prisma.user.create({
    data: superadmin,
  });
  console.log(`Super Admin created successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
