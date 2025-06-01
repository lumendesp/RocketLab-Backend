import { IsInt, IsNotEmpty, IsString, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;

  @ApiProperty({ example: 'Ótimo livro, recomendo!' })
  @IsString()
  @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
  @IsNotEmpty({ message: 'O texto da review não pode estar vazio.' })
  text: string;

  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
  @IsNotEmpty({ message: 'O nome não pode estar vazio.' })
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  bookId: number;
}
