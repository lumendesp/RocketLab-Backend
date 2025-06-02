import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiOperation } from '@nestjs/swagger';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartItem } from '@prisma/client';
import { AiService } from 'src/ai/ai.service';
import { GenerateCartDto } from './dto/generate-cart.dto';

@Controller('cart')
export class CartController {
  constructor(
    private readonly cartService: CartService,
    private readonly aiService: AiService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todos os livros que estão no carrinho' })
  async getCart(): Promise<CartItem[]> {
    return await this.cartService.getCart();
  }

  @Post('add')
  @ApiOperation({ summary: 'Adiciona um novo livro ao carrinho, através do ID do livro e da quantidade desejada' })
  async addItem(@Body() dto: AddToCartDto) {
    return await this.cartService.addItem(dto.bookId, dto.quantity);
  }

  @Patch('update')
  @ApiOperation({ summary: 'Atualiza a quantidade de um livro no carrinho, através o ID do livro e a nova quantidade' })
  async updateItem(@Body() dto: UpdateCartDto) {
    return await this.cartService.updateItem(dto.bookId, dto.quantity);
  }

  @Delete('remove/:bookId')
  @ApiOperation({ summary: 'Remove um livro do carrinho, através do ID fornecido' })
  async removeItem(@Param('bookId', ParseIntPipe) bookId: number) {
    return await this.cartService.removeItem(bookId);
  }

  @Delete('clear')
  @ApiOperation({ summary: 'Limpa o carrinho inteiro' })
  async clearCart() {
    return await this.cartService.clearCart();
  }

  @Post('checkout')
  @ApiOperation({ summary: 'Finaliza a compra, criando um novo pedido' })
  async checkout() {
    return this.cartService.checkout();
  }

  @Post('suggestion')
  @ApiOperation({
    summary:
      'IA monta uma sugestão de carrinho, baseado na sua preferência e nos livros disponíveis do banco',
  })
  async generateSuggestedCart(@Body() dto: GenerateCartDto) {
    const bookIds = await this.aiService.generateCartSuggestion(dto.text); // aqui é feita a chamada à IA, que vai gerar a sugestão de carrinho
    const result = await this.cartService.generateCartFromBookIds(bookIds); // a partir da resposta da IA (os IDs dos livros), é feita uma chamada para outra função, que vai verificar se os livros estão disponíveis no estoque ou não, se estiverem, adiciona ao carrinho
    return result;
  }
}
