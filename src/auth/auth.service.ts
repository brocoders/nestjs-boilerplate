import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthRegisterLoginDto, AuthUpdateDto } from './auth.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Forgot } from '../forgot/forgot.entity';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { Status } from 'src/statuses/status.entity';

@Injectable()
export class AuthService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    private jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Forgot)
    private forgotRepository: Repository<Forgot>,
  ) {}

  async validateLogin(
    email: string,
    password: string,
    onlyAdmin: boolean,
  ): Promise<{ token: string; user: User }> {
    const user = await this.usersRepository.findOne({
      where: {
        email: email.toLowerCase(),
        role: onlyAdmin ? In([RoleEnum.admin]) : In([RoleEnum.user]),
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      const token = await this.jwtService.sign({
        id: user.id,
        role: user.role,
      });

      return { token, user: user };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user = await this.usersRepository.save(
      plainToClass(User, {
        ...dto,
        email: dto.email?.toLowerCase(),
        role: {
          id: RoleEnum.user,
        },
        status: {
          id: StatusEnum.inactive,
        },
        hash,
      }),
    );

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Confirm email',
      text: `${this.configService.get(
        'app.domain',
      )}/confirm-email/${hash} Confirm email`,
      template: 'activation',
      context: {
        url: `${this.configService.get('app.domain')}/confirm-email/${hash}`,
      },
    });
  }

  async confirmEmail(hash: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      hash,
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `notFound`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    user.hash = null;
    user.status = plainToClass(Status, {
      id: StatusEnum.active,
    });
    user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      email: email?.toLowerCase(),
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'User not found',
          },
        },
        HttpStatus.NOT_FOUND,
      );
    } else {
      const hash = crypto
        .createHash('sha256')
        .update(randomStringGenerator())
        .digest('hex');
      await this.forgotRepository.save(
        plainToClass(Forgot, {
          hash,
          user,
        }),
      );
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset password',
        text: `${this.configService.get(
          'app.domain',
        )}/password-change/${hash} Reset password`,
        template: 'reset-password',
        context: {
          url: `${this.configService.get(
            'app.domain',
          )}/password-change/${hash}`,
        },
      });
    }
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    const forgot = await this.forgotRepository.findOne({
      hash,
    });

    if (!forgot) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: `Not found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const user = forgot.user;
    user.password = password;
    user.save();
    await this.forgotRepository.softDelete(forgot.id);
  }

  async me(user: User): Promise<User> {
    return this.usersRepository.findOne({
      id: user.id,
    });
  }

  async update(user: User, userDto: AuthUpdateDto): Promise<User> {
    await this.usersRepository.save(
      plainToClass(User, {
        id: user.id,
        ...userDto,
      }),
    );

    return this.usersRepository.findOne(user.id);
  }

  async softDelete(user: User): Promise<void> {
    await this.usersRepository.softDelete(user.id);
  }
}
