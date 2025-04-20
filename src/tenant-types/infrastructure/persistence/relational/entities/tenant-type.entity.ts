import {
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { EntityRelationalHelper } from '../../../../../utils/relational-entity-helper';

export enum TenantTypeCode {
  COMMUNITY_GROUP = 'community_group',
  RECYCLING_COMPANY = 'recycling_company',
  COLLECTION_AGENCY = 'collection_agency',
  MUNICIPALITY = 'municipality',
  ENTERPRISE = 'enterprise',
  EDUCATIONAL_INSTITUTION = 'educational_institution',
  HEALTHCARE_PROVIDER = 'healthcare_provider',
  NON_PROFIT_ORGANIZATION = 'non_profit_organization',
  GOVERNMENT_AGENCY = 'government_agency',
  TECHNOLOGY_COMPANY = 'technology_company',
  RETAIL_BUSINESS = 'retail_business',
  MANUFACTURING_COMPANY = 'manufacturing_company',
  TRANSPORTATION_SERVICE = 'transportation_service',
  FINANCIAL_INSTITUTION = 'financial_institution',
  AGRICULTURAL_BUSINESS = 'agricultural_business',
  ENERGY_PROVIDER = 'energy_provider',
  CONSTRUCTION_COMPANY = 'construction_company',
  HOSPITALITY_BUSINESS = 'hospitality_business',
  GENERIC = 'generic', // Default fallback
}

@Entity({
  name: 'tenant_type',
})
export class TenantTypeEntity extends EntityRelationalHelper {
  @Column({
    nullable: true,
    type: String,
  })
  description?: string | null;

  @Column({
    type: 'enum',
    enum: TenantTypeCode,
    unique: true,
  })
  code: TenantTypeCode;

  @Column({
    nullable: true,
    type: String,
  })
  name?: string | null;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
