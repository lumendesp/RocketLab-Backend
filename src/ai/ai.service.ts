import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OpenAI } from 'openai';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AiService {
  private openai: OpenAI;

  // recebe o prisma para buscar os livros no banco
  // garante o acesso à api, através da chave fornecida no .env
  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.VITE_GROQ_API_KEY,
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  // esse método recebe a preferência do cliente (o texto) e retorna uma lista de IDs dos livros recomendados
  async generateCartSuggestion(promptText: string): Promise<number[]> {
    try {
      // pega os livros no banco (coloquei um limite de 30, para não correr o risco de estourar o prompt)
      const books = await this.prisma.book.findMany({ take: 30 });

      // transforma os livros em um texto descritivo, com índice, título, descrição e gênero
      const booksDescription = books
        .map(
          (book, i) =>
            `${i + 1}. "${book.title}" - ${book.description} (Gênero: ${book.genre})`,
        )
        .join('\n');

      // montagem da mensagem que será enviada à IA
      const fullPrompt = `
        Livros disponíveis:
        ${booksDescription}

        Baseado nesses livros, sugira uma lista JSON contendo os IDs dos livros que o cliente deve comprar para a preferência:
        "${promptText}"

        Responda somente com o JSON, exemplo: [1, 3, 5]
        `;

      // chamada da API do groq, com as instruções e o prompt completo
      const completion = await this.openai.chat.completions.create({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        messages: [
          {
            role: 'system',
            content:
              'Você é um assistente de loja de livros. Sugira livros com base nos livros disponíveis e preferência do cliente.',
          },
          {
            role: 'user',
            content: fullPrompt,
          },
        ],
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content || '[]';

      // aqui, tenta converter a resposta da IA em um array de números, por exemplo, [1, 2, 3] seria o array de índices de livros sugeridos pela IA
      try {
        const bookIds = JSON.parse(response);
        if (Array.isArray(bookIds)) {
          return bookIds;
        }
        return [];
      } catch {
        // se der algum erro, retorna um array vazio
        return [];
      }
    } catch (error) {
      // tratamento de erro caso nem chegue a executar a IA
      console.error(error);
      throw new InternalServerErrorException(
        'Erro ao gerar sugestão de carrinho.',
      );
    }
  }
}
