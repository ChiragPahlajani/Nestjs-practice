import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class UsersController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async createUser(@Body() input: CreateUserDto) {
    const user = await this.authService.signup(input);
    return user;
  }

  @Post('/signin')
  async signin(@Body() input: CreateUserDto) {
    const user = await this.authService.signin(input);
    return user;
  }
}
