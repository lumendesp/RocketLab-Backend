import { Test, TestingModule } from '@nestjs/testing';
import { ReviewsService } from './reviews.service';
import { PrismaService } from '../prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

// TESTES UNITÁRIOS PARA REVIEWS!!
describe('ReviewsService', () => {
  let service: ReviewsService;

  const mockPrisma = {
    book: {
      findUnique: jest.fn(),
    },
    review: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // teste para o método create
  describe('create', () => {
    // criação de uma review com sucesso
    it('deve criar uma review com sucesso se o livro existir', async () => {
      // simulando uma entrada
      const dto: CreateReviewDto = {
        bookId: 1,
        name: 'Maria Luísa',
        text: 'Amei o livro!',
        score: 5,
      };

      mockPrisma.book.findUnique.mockResolvedValue({ id: 1 }); // simulando que o livro foi encontrado no banco
      mockPrisma.review.create.mockResolvedValue({ id: 1, ...dto }); // o retorno esperado é o id e os dados da review

      const result = await service.create(dto); // chamada da função com o dto criado

      // confirma se o findUnique foi chamado corretamente
      expect(mockPrisma.book.findUnique).toHaveBeenCalledWith({
        where: { id: dto.bookId },
      });

      // confirma que a criação da review foi chamada com os dados corretos
      expect(mockPrisma.review.create).toHaveBeenCalledWith({ data: dto });

      // verifica se o resultado retornado é realmente o esperado
      expect(result).toEqual({ id: 1, ...dto });
    });

    // caso de erro: a pessoa tentou fazer uma review com um ID que não existe no banco (livro não encontrado)
    it('deve lançar erro se o livro não for encontrado', async () => {
      // o mock vai retornar null, simulando nenhum livro encontrado
      mockPrisma.book.findUnique.mockResolvedValue(null);

      // chamando a função com os dados inválidos e verificando se a exceção foi lançada com a mensagem esperada
      await expect(
        service.create({
          bookId: 999,
          name: 'Fulano',
          text: 'Não gostei muito da escrita da autora',
          score: 2,
        }),
      ).rejects.toThrow('Livro não encontrado');
    });
  });

  // teste para o findByBook, que é o de retornar as reviews de um determinado livro
  describe('findByBook', () => {
    // caso de sucesso
    it('deve retornar as reviews de um livro existente', async () => {
      const bookId = 1; // o livro que vai ser buscado

      // as reviews que fazem parte desse livro e devem ser retornadas
      const reviews = [
        { id: 1, bookId, name: 'Maria Luísa', text: 'Amei o livro!', score: 5 },
        {
          id: 2,
          bookId,
          name: 'Fulano de tal',
          text: 'Um bom livro',
          score: 4,
        },
      ];

      // simula que o  livro existe e que foi encontrado
      mockPrisma.book.findUnique.mockResolvedValue({ id: bookId });

      // simula que o prisma retorna o array de reviews
      mockPrisma.review.findMany.mockResolvedValue(reviews);

      // chama a função, passando o id como parâmentro
      const result = await service.findByBook(bookId);

      // verifica se o findUnique foi chamado corretamente
      expect(mockPrisma.book.findUnique).toHaveBeenCalledWith({
        where: { id: bookId },
      });

      // verifica se o findMany foi chamado com os parâmetros certos para buscar as reviews do livro, ordenadas por data de criação (mais recente primeiro)
      expect(mockPrisma.review.findMany).toHaveBeenCalledWith({
        where: { bookId },
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(reviews); // se o resultado retornado é o mesmo array simulado
    });

    // caso de erro para quando o usuário tenta buscar reviews de um livro que não existe
    it('deve lançar erro se o livro não existir', async () => {
      mockPrisma.book.findUnique.mockResolvedValue(null);

      await expect(service.findByBook(999)).rejects.toThrow(
        'Livro não encontrado',
      );
    });

    // caso para quando o usuário tenta buscar reviews de um livro que ainda não tem reviews
    it('deve lançar erro se nenhuma review for encontrada para o livro', async () => {
      const bookId = 1;

      mockPrisma.book.findUnique.mockResolvedValue({ id: bookId });
      mockPrisma.review.findMany.mockResolvedValue([]);

      await expect(service.findByBook(bookId)).rejects.toThrow(
        'Nenhuma review encontrada para esse livro',
      );
    });
  });
});
