import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateMessageDto } from './dto/app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('/:id')
  async getHelloId(@Param('id') id: string) {
    const message = await this.appService.getHelloId(id);
    if (!message) {
      throw new NotFoundException('message not found');
    }

    return message;
  }

  @Post()
  createHello(@Body() body: CreateMessageDto) {
    return this.appService.create(body.content);
  }
}
