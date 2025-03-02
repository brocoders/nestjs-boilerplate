import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import bcrypt from 'bcryptjs';
import { RoleEnum } from '../../../../roles/roles.enum';
import { StatusEnum } from '../../../../statuses/statuses.enum';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { stringifyJson } from 'src/logger/logger.helper';

@Injectable()
export class UserSeedService {
  private readonly logger = new Logger(UserSeedService.name);
  private readonly wLogger = new Logger(UserSeedService.name);
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async run() {
    const countAdmin = await this.repository.count({
      where: {
        role: {
          id: RoleEnum.admin,
        },
      },
    });

    if (!countAdmin) {
      const salt = await bcrypt.genSalt();
      const loginPasswd: string = 'fHL9cv9PUEcT';
      const password = await bcrypt.hash(loginPasswd, salt);
      const firstName: string = 'admin';
      const lastName: string = 'admin';
      this.logger.debug(`User seeds for user ${firstName} ${lastName}`);
      const info: Record<string, any> = {
        email: 'admin@gmail.com',
        password,
      };
      this.wLogger.debug(`Info: ${stringifyJson(info)}`);

      await this.repository.save(
        this.repository.create({
          firstName,
          lastName,
          email: 'admin@example.com',
          password,
          role: {
            id: RoleEnum.admin,
            name: 'Admin',
          },
          status: {
            id: StatusEnum.active,
            name: 'Active',
          },
        }),
      );
    }

    // const countUser = await this.repository.count({
    //   where: {
    //     role: {
    //       id: RoleEnum.user,
    //     },
    //   },
    // });

    // if (!countUser) {
    //   const salt = await bcrypt.genSalt();
    //   const password = await bcrypt.hash('3TLOYhXe1FLD', salt);
    //
    //   await this.repository.save(
    //     this.repository.create({
    //       firstName: 'John',
    //       lastName: 'Doe',
    //       email: 'john.doe@example.com',
    //       password,
    //       role: {
    //         id: RoleEnum.user,
    //         name: 'Admin',
    //       },
    //       status: {
    //         id: StatusEnum.active,
    //         name: 'Active',
    //       },
    //     }),
    //   );
    // }
  }
}
