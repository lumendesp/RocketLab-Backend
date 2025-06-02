import { Test, TestingModule } from '@nestjs/testing';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// TESTES UNITÁRIOS PARA BOOKS!!
describe('BooksService', () => {
  let service: BooksService;

  // cria um mock do PrismaService, com as funções usadas no BooksService
  const mockPrisma = {
    book: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  // beforeEach significa que ele vai rodar antes de cada teste e fazer algumas coisas:
  // cria um modulo de teste, simulando o ambiente da aplicação
  // registra o BooksService real e o PrismaService mockado
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
  });

  afterEach(() => jest.clearAllMocks());

  // teste para garantir que o BooksService foi instaciado corretamente
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // teste para verificar se está retornando todos os livros (o get mais básico)
  describe('getBooks', () => {
    it('deve retornar todos os livros com reviews', async () => {
      const result = [{ id: 1, title: 'Livro 1', review: [] }];
      mockPrisma.book.findMany.mockResolvedValue(result);

      expect(await service.getBooks()).toEqual(result);
      expect(mockPrisma.book.findMany).toHaveBeenCalledWith({
        include: { review: true }, // verifica se está incluindo as reviews no retorno
      });
    });
  });

  // teste para verificar a busca por um livro, com base no id fornecido
  describe('findOne', () => {
    // caso de sucesso
    it('deve retornar um livro com reviews pelo id', async () => {
      const result = { id: 1, title: 'Livro', review: [] }; // simulando um livro com id 1
      mockPrisma.book.findUnique.mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result); // quero teste o findOne, passando o id 1 e esperando que ele me retorne o result simulado acima
      expect(mockPrisma.book.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { review: true },
      });
    });

    // caso de erro (quando nenhum livro é encontrado)
    it('deve lançar erro se livro não for encontrado', async () => {
      mockPrisma.book.findUnique.mockResolvedValue(null); // simula a ausência do livro no banco

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException); // verifica se a exceção é lançada corretamente
      await expect(service.findOne(1)).rejects.toThrow('Livro não encontrado'); // e se a mensagem exibida é a correta também
    });
  });

  // teste para verificar se está retornando um ou mais livros com base na palavra do título fornecida
  describe('searchBooks', () => {
    it('deve buscar livros por título, autor ou gênero', async () => {
      const result = [
        { id: 1, title: 'Aventuras', author: 'Fulano', genre: 'Fantasia' },
      ];
      mockPrisma.book.findMany.mockResolvedValue(result);

      expect(await service.searchBooks('fantasia')).toEqual(result);
      expect(mockPrisma.book.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { title: { contains: 'fantasia' } },
            { author: { contains: 'fantasia' } },
            { genre: { contains: 'fantasia' } },
          ],
        },
      });
    });

    it('deve lançar erro se nenhum livro for encontrado', async () => {
      mockPrisma.book.findMany.mockResolvedValue([]);

      await expect(service.searchBooks('inexistente')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.searchBooks('inexistente')).rejects.toThrow(
        'Nenhum livro encontrado com esse termo',
      );
    });

    it('deve lançar erro se o termo de busca estiver vazio ou só com espaços', async () => {
      await expect(service.searchBooks('   ')).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.searchBooks('   ')).rejects.toThrow(
        'A busca não pode estar vazia',
      );
    });
  });

  // testes para o create
  describe('create', () => {
    // caso de sucesso
    it('deve criar um livro com sucesso', async () => {
      const dto: CreateBookDto = {
        title: 'Novo Livro',
        author: 'Autor Teste',
        description: 'Descrição',
        genre: 'Fantasia',
        price: 49.9,
        quantity: 10,
      };

      mockPrisma.book.findFirst.mockResolvedValue(null); // simula que o livro ainda não existe, ou seja, que o findFirst retornou null
      mockPrisma.book.create.mockResolvedValue({ id: 1, ...dto }); // simula que o livro foi criado com sucesso, ou seja, que create retornou um livro e que ele tem id 1

      const result = await service.create(dto);

      // verifica se tudo foi chamado corretamente e se o retorno foi o esperado também
      expect(mockPrisma.book.findFirst).toHaveBeenCalled();
      expect(mockPrisma.book.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual({ id: 1, ...dto });
    });

    // caso de erro
    it('deve lançar erro se o livro já existir', async () => {
      const dto: CreateBookDto = {
        title: 'Duplicado',
        author: 'Autor Teste',
        description: 'Descrição',
        genre: 'Fantasia',
        price: 49.9,
        quantity: 10,
      };

      mockPrisma.book.findFirst.mockResolvedValue({ id: 99, ...dto }); // simula que o livrro já existe, findFirst retornou um id 99

      await expect(service.create(dto)).rejects.toThrow(BadRequestException);
      await expect(service.create(dto)).rejects.toThrow(
        'Já existe um livro com o mesmo título e autor',
      ); // verifica se a função lança um erro com a mensagem esperada
    });
  });

  // teste para o update
  describe('update', () => {
    it('deve atualizar um livro existente', async () => {
      const dto: Partial<UpdateBookDto> = { title: 'Atualizado' };
      mockPrisma.book.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.book.update.mockResolvedValue({ id: 1, ...dto });

      expect(await service.update(1, dto)).toEqual({ id: 1, ...dto });
    });

    it('deve lançar erro se livro não encontrado', async () => {
      mockPrisma.book.findUnique.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
      await expect(service.update(1, {})).rejects.toThrow(
        'Livro não encontrado',
      );
    });
  });

  // teste para o delete
  describe('delete', () => {
    it('deve deletar um livro existente', async () => {
      mockPrisma.book.findUnique.mockResolvedValue({ id: 1 });
      mockPrisma.book.delete.mockResolvedValue({ id: 1 });

      expect(await service.delete(1)).toEqual({ id: 1 });
    });

    it('deve lançar erro se livro não encontrado', async () => {
      mockPrisma.book.findUnique.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
      await expect(service.delete(1)).rejects.toThrow('Livro não encontrado');
    });
  });
});
