import { Module } from '@nestjs/common';
import { BooksModule } from './books/books.module';
import { PrismaModule } from './prisma.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';
import { CartModule } from './cart/cart.module';
import { AiService } from './ai/ai.service';

@Module({
  imports: [BooksModule, PrismaModule, ReviewsModule, OrdersModule, CartModule], // aqui é onde vão ser feitas as importações de novos módulos
  providers: [AiService],
})
export class AppModule {}
