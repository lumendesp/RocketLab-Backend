import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // apagando os dados do banco
  await prisma.review.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderBook.deleteMany();
  await prisma.order.deleteMany();
  await prisma.book.deleteMany();

  // resentando os IDs
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='Livro'`,
  );
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='Review'`,
  );
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='Order'`,
  );
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='Cart'`,
  );
  await prisma.$executeRawUnsafe(
    `DELETE FROM sqlite_sequence WHERE name='CartItem'`,
  );

  console.log('Todos os dados foram apagados com sucesso.');
}

main()
  .catch((e) => {
    console.error('Erro ao apagar dados:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
