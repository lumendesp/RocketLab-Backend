import { Controller, Post, Body, Get, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('make-an-order')
  @ApiOperation({
    summary: 'Faz a criação de um pedido no banco, através dos ids fornecidos',
  })
  async makeAnOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.ordersService.create(createOrderDto);
  }

  @Get('view-orders')
  @ApiOperation({
    summary: 'Retorna todos os pedidos realizados no banco',
  })
  async viewOrders() {
    return await this.ordersService.findAll();
  }

  // @Delete('reset')
  // async reset() {
  //   await this.ordersService.resetOrders();
  //   return { message: 'Orders reset and autoincrement restarted' };
  // }
}
