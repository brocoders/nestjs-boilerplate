import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { RoleEnum } from 'src/roles/roles.enum';
import { StatusEnum } from 'src/statuses/statuses.enum';
import { UserSchemaClass } from 'src/users/infrastructure/persistence/document/entities/user.schema';

@Injectable()
export class UserSeedService {
  constructor(
    @InjectModel(UserSchemaClass.name)
    private readonly model: Model<UserSchemaClass>,
  ) {}

  async run() {
    const admin = await this.model.findOne({
      email: 'admin@example.com',
    });

    if (!admin) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      const data = new this.model({
        email: 'admin@example.com',
        password: password,
        firstName: 'Super',
        lastName: 'Admin',
        role: {
          id: RoleEnum.admin,
        },
        status: {
          id: StatusEnum.active,
        },
      });
      await data.save();
    }

    const user = await this.model.findOne({
      email: 'john.doe@example.com',
    });

    if (!user) {
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash('secret', salt);

      const data = new this.model({
        email: 'john.doe@example.com',
        password: password,
        firstName: 'John',
        lastName: 'Doe',
        role: {
          id: RoleEnum.user,
        },
        status: {
          id: StatusEnum.active,
        },
      });

      await data.save();
    }
  }
}
