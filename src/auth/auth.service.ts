import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dtos/auth-email-login.dto';
import { AuthRegisterLoginDto } from './dtos/auth-register-login.dto';
import { AuthUpdateDto } from './dtos/auth-update.dto';
import { AuthSocialLoginDto } from './dtos/auth-social-login.dto';
import { MailerService } from '@nestjs-modules/mailer';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { Forgot } from '../forgot/forgot.entity';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { plainToClass } from 'class-transformer';
import { Status } from 'src/statuses/status.entity';
import { Role } from 'src/roles/role.entity';
import { AuthProvidersEnum } from './auth-providers.enum';
import { AppleService } from 'src/apple/apple.service';
import { FacebookService } from 'src/facebook/facebook.service';
import { GoogleService } from 'src/google/google.service';
import { SocialInterface } from 'src/social/interfaces/social.interface';
import { TwitterService } from 'src/twitter/twitter.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private i18n: I18nService,
    private mailerService: MailerService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private facebookService: FacebookService,
    private googleService: GoogleService,
    private twitterService: TwitterService,
    private appleService: AppleService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Forgot)
    private forgotRepository: Repository<Forgot>,
  ) {}

  async validateLogin(
    loginDto: AuthEmailLoginDto,
    onlyAdmin: boolean,
  ): Promise<{ token: string; user: User }> {
    const user = await this.usersRepository.findOne({
      where: {
        email: loginDto.email,
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

    const userByEmail = await this.usersRepository.findOne({
      email: socialEmail,
    });

    user = await this.usersRepository.findOne({
      socialId: socialData.id,
      provider: dto.socialType,
    });

    if (user) {
      if (socialEmail && !userByEmail) {
        user.email = socialEmail;
      }
      await this.usersRepository.save(user);
    } else if (userByEmail) {
      user = userByEmail;

      if (socialEmail && !userByEmail) {
        user.email = socialEmail;
      }

      await this.usersRepository.save(user);
    } else {
      const role = plainToClass(Role, {
        id: RoleEnum.user,
      });
      const status = plainToClass(Status, {
        id: StatusEnum.active,
      });

      const userFirstName = socialData.firstName ?? dto.firstName;
      const userLastName = socialData.lastName ?? dto.lastName;

      user = await this.usersRepository.save(
        this.usersRepository.create({
          email: socialEmail,
          firstName: userFirstName,
          lastName: userLastName,
          socialId: socialData.id,
          provider: dto.socialType,
          role,
          status,
        }),
      );

      user = await this.usersRepository.findOne(user.id);
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

    const user = await this.usersRepository.save(
      this.usersRepository.create({
        ...dto,
        email: dto.email,
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
      subject: await this.i18n.t('common.confirmEmail'),
      text: `${this.configService.get(
        'app.frontendDomain',
      )}/confirm-email/${hash} ${await this.i18n.t('common.confirmEmail')}`,
      template: 'activation',
      context: {
        title: await this.i18n.t('common.confirmEmail'),
        url: `${this.configService.get(
          'app.frontendDomain',
        )}/confirm-email/${hash}`,
        actionTitle: await this.i18n.t('common.confirmEmail'),
        app_name: this.configService.get('app.name'),
        text1: await this.i18n.t('confirm-email.text1'),
        text2: await this.i18n.t('confirm-email.text2'),
        text3: await this.i18n.t('confirm-email.text3'),
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
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersRepository.findOne({
      email,
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
      await this.forgotRepository.save(
        this.forgotRepository.create({
          hash,
          user,
        }),
      );
      await this.mailerService.sendMail({
        to: email,
        subject: await this.i18n.t('common.resetPassword'),
        text: `${this.configService.get(
          'app.frontendDomain',
        )}/password-change/${hash} ${await this.i18n.t(
          'common.resetPassword',
        )}`,
        template: 'reset-password',
        context: {
          title: await this.i18n.t('common.resetPassword'),
          url: `${this.configService.get(
            'app.frontendDomain',
          )}/password-change/${hash}`,
          actionTitle: await this.i18n.t('common.resetPassword'),
          app_name: this.configService.get('app.name'),
          text1: await this.i18n.t('reset-password.text1'),
          text2: await this.i18n.t('reset-password.text2'),
          text3: await this.i18n.t('reset-password.text3'),
          text4: await this.i18n.t('reset-password.text4'),
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
    await this.forgotRepository.softDelete(forgot.id);
  }

  async me(user: User): Promise<User> {
    return this.usersRepository.findOne({
      id: user.id,
    });
  }

  async update(user: User, userDto: AuthUpdateDto): Promise<User> {
    if (userDto.password) {
      if (userDto.oldPassword) {
        const currentUser = await this.usersRepository.findOne(user.id);

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

    await this.usersRepository.save(
      this.usersRepository.create({
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
