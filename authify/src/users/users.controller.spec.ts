import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let authService: Partial<AuthService>;
  let usersService: Partial<UsersService>;
  beforeEach(async () => {
    usersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
      },
    };
    authService = {
      signin: (input: { email: string; password: string }) => {
        return Promise.resolve({
          id: 1,
          email: input.email,
          password: 'asdf',
        } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: usersService },
        { provide: AuthService, useValue: authService },
      ],
    }).compile();
    usersController = module.get<UsersController>(UsersController);
  });
  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });
  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await usersController.findAllUsers('asdf@asdf.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await usersController.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    usersService.findOne = () => null;
    await expect(usersController.findUser('1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await usersController.signin(
      { email: 'asdf@asdf.com', password: 'asdf' },
      session,
    );

    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
