import { Controller, Get, Post, Body, Param, Put, Delete, HttpStatus, HttpCode, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() data: { email: string; password: string }) {
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) {
      throw new HttpException(
        {
          message: 'Invalid credentials'
        },
        HttpStatus.FORBIDDEN,
      );
    }
    return this.authService.login(user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() data: User): Promise<void> {
    await this.userService.createUser(data);
  }

  // @Get()
  // async getUsers(): Promise<User[]> {
  //   return this.userService.getUsers();
  // }

  // @Get(':id')
  // async getUserById(@Param('id') id: string): Promise<User | null> {
  //   return this.userService.getUserById(id);
  // }

  // @Put(':id')
  // async updateUser(@Param('id') id: string, @Body() data: User): Promise<User> {
  //   return this.userService.updateUser(id, data);
  // }

  // @Delete(':id')
  // async deleteUser(@Param('id') id: string): Promise<User> {
  //   return this.userService.deleteUser(id);
  // }
}
