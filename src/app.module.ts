import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { PrismaModule } from './prisma.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [BooksModule, PrismaModule, ReviewsModule, OrdersModule], // aqui é onde vão ser feitas as importações de novos módulos
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
