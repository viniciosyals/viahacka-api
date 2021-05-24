import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schemas/user';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> | null {
    const entity = await this.userService.findByEmail(email);
    const entityPrivate = await this.userService.findById(entity.id);
    if (!entity) {
      return null;
    }
    const matchPassword = await this.userService.verifyPassword(
      password,
      entityPrivate.password,
    );
    if (entity && matchPassword) {
      return entity;
    }
    return null;
  }

  async createToken(data: any) {
    return this.jwtService.sign(
      {
        sub: data.id,
        email: data.email,
      },
      {
        secret: process.env.JWT_SECRET,
      },
    );
  }
}
