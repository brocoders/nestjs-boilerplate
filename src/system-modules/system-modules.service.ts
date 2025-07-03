import {
  // common
  Injectable,
} from '@nestjs/common';
import { CreateSystemModuleDto } from './dto/create-system-module.dto';
import { UpdateSystemModuleDto } from './dto/update-system-module.dto';
import { SystemModuleRepository } from './infrastructure/persistence/system-module.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { SystemModule } from './domain/system-module';

@Injectable()
export class SystemModulesService {
  constructor(
    // Dependencies here
    private readonly systemModuleRepository: SystemModuleRepository,
  ) {}

  async create(createSystemModuleDto: CreateSystemModuleDto) {
    // Do not remove comment below.
    // <creating-property />

    return this.systemModuleRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      submodules: createSystemModuleDto.submodules,

      description: createSystemModuleDto.description,

      name: createSystemModuleDto.name,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.systemModuleRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: SystemModule['id']) {
    return this.systemModuleRepository.findById(id);
  }

  findByIds(ids: SystemModule['id'][]) {
    return this.systemModuleRepository.findByIds(ids);
  }

  async update(
    id: SystemModule['id'],

    updateSystemModuleDto: UpdateSystemModuleDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    return this.systemModuleRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      submodules: updateSystemModuleDto.submodules,

      description: updateSystemModuleDto.description,

      name: updateSystemModuleDto.name,
    });
  }

  remove(id: SystemModule['id']) {
    return this.systemModuleRepository.remove(id);
  }
}
