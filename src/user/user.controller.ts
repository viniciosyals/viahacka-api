import {
  Req,
  Res,
  Controller,
  Body,
  Get,
  Post,
  Put,
  HttpStatus,
  HttpException,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt.auth.guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async create(@Res() res, @Body() data) {
    const entity = await this.userService.findByEmail(data.email);

    try {
      if (entity) {
        throw { message: 'Email já cadastrado.', status: HttpStatus.CONFLICT };
      }

      await this.userService.create({
        ...{
          name: data.name,
          email: data.email,
          password: data.password,
        },
      });

      res.sendStatus(HttpStatus.CREATED);
    } catch (err) {
      throw new HttpException(err.message, err.status || err.response.status);
    }
  }

  @Post('auth')
  async authorize(@Body() data, @Res() res) {
    const entity = await this.authService.validateUser(
      data.email,
      data.password,
    );

    if (!entity) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    const token = await this.authService.createToken({
      id: entity.id,
      email: entity.email,
    });

    res.status(HttpStatus.OK).json({ user: entity, token: token });
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth')
  async validate(@Req() req, @Res() res) {
    res.status(HttpStatus.OK).json(req.user);
  }
}
