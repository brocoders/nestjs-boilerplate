import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationMember } from '../../../../organization-members/domain/organization-member.entity';

@Injectable()
export class OrganizationMemberSeedService {
  constructor(
    @InjectRepository(OrganizationMember)
    private repository: Repository<OrganizationMember>,
  ) {}

  async run() {
    const count = await this.repository.count();

    if (count === 0) {
      await this.repository.save([
        this.repository.create({
          image: '/themes/default/img/gelap.png',
          title: 'Farida',
          description: 'CEO & Founder',
        }),
        this.repository.create({
          image: '/themes/default/img/gelap.png',
          title: 'Rina',
          description: 'Head of Design',
        }),
        this.repository.create({
          image: '/themes/default/img/gelap.png',
          title: 'Andi',
          description: 'Lead Backend Engineer',
        }),
      ]);
    }
  }
}
