import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { PrismaService } from '../prisma.service';

// TESTES UNITÁRIOS PARA CART!!
describe('CartService', () => {
  let service: CartService;

  const mockPrisma = {
    cart: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    cartItem: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
    book: {
      findUnique: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
    },
    order: {
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // teste para verificar se está retornando o carrinho de forma correta (com os livros ou vazio)
  describe('getCart', () => {
    it('deve retornar os itens do carrinho com os dados dos livros', async () => {
      const cart = { id: 1 }; // simulando o id do carrinho
      const cartItems = [
        // simulando os itens do carrinho
        { id: 1, cartId: 1, book: { id: 1, title: 'Harry Potter' } },
      ];

      mockPrisma.cart.findFirst.mockResolvedValue(cart);
      mockPrisma.cartItem.findMany.mockResolvedValue(cartItems);

      const result = await service.getCart();

      expect(mockPrisma.cart.findFirst).toHaveBeenCalled();

      expect(mockPrisma.cartItem.findMany).toHaveBeenCalledWith({
        where: { cartId: cart.id },
        include: { book: true },
      });

      expect(result).toEqual(cartItems);
    });
  });

  // teste para verificar se a função addItem está realmente funcionando
  describe('addItem', () => {
    // caso de sucesso, quando um livro é adicionando ao carrinho
    it('deve adicionar o item ao carrinho com sucesso', async () => {
      const cart = { id: 1 };
      mockPrisma.cart.findFirst.mockResolvedValue(null);
      mockPrisma.cart.create.mockResolvedValue(cart);
      mockPrisma.book.findUnique.mockResolvedValue({ id: 1, quantity: 10 });
      mockPrisma.cartItem.findFirst.mockResolvedValue(null);
      mockPrisma.cartItem.create.mockResolvedValue({});

      const result = await service.addItem(1, 2);
      expect(result).toEqual({ message: 'Livro adicionado ao carrinho' });
    });

    // caso de erro, quando o usuário tenta adicionar ao carrinho uma quantidade menor que 1
    it('deve lançar erro se a quantidade for < 1', async () => {
      await expect(service.addItem(1, 0)).rejects.toThrow(
        'A quantidade mínima deve ser 1',
      );
    });

    // caso de erro, quando o usuário tenta adicionar ao carrinho um livro que não existe no banco
    it('deve lançar erro se o livro não existir', async () => {
      mockPrisma.cart.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.book.findUnique.mockResolvedValue(null);

      await expect(service.addItem(1, 2)).rejects.toThrow(
        'Livro não encontrado',
      );
    });

    // caso de erro, quando o usuário tenta adicionar ao carrinho uma quantidade de determinado livro que é excede o estoque disponível
    it('deve lançar erro se a quantidade exceder o estoque', async () => {
      const book = { id: 1, quantity: 5 };
      const existingCartItem = { quantity: 3 };
      const addedQuantity = 3;
      const newQuantity = existingCartItem.quantity + addedQuantity;

      mockPrisma.cart.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.book.findUnique.mockResolvedValue(book);
      mockPrisma.cartItem.findFirst.mockResolvedValue(existingCartItem);

      const expectedMessage = `Quantidade solicitada (${newQuantity}) excede o estoque disponível (${book.quantity})`;

      await expect(service.addItem(1, addedQuantity)).rejects.toThrow(
        expectedMessage,
      );
    });
  });

  // teste para verificar se a função de updateItem está realmente funcionando
  describe('updateItem', () => {
    // caso de sucesso, conseguiu atualizar uma quantidade ao carrinho
    it('deve atualizar o item no carrinho com sucesso', async () => {
      mockPrisma.cart.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.cartItem.findFirst.mockResolvedValue({ id: 10 });
      mockPrisma.book.findUnique.mockResolvedValue({ quantity: 5 });
      mockPrisma.cartItem.update.mockResolvedValue({});

      const result = await service.updateItem(1, 2);
      expect(result).toEqual({ message: 'Quantidade atualizada com sucesso' });
    });

    // caso de erro, ao tentar atualizar para uma quantidade menor que 1
    it('deve lançar erro se a quantidade for < 1', async () => {
      await expect(service.updateItem(1, 0)).rejects.toThrow(
        'A quantidade mínima deve ser 1',
      );
    });

    // caso de erro, ao tentar atualizar um livro que não está no carrinho
    it('deve lançar erro se o livro não estiver no carrinho', async () => {
      mockPrisma.cart.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.cartItem.findFirst.mockResolvedValue(null);

      await expect(service.updateItem(1, 2)).rejects.toThrow(
        'Livro não encontrado no carrinho',
      );
    });

    // caso de erro, ao tentar atualizar um livro que não existe no banco
    it('deve lançar erro se o livro não existir no banco', async () => {
      mockPrisma.cart.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.cartItem.findFirst.mockResolvedValue({ id: 10 });
      mockPrisma.book.findUnique.mockResolvedValue(null);

      await expect(service.updateItem(1, 2)).rejects.toThrow(
        'Livro não encontrado',
      );
    });

    // caso de erro, ao tentar atualizar a quantidade para um valor que excede o estoque disponível
    it('deve lançar erro se a quantidade excede estoque', async () => {
      const book = { quantity: 3 };
      const requestedQuantity = 5;

      mockPrisma.cart.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.cartItem.findFirst.mockResolvedValue({ id: 10 });
      mockPrisma.book.findUnique.mockResolvedValue(book);

      const expectedMessage = `Quantidade solicitada (${requestedQuantity}) excede o estoque disponível (${book.quantity})`;

      await expect(service.updateItem(1, requestedQuantity)).rejects.toThrow(
        expectedMessage,
      );
    });
  });

  // teste para verificar o removeItem
  describe('removeItem', () => {
    // caso de sucesso, realmente removeu um livro do carrinho
    it('deve remover item do carrinho com sucesso', async () => {
      mockPrisma.cart.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.cartItem.findFirst.mockResolvedValue({ id: 10 });
      mockPrisma.cartItem.delete.mockResolvedValue({});

      const result = await service.removeItem(1);
      expect(result).toEqual({ message: 'Livro removido do carrinho' });
    });

    // caso de erro, ao tentar remover um item que não está no carrinho
    it('deve lançar erro se item não estiver no carrinho', async () => {
      mockPrisma.cart.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.cartItem.findFirst.mockResolvedValue(null);

      await expect(service.removeItem(1)).rejects.toThrow(
        'Livro não encontrado no carrinho',
      );
    });
  });

  // teste para verificar o clearCart, apenas limpa o carrinho todo
  describe('clearCart', () => {
    it('deve limpar o carrinho com sucesso', async () => {
      mockPrisma.cart.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.cartItem.deleteMany.mockResolvedValue({});

      const result = await service.clearCart();
      expect(result).toEqual({ message: 'O carrinho foi limpo com sucesso' });
    });
  });

  // teste para verificar o checkout
  describe('checkout', () => {
    // caso de sucesso, realmente conseguiu finalizar a compra
    it('deve realizar o checkout com sucesso', async () => {
      const cart = { id: 1 };
      const cartItems = [
        {
          bookId: 1,
          quantity: 2,
          book: { id: 1, quantity: 5, title: 'Harry Potter' },
        },
      ];
      const order = { id: 123, books: [] };

      mockPrisma.cart.findFirst.mockResolvedValue(cart);
      mockPrisma.cartItem.findMany.mockResolvedValue(cartItems);
      mockPrisma.order.create.mockResolvedValue(order);
      mockPrisma.book.update.mockResolvedValue({});
      mockPrisma.cartItem.deleteMany.mockResolvedValue({});

      const result = await service.checkout();

      expect(mockPrisma.order.create).toHaveBeenCalled();

      expect(mockPrisma.book.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { quantity: 3 },
      });

      expect(mockPrisma.cartItem.deleteMany).toHaveBeenCalledWith({
        where: { cartId: cart.id },
      });

      expect(result).toEqual(order);
    });

    // caso de erro, ao tentar finalizar a compra de um carrinho vazio
    it('deve lançar erro se o carrinho estiver vazio', async () => {
      mockPrisma.cart.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.cartItem.findMany.mockResolvedValue([]);

      await expect(service.checkout()).rejects.toThrow('O carrinho está vazio');
    });

    // caso de erro, ao tentar finalizar a compra de um livro que não tem estoque suficiente
    it('deve lançar erro se algum livro não tiver estoque suficiente', async () => {
      mockPrisma.cart.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.cartItem.findMany.mockResolvedValue([
        {
          bookId: 1,
          quantity: 5,
          book: { id: 1, quantity: 2, title: 'Harry Potter' },
        },
      ]);

      await expect(service.checkout()).rejects.toThrow(
        'Livro "Harry Potter" não possui estoque suficiente. Estoque atual: 2',
      );
    });
  });

  // teste para verificar o generateCartFromBookIds
  describe('generateCartFromBookIds', () => {
    // caso de sucesso, realmente adicionou livros ao carrinho
    it('deve adicionar livros ao carrinho e retornar mensagem', async () => {
      const cart = { id: 1 };
      const books = [{ id: 1, title: 'Harry Potter', quantity: 5 }];

      mockPrisma.cart.findFirst.mockResolvedValue(cart);
      mockPrisma.book.findMany.mockResolvedValue(books);
      mockPrisma.cartItem.findFirst.mockResolvedValue(null);
      mockPrisma.cartItem.create.mockResolvedValue({});

      const result = await service.generateCartFromBookIds([1]);

      expect(mockPrisma.cartItem.create).toHaveBeenCalled();

      expect(result).toEqual({
        message: 'Carrinho sugerido pela IA montado com sucesso',
        livrosAdicionados: ['Harry Potter'],
      });
    });

    // caso de sucesso, se o livro já existia no carrinho, incrementa a quantidade dele
    it('deve incrementar a quantidade se o livro já estiver no carrinho', async () => {
      const cart = { id: 1 };
      const books = [{ id: 1, title: 'Harry Potter', quantity: 5 }];

      mockPrisma.cart.findFirst.mockResolvedValue(cart);
      mockPrisma.book.findMany.mockResolvedValue(books);
      mockPrisma.cartItem.findFirst.mockResolvedValue({
        id: 10,
        quantity: 1,
      });
      mockPrisma.cartItem.update.mockResolvedValue({});

      const result = await service.generateCartFromBookIds([1]);

      expect(mockPrisma.cartItem.update).toHaveBeenCalledWith({
        where: { id: 10 },
        data: { quantity: 2 },
      });

      expect(result).toEqual({
        message: 'Carrinho sugerido pela IA montado com sucesso',
        livrosAdicionados: ['Harry Potter'],
      });
    });

    // caso de erro, a IA não conseguiu encontrar livros parecidos com o solicitado, disponíveis no banco ou com estoque suficiente
    it('deve lançar erro se nenhum livro válido for encontrado', async () => {
      mockPrisma.cart.findFirst.mockResolvedValue({ id: 1 });
      mockPrisma.book.findMany.mockResolvedValue([]);

      await expect(service.generateCartFromBookIds([999])).rejects.toThrow(
        'Nenhum livro foi adicionado ao carrinho. Verifique o estoque ou os IDs fornecidos',
      );
    });
  });
});
