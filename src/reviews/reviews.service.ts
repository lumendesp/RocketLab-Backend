import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateReviewDto) {
    const book = await this.prisma.book.findUnique({
      where: { id: data.bookId },
    });

    if (!book) {
      throw new Error('Livro não encontrado');
    }
    return this.prisma.review.create({ data });
  }

  async findByBook(bookId: number) {
    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      throw new Error('Livro não encontrado');
    }

    return this.prisma.review.findMany({
      where: { bookId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
