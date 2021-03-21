import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthUpdateDto } from './dtos/auth-update.dto';
import { AuthSocialLoginDto } from './dtos/auth-social-login.dto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import * as crypto from 'crypto';
import { plainToClass } from 'class-transformer';
import { Status } from 'src/statuses/status.entity';
import { Role } from 'src/roles/role.entity';
import { AuthProvidersEnum } from './auth-providers.enum';
import { AppleService } from 'src/apple/apple.service';
import { FacebookService } from 'src/facebook/facebook.service';
import { GoogleService } from 'src/google/google.service';
import { SocialInterface } from 'src/social/interfaces/social.interface';
import { TwitterService } from 'src/twitter/twitter.service';
import { AuthRegisterLoginDto } from './dtos/auth-register-login.dto';
import { UsersService } from 'src/users/users.service';
import { ForgotService } from 'src/forgot/forgot.service';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private facebookService: FacebookService,
    private googleService: GoogleService,
    private twitterService: TwitterService,
    private appleService: AppleService,
    private usersService: UsersService,
    private forgotService: ForgotService,
    private mailService: MailService,
  ) {}

  async validateLogin(
    loginDto: AuthEmailLoginDto,
    onlyAdmin: boolean,
  ): Promise<{ token: string; user: User }> {
    const user = await this.usersService.findOneEntity({
      where: {
        email: loginDto.email,
      },
    });

    if (
      !user ||
      (user &&
        !(onlyAdmin ? [RoleEnum.admin] : [RoleEnum.user]).includes(
          user.role.id,
        ))
    ) {
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

    const isValidPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

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

  async validateSocialLogin(
    dto: AuthSocialLoginDto,
  ): Promise<{ token: string; user: User }> {
    let socialData: SocialInterface;
    let user: User;

    switch (dto.socialType) {
      case AuthProvidersEnum.facebook:
        socialData = await this.facebookService.getProfileByToken(dto.tokens);
        break;
      case AuthProvidersEnum.google:
        socialData = await this.googleService.getProfileByToken(dto.tokens);
        break;
      case AuthProvidersEnum.twitter:
        socialData = await this.twitterService.getProfileByToken(dto.tokens);
        break;
      case AuthProvidersEnum.apple:
        socialData = await this.appleService.getProfileByToken(dto.tokens);
        break;
      default:
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              socialType: 'notFountSocialType',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
    }

    const socialEmail = socialData.email?.toLowerCase();

    const userByEmail = await this.usersService.findOneEntity({
      where: {
        email: socialEmail,
      },
    });

    user = await this.usersService.findOneEntity({
      where: {
        socialId: socialData.id,
        provider: dto.socialType,
      },
    });

    if (user) {
      if (socialEmail && !userByEmail) {
        user.email = socialEmail;
      }
      await this.usersService.saveEntity(user);
    } else if (userByEmail) {
      user = userByEmail;

      if (socialEmail && !userByEmail) {
        user.email = socialEmail;
      }

      await this.usersService.saveEntity(user);
    } else {
      const role = plainToClass(Role, {
        id: RoleEnum.user,
      });
      const status = plainToClass(Status, {
        id: StatusEnum.active,
      });

      const userFirstName = socialData.firstName ?? dto.firstName;
      const userLastName = socialData.lastName ?? dto.lastName;

      user = await this.usersService.saveEntity({
        email: socialEmail,
        firstName: userFirstName,
        lastName: userLastName,
        socialId: socialData.id,
        provider: dto.socialType,
        role,
        status,
      });

      user = await this.usersService.findOneEntity({
        where: {
          id: user.id,
        },
      });
    }

    const jwtToken = await this.jwtService.sign({
      id: user.id,
      role: user.role,
    });

    return {
      token: jwtToken,
      user,
    };
  }

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    const user = await this.usersService.saveEntity({
      ...dto,
      email: dto.email,
      role: {
        id: RoleEnum.user,
      },
      status: {
        id: StatusEnum.inactive,
      },
      hash,
    });

    await this.mailService.userSignUp({
      to: user.email,
      data: {
        hash,
      },
    });
  }

  async confirmEmail(hash: string): Promise<void> {
    const user = await this.usersService.findOneEntity({
      where: {
        hash,
      },
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
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findOneEntity({
      where: {
        email,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailNotExists',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    } else {
      const hash = crypto
        .createHash('sha256')
        .update(randomStringGenerator())
        .digest('hex');
      await this.forgotService.saveEntity({
        hash,
        user,
      });

      await this.mailService.forgotPassword({
        to: email,
        data: {
          hash,
        },
      });
    }
  }

  async resetPassword(hash: string, password: string): Promise<void> {
    const forgot = await this.forgotService.findOneEntity({
      where: {
        hash,
      },
    });

    if (!forgot) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            hash: `notFound`,
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const user = forgot.user;
    user.password = password;
    await user.save();
    await this.forgotService.softDelete(forgot.id);
  }

  async me(user: User): Promise<User> {
    return this.usersService.findOneEntity({
      where: {
        id: user.id,
      },
    });
  }

  async update(user: User, userDto: AuthUpdateDto): Promise<User> {
    if (userDto.password) {
      if (userDto.oldPassword) {
        const currentUser = await this.usersService.findOneEntity({
          where: {
            id: user.id,
          },
        });

        const isValidOldPassword = await bcrypt.compare(
          userDto.oldPassword,
          currentUser.password,
        );

        if (!isValidOldPassword) {
          throw new HttpException(
            {
              status: HttpStatus.UNPROCESSABLE_ENTITY,
              errors: {
                oldPassword: 'incorrectOldPassword',
              },
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      } else {
        throw new HttpException(
          {
            status: HttpStatus.UNPROCESSABLE_ENTITY,
            errors: {
              oldPassword: 'missingOldPassword',
            },
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }

    await this.usersService.saveEntity({
      id: user.id,
      ...userDto,
    });

    return this.usersService.findOneEntity({
      where: {
        id: user.id,
      },
    });
  }

  async softDelete(user: User): Promise<void> {
    await this.usersService.softDelete(user.id);
  }
}
