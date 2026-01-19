import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.info('Seeding database...');

  // Add your seed data here
  // Example:
  // await prisma.user.createMany({
  //   data: [
  //     { email: 'user1@example.com', name: 'User 1' },
  //     { email: 'user2@example.com', name: 'User 2' },
  //   ],
  //   skipDuplicates: true,
  // });

  console.info('Seeding completed.');
}

main()
  .catch((error: unknown) => {
    console.error('Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
