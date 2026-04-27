import { Region } from '../../domain/region';

export abstract class RegionAbstractRepository {
  abstract findAllEnabled(): Promise<Region[]>;
  abstract findByCode(code: string): Promise<Region | null>;
  abstract findDefault(): Promise<Region | null>;
}
