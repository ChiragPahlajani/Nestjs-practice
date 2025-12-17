import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(input: CreateUserDto) {
    const users = await this.userService.find(input.email);
    if (users.length) {
      throw new BadRequestException('Email is already in use');
    }
    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(input.password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    const user = await this.userService.create(input.email, result);
    return user;
  }

  async signin(input: CreateUserDto) {
    const [user] = await this.userService.find(input.email);
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(input.password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid email or password');
    }
    return user;
  }
}
