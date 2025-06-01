import {
  Controller,
  Get,
  Param,
  Query,
  Body,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
// import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todos os livros do banco' })
  async showBooks() {
    const books = await this.booksService.getBooks();
    return {
      message: 'Livros encontrados com sucesso',
      books,
    };
  }

  @Get('/search')
  @ApiOperation({
    summary:
      'Retorna livros que contenham a palavra-chave no título, autor ou gênero',
  })
  async search(@Query('searchValue') searchValue: string) {
    const books = await this.booksService.searchBooks(searchValue);
    return {
      message: 'Livros encontrados com sucesso',
      books,
    };
  }

  @Get('/search/:id')
  @ApiOperation({ summary: 'Retorna um livro, através do ID fornecido' })
  async findOne(@Param('id') id: string) {
    const book = await this.booksService.findOne(+id);
    return {
      message: 'Livro encontrado com sucesso',
      book,
    };
  }

  @Post()
  @ApiOperation({
    summary:
      'Cria um novo livro no banco. Todos os campos são de preenchimento obrigatório',
  })
  async create(@Body() data: CreateBookDto) {
    const book = await this.booksService.create(data);
    return {
      message: 'Livro criado com sucesso',
      book,
    };
  }

  @Put(':id')
  @ApiOperation({
    summary:
      'Atualiza os dados de um livro. Para atualizar apenas um campo, envie somente ele no Body',
  })
  async update(@Param('id') id: string, @Body() data: UpdateBookDto) {
    const book = await this.booksService.update(+id, data);
    return {
      message: 'Livro atualizado com sucesso',
      book,
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Remove um livro do banco, através do ID fornecido',
  })
  async remove(@Param('id') id: string) {
    await this.booksService.delete(+id);
    return {
      message: 'Livro removido com sucesso',
    };
  }

  // @Patch(':id/add-quantity')
  // async addQuantity(@Param('id') id: string, @Body() data: UpdateQuantityDto) {
  //   try {
  //     const updatedBook = await this.booksService.updateQuantity(
  //       +id,
  //       data.quantity,
  //     );
  //     return {
  //       message: 'Quantidade adicionada com sucesso',
  //       book: updatedBook,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error.message || 'Erro ao adicionar quantidade');
  //   }
  // }

  // @Patch(':id/remove-quantity')
  // async removeQuantity(
  //   @Param('id') id: string,
  //   @Body() data: UpdateQuantityDto,
  // ) {
  //   try {
  //     const updatedBook = await this.booksService.updateQuantity(
  //       +id,
  //       -data.quantity,
  //     );
  //     return {
  //       message: 'Quantidade removida com sucesso',
  //       book: updatedBook,
  //     };
  //   } catch (error) {
  //     throw new BadRequestException(error.message || 'Erro ao remover quantidade');
  //   }
  // }
}
