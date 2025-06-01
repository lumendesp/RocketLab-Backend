import { IsOptional, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateBookDto {
  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
  @IsNotEmpty({ message: 'O título não pode estar vazio.' })
  title?: string;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
  @IsNotEmpty({ message: 'O autor não pode estar vazio.' })
  author?: string;

  @ApiPropertyOptional({ example: 0.0 })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiPropertyOptional({ example: '' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
  @IsNotEmpty({ message: 'O gênero não pode estar vazio.' })
  genre?: string;

  @ApiPropertyOptional({
    example: '',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim().replace(/\s+/g, ' '))
  @IsNotEmpty({ message: 'A descrição não pode estar vazia.' })
  description?: string;

  @ApiPropertyOptional({
    example: 0,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;
}
