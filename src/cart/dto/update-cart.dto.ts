import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class UpdateCartDto {
  @ApiProperty({ example: 2 })
  @IsInt()
  bookId: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1, { message: 'A quantidade mínima deve ser 1' })
  quantity: number;
}
