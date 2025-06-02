import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateOrderDto) {
    const bookIds = data.items.map((item) => item.bookId);

    // busca os livros pelos IDs
    const books = await this.prisma.book.findMany({
      where: { id: { in: bookIds } },
    });

    // verifica se todos os livros existem
    if (books.length !== bookIds.length) {
      throw new NotFoundException('Um ou mais livros não foram encontrados');
    }

    // verifica o estoque para cada livro
    for (const item of data.items) {
      const book = books.find((b) => b.id === item.bookId);
      if (!book) continue;

      if (book.quantity < item.quantity) {
        throw new BadRequestException(
          `Estoque insuficiente para o livro com ID ${item.bookId}`,
        );
      }
    }

    // atualiza o estoque dos livros
    await Promise.all(
      data.items.map((item) =>
        this.prisma.book.update({
          where: { id: item.bookId },
          data: { quantity: { decrement: item.quantity } },
        }),
      ),
    );

    // cria o pedido com os livros e quantidades
    return this.prisma.order.create({
      data: {
        books: {
          create: data.items.map((item) => ({
            book: { connect: { id: item.bookId } },
            quantity: item.quantity,
          })),
        },
      },
      include: {
        books: {
          include: { book: true },
        },
      },
    });
  }

  async findAll() {
    const orders = await this.prisma.order.findMany({
      include: {
        books: {
          include: {
            book: true,
          },
        },
      },
    });

    if (orders.length === 0) {
      throw new NotFoundException('Nenhum pedido encontrado');
    }

    return orders.map((order) => ({
      ...order,
      books: order.books.map((item) => ({
        orderId: item.orderId,
        bookId: item.bookId,
        orderedQuantity: item.quantity,
        book: item.book,
      })),
    }));
  }
}
