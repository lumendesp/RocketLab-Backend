import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  // essa função garante que o carrinho existe ou vai ser criado nela
  // já que não tem usuário, é um carrinho genérico, então só vai existir um por vez
  private async getOrCreateCart() {
    let cart = await this.prisma.cart.findFirst();

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {},
      });
    }

    return cart;
  }

  // retorna o carrinho como ele está atualmente
  async getCart() {
    const cart = await this.getOrCreateCart(); // primeiro, garante que ele existe

    // depois, busca todos os itens relacionados à ele, junto dos dados dos livros
    const items = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { book: true },
    });

    if (items.length === 0) {
      throw new NotFoundException('O carrinho está vazio.');
    }

    return items;
  }

  // função para adicionar um livro ao carrinho
  async addItem(bookId: number, quantity: number) {
    if (quantity < 1) {
      // se a pessoa pede menos de 1, dá erro
      throw new BadRequestException('A quantidade mínima deve ser 1');
    }

    const cart = await this.getOrCreateCart(); // garante que o carrinho existe

    // busca o livro no banco, para verificar se ele existe
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('Livro não encontrado');
    }

    // verifica se o mesmo livro já está no carrinho
    const existingItem = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, bookId },
    });

    // atualiza a quantidade do carrinho
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const newQuantity = currentQuantity + quantity;

    // se a quantidade nova for exceder o estoque disponível, da um erro
    if (newQuantity > book.quantity) {
      throw new BadRequestException(
        `Quantidade solicitada (${newQuantity}) excede o estoque disponível (${book.quantity})`,
      );
    }

    // dando tudo certo e se o livro já estava lá, só atualiza a quantidade
    if (existingItem) {
      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // se deu tudo certo, mas é a primeira inserção ao carrinho, cria o item nele
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          bookId,
          quantity,
        },
      });
    }

    return { message: 'Livro adicionado ao carrinho' };
  }

  // função para atualizar (aumentar ou diminuir) a quantidade de um livro no carrinho, recebe o ID do livro a ser atualizado e a nova quantidade solicitada
  async updateItem(bookId: number, quantity: number) {
    if (quantity < 1) {
      throw new BadRequestException('A quantidade mínima deve ser 1');
    }

    const cart = await this.getOrCreateCart();

    // verifica se está no carrinho
    const item = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, bookId },
    });

    // se não estiver, dá erro
    if (!item) {
      throw new NotFoundException('Livro não encontrado no carrinho');
    }

    // verifica se o livro existe
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) {
      throw new NotFoundException('Livro não encontrado');
    }

    // verifica se a quantidade solicitada vai exceder o estoque disponível
    if (quantity > book.quantity) {
      throw new BadRequestException(
        `Quantidade solicitada (${quantity}) excede o estoque disponível (${book.quantity})`,
      );
    }

    // se der tudo certo, atualiza a quantidade do carrinho
    await this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity },
    });

    return { message: 'Quantidade atualizada com sucesso' };
  }

  // função para remover um livro do carrinho
  async removeItem(bookId: number) {
    const cart = await this.getOrCreateCart();

    const item = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, bookId },
    });

    if (!item) {
      throw new NotFoundException('Livro não encontrado no carrinho');
    }

    await this.prisma.cartItem.delete({ where: { id: item.id } });

    return { message: 'Livro removido do carrinho' };
  }

  // função para limpar o carrinho, ou seja, remover todos os itens dele
  async clearCart() {
    const cart = await this.getOrCreateCart();

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return { message: 'O carrinho foi limpo com sucesso' };
  }

  // função para finalizar a compra
  async checkout() {
    const cart = await this.getOrCreateCart();

    // busca os itens do carrinho e inclui os dados dos livros
    const cartItems = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { book: true },
    });

    // se o carrinho estiver vazio, dá erro
    if (cartItems.length === 0) {
      throw new BadRequestException('O carrinho está vazio');
    }

    // para cada livro, vai ser feita uma validação do estoque disponível (dupla segurança)
    for (const item of cartItems) {
      if (item.quantity > item.book.quantity) {
        throw new BadRequestException(
          `Livro "${item.book.title}" não possui estoque suficiente. Estoque atual: ${item.book.quantity}`,
        );
      }
    }

    // cria um pedido (entidade order) com os livros e as quantidades
    const order = await this.prisma.order.create({
      data: {
        books: {
          create: cartItems.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        books: true,
      },
    });

    // atualiza o estoque dos livros, subtraindo o que foi comprado
    for (const item of cartItems) {
      await this.prisma.book.update({
        where: { id: item.bookId },
        data: { quantity: item.book.quantity - item.quantity },
      });
    }

    // limpa o carrinho
    await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    return order;
  }

  // função para montar um carrinho com o uso da IA
  async generateCartFromBookIds(bookIds: number[]) {
    const cart = await this.getOrCreateCart();

    // busca todos os livros com os IDs recebidos que tenham estoque
    const books = await this.prisma.book.findMany({
      where: {
        id: { in: bookIds },
        quantity: { gt: 0 }, // gt significa greater than (maior que)
      },
    });

    const addedItems: string[] = [];

    // para cada livro, se já estiver no carrinho, soma +1 na quantidade, se não estiver, coloca um livro com quantidade 1
    for (const book of books) {
      const existingItem = await this.prisma.cartItem.findFirst({
        where: { cartId: cart.id, bookId: book.id },
      });

      if (existingItem) {
        await this.prisma.cartItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + 1,
          },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            cartId: cart.id,
            bookId: book.id,
            quantity: 1,
          },
        });
      }

      // salva os títulos adicionados para mostrar ao final, na mensagem de sucesso
      addedItems.push(book.title);
    }

    if (addedItems.length === 0) {
      throw new NotFoundException(
        'Nenhum livro foi adicionado ao carrinho. Verifique o estoque ou os IDs fornecidos',
      );
    }

    return {
      message: 'Carrinho sugerido pela IA montado com sucesso',
      livrosAdicionados: addedItems,
    };
  }
}
