import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from './user.entity';
describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];
    usersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();
    authService = module.get(AuthService);
  });
  it('can create an instance of auth service', () => {
    expect(authService).toBeDefined();
  });
  it('creates a new user with a salted and hashed password', async () => {
    const user = await authService.signup({
      email: 'asdf@asdf.com',
      password: 'asdf',
    });

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throws an error if user signs up with email that is in use', async () => {
    await authService.signup({ email: 'asdf@asdf.com', password: 'asdf' });
    await expect(
      authService.signup({ email: 'asdf@asdf.com', password: 'asdf' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(
      authService.signin({
        email: 'asdflkj@asdlfkj.com',
        password: 'passdflkj',
      }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await authService.signup({
      email: 'laskdjf@alskdfj.com',
      password: 'password',
    });
    await expect(
      authService.signin({
        email: 'laskdjf@alskdfj.com',
        password: 'laksdlfkj',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if correct password is provided', async () => {
    await authService.signup({
      email: 'asdf@asdf.com',
      password: 'mypassword',
    });

    const user = await authService.signin({
      email: 'asdf@asdf.com',
      password: 'mypassword',
    });
    expect(user).toBeDefined();
  });
});
