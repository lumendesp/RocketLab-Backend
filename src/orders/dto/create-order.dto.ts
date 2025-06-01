import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BookOrderItem {
  @ApiProperty({ example: 1 })
  @IsInt()
  bookId: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1, { message: 'A quantidade mínima deve ser 1' })
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Array de livros com a quantidade de cada um no pedido',
    example: [
      {
        bookId: 2,
        quantity: 2,
      },
      {
        bookId: 3,
        quantity: 2,
      },
    ],
  })
  @IsArray()
  @ArrayNotEmpty({ message: 'A lista de livros não pode estar vazia' })
  @ValidateNested({ each: true }) 
  @Type(() => BookOrderItem) 
  items: BookOrderItem[];
}
