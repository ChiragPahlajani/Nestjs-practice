import { Injectable } from '@nestjs/common';
import { AppRepository } from './app.repository';

@Injectable()
export class AppService {
  constructor(public appRepo: AppRepository) {}
  getHello() {
    return this.appRepo.findAll();
  }
  getHelloId(id: string) {
    return this.appRepo.findOne(id);
  }
  create(content: string) {
    return this.appRepo.create(content);
  }
}
