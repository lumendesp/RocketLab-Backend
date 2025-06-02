import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  async getBooks() {
    const books = await this.prisma.book.findMany({
      include: {
        review: true,
      },
    });

    if (books.length === 0) {
      throw new NotFoundException('Nenhum livro encontrado no banco de dados');
    }

    return books;
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        review: true,
      },
    });

    if (!book) {
      throw new NotFoundException('Livro não encontrado');
    }

    return book;
  }

  async searchBooks(query: string) {
    if (!query || query.trim() === '') {
      throw new BadRequestException('A busca não pode estar vazia');
    }

    const books = await this.prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { author: { contains: query } },
          { genre: { contains: query } },
        ],
      },
    });

    if (books.length === 0) {
      throw new NotFoundException('Nenhum livro encontrado com esse termo');
    }

    return books;
  }

  async create(data: CreateBookDto) {
    const existingBook = await this.prisma.book.findFirst({
      where: {
        title: data.title.trim(),
        author: data.author.trim(),
      },
    });

    if (existingBook) {
      throw new BadRequestException(
        'Já existe um livro com o mesmo título e autor',
      );
    }

    return this.prisma.book.create({ data });
  }

  async update(id: number, data: Partial<UpdateBookDto>) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException('Livro não encontrado');
    }

    return this.prisma.book.update({
      where: { id },
      data,
    });
  }

  async delete(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
    });

    if (!book) {
      throw new NotFoundException('Livro não encontrado');
    }

    return this.prisma.book.delete({
      where: { id },
    });
  }
}
