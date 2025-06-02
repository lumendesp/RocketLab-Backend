import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma.service';

// TESTES UNITÁRIOS PARA ORDERS!!
describe('OrdersService', () => {
  let service: OrdersService;

  const mockPrisma = {
    book: {
      findMany: jest.fn(),
      update: jest.fn(),
    },
    order: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // teste para criar um pedido
  describe('create', () => {
    // caso de sucesso (conseguiu fazer um novo pedido)
    it('deve criar pedido com sucesso', async () => {
      const dto = {
        items: [
          { bookId: 1, quantity: 2 },
          { bookId: 2, quantity: 1 },
        ],
      };

      mockPrisma.book.findMany.mockResolvedValue([
        { id: 1, quantity: 5 },
        { id: 2, quantity: 3 },
      ]);

      mockPrisma.book.update.mockResolvedValue({});
      mockPrisma.order.create.mockResolvedValue({ id: 1, books: [] });

      const result = await service.create(dto);

      expect(mockPrisma.book.findMany).toHaveBeenCalledWith({
        where: { id: { in: [1, 2] } },
      });

      expect(mockPrisma.book.update).toHaveBeenCalledTimes(2);

      expect(mockPrisma.order.create).toHaveBeenCalled();

      expect(result).toEqual({ id: 1, books: [] });
    });

    // caso de erro para quando o usuário tenta comprar um livro que não existe no banco
    it('deve lançar erro se algum livro não existir', async () => {
      const dto = {
        items: [{ bookId: 999, quantity: 1 }],
      };

      mockPrisma.book.findMany.mockResolvedValue([]);

      await expect(service.create(dto)).rejects.toThrow(
        'Um ou mais livros não foram encontrados',
      );
    });

    // caso de erro para quando o usuário tenta comprar um livro que não tem estoque suficiente
    it('deve lançar erro se estoque insuficiente', async () => {
      const dto = {
        items: [{ bookId: 1, quantity: 10 }],
      };

      mockPrisma.book.findMany.mockResolvedValue([{ id: 1, quantity: 5 }]);

      await expect(service.create(dto)).rejects.toThrow(
        `Estoque insuficiente para o livro com ID ${dto.items[0].bookId}`,
      );
    });
  });

  // teste para mostrar o histórico de pedidos
  describe('findAll', () => {
    // caso de sucesso, quando existem pedidos no histórico e eles são mostrados corretamente
    it('deve retornar pedidos', async () => {
      const ordersMock = [
        {
          id: 1,
          books: [
            {
              orderId: 1,
              bookId: 1,
              quantity: 2,
              book: { id: 1, title: 'Harry Potter' },
            },
          ],
        },
      ];

      mockPrisma.order.findMany.mockResolvedValue(ordersMock);

      const result = await service.findAll();

      expect(mockPrisma.order.findMany).toHaveBeenCalled();

      expect(result).toHaveLength(1);

      expect(result[0].books[0].orderedQuantity).toBe(2);
    });

    // caso de "erro", quando não existem pedidos feitos
    it('deve lançar erro se nenhum pedido for encontrado', async () => {
      mockPrisma.order.findMany.mockResolvedValue([]);

      await expect(service.findAll()).rejects.toThrow(
        'Nenhum pedido encontrado',
      );
    });
  });
});
