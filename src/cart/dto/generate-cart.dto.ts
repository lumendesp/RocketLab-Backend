import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateCartDto {
  @ApiProperty({
    example:
      'Estou procurando livros emocionantes sobre mistério e aventura, o que você sugere?',
  })
  @IsString()
  text: string;
}
