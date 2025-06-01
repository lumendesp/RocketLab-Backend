import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'O Senhor dos Anéis' })
  @IsString()
  @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
  @IsNotEmpty({ message: 'O título não pode estar vazio.' })
  title: string;

  @ApiProperty({ example: 'J.R.R. Tolkien' })
  @IsString()
  @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
  @IsNotEmpty({ message: 'O autor não pode estar vazio.' })
  author: string;

  @ApiProperty({ example: 59.9 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 'Fantasia' })
  @IsString()
  @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
  @IsNotEmpty({ message: 'O gênero não pode estar vazio.' })
  genre: string;

  @ApiProperty({
    example:
      'Uma épica jornada na Terra Média onde a Sociedade do Anel enfrenta perigos para destruir o Anel do Poder.',
  })
  @IsString()
  @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
  @IsNotEmpty({ message: 'A descrição não pode estar vazia.' })
  description: string;

  @ApiProperty({
    example: '3',
  })
  @IsNumber()
  quantity: number;
}
