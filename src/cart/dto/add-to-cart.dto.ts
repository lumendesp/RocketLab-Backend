import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  bookId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1, { message: 'A quantidade mínima deve ser 1' })
  quantity: number;
}
