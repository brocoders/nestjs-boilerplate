import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  KycDetailsEntity,
  KycStatus,
  KycSubjectType,
} from 'src/kyc-details/infrastructure/persistence/relational/entities/kyc-details.entity';
import { Repository } from 'typeorm';
import { TenantEntity } from 'src/tenants/infrastructure/persistence/relational/entities/tenant.entity';
import { UserEntity } from 'src/users/infrastructure/persistence/relational/entities/user.entity';

@Injectable()
export class KycDetailSeedService {
  constructor(
    @InjectRepository(KycDetailsEntity)
    private readonly kycRepository: Repository<KycDetailsEntity>,
    @InjectRepository(TenantEntity)
    private readonly tenantRepository: Repository<TenantEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async run() {
    // Create KYC records for all users (individual verification)
    const users = await this.userRepository.find({
      relations: ['tenant'],
    });

    for (const user of users) {
      const existingKyc = await this.kycRepository.findOne({
        where: {
          user: { id: user.id },
          subjectType: KycSubjectType.USER,
        },
      });

      if (!existingKyc) {
        await this.kycRepository.save(
          this.kycRepository.create({
            subjectType: KycSubjectType.USER,
            status: KycStatus.PENDING,
            tenant: user.tenant,
            user: user,
          }),
        );
      }
    }

    // Create KYC records for all tenants (organization verification)
    const tenants = await this.tenantRepository.find({
      relations: ['users'],
    });

    for (const tenant of tenants) {
      // Use the first user in the tenant as the submitting user
      const submittingUser = tenant.users?.[0];

      if (submittingUser) {
        const existingKyc = await this.kycRepository.findOne({
          where: {
            tenant: { id: tenant.id },
            subjectType: KycSubjectType.TENANT,
          },
        });

        if (!existingKyc) {
          await this.kycRepository.save(
            this.kycRepository.create({
              subjectType: KycSubjectType.TENANT,
              status: KycStatus.PENDING,
              tenant: tenant,
              user: submittingUser,
            }),
          );
        }
      }
    }
  }
}
