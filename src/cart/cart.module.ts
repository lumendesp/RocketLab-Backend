import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AiService } from 'src/ai/ai.service';

@Module({
  providers: [CartService, AiService],
  controllers: [CartController]
})
export class CartModule {}
