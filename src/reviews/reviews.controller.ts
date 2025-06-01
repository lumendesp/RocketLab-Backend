import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      const review = await this.reviewsService.create(data);
      return {
        message: 'Review criada com sucesso',
        review,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Erro ao criar review');
    }
  }

  @Get('book/:bookId')
  @ApiOperation({
    summary:
      'Retorna todas as reviews para um determinado livro, através do id do livro fornecido',
  })
  async findByBook(@Param('bookId') bookId: string) {
    try {
      const reviews = await this.reviewsService.findByBook(+bookId);
      if (!reviews.length) {
        throw new NotFoundException('Nenhuma review encontrada para esse livro');
      }
      return {
        message: 'Reviews encontradas com sucesso',
        reviews,
      };
    } catch (error) {
      throw new InternalServerErrorException(
        error.message || 'Erro ao buscar reviews',
      );
    }
  }
}
