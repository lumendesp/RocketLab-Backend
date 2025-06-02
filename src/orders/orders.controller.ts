import { Controller, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('view-orders')
  @ApiOperation({
    summary: 'Retorna todos os pedidos realizados no banco',
  })
  async viewOrders() {
    return await this.ordersService.findAll();
  }
}
