import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// o controller recebe as requisições (get, put, delete, etc) e chama o service, que é onde a lógica vai ser executada de verdade

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
