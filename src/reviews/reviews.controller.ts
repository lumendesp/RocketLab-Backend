import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({
    summary:
      'Faz a criação de uma review para determinado livro, com todos os campos obrigatórios',
  })
  async create(@Body() data: CreateReviewDto) {
    const review = await this.reviewsService.create(data);
    return {
      message: 'Review criada com sucesso',
      review,
    };
  }

  @Get('book/:bookId')
  @ApiOperation({
    summary:
      'Retorna todas as reviews para um determinado livro, através do id do livro fornecido',
  })
  async findByBook(@Param('bookId') bookId: string) {
    const reviews = await this.reviewsService.findByBook(+bookId);

    return {
      message: 'Reviews encontradas com sucesso',
      reviews,
    };
  }
}
