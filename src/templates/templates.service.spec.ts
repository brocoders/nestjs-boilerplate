import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TemplatesService } from './templates.service';
import { StandardClause } from './entities/standard-clause.entity';
import { CreateStandardClauseDto } from './dto/create-standard-clause.dto';
import { UpdateStandardClauseDto } from './dto/update-standard-clause.dto';

describe('TemplatesService', () => {
  let service: TemplatesService;
  let repository: jest.Mocked<Repository<StandardClause>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplatesService,
        {
          provide: getRepositoryToken(StandardClause),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(TemplatesService);
    repository = module.get(getRepositoryToken(StandardClause));
  });

  describe('create', () => {
    it('should create a standard clause', async () => {
      const dto: CreateStandardClauseDto = {
        name: 'Test',
        type: 'NDA',
        content: 'Text',
      } as CreateStandardClauseDto;
      const created: StandardClause = {
        id: '1',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...dto,
      } as StandardClause;

      repository.create.mockReturnValue(created);
      repository.save.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith({ isActive: true, ...dto });
      expect(repository.save).toHaveBeenCalledWith(created);
      expect(result).toBe(created);
    });
  });

  describe('findOne', () => {
    it('should return a clause by id', async () => {
      const clause = { id: '1' } as StandardClause;
      repository.findOne.mockResolvedValue(clause);

      const result = await service.findOne('1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1', isActive: true },
      });
      expect(result).toBe(clause);
    });

    it('should throw NotFoundException if clause does not exist', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne('2')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a clause', async () => {
      const clause = { id: '1', name: 'A' } as StandardClause;
      const dto: UpdateStandardClauseDto = { name: 'B' } as UpdateStandardClauseDto;

      repository.findOne.mockResolvedValue(clause);
      repository.save.mockImplementation(async (value) => value as StandardClause);

      const result = await service.update('1', dto);

      expect(repository.save).toHaveBeenCalledWith({ ...clause, ...dto });
      expect(result).toEqual({ ...clause, ...dto });
    });
  });

  describe('remove', () => {
    it('should mark a clause as inactive', async () => {
      const clause = { id: '1', isActive: true } as StandardClause;

      repository.findOne.mockResolvedValue(clause);
      repository.save.mockResolvedValue({ ...clause, isActive: false });

      await service.remove('1');

      expect(repository.save).toHaveBeenCalledWith({ ...clause, isActive: false });
    });
  });

  describe('findByType', () => {
    it('should return clauses by type', async () => {
      const clauses = [{ id: '1' }] as StandardClause[];
      repository.find.mockResolvedValue(clauses);

      const result = await service.findByType('NDA');

      expect(repository.find).toHaveBeenCalledWith({
        where: { type: 'NDA', isActive: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toBe(clauses);
    });
  });

  describe('findByJurisdiction', () => {
    it('should return clauses by jurisdiction', async () => {
      const clauses = [{ id: '1' }] as StandardClause[];
      repository.find.mockResolvedValue(clauses);

      const result = await service.findByJurisdiction('US');

      expect(repository.find).toHaveBeenCalledWith({
        where: { jurisdiction: 'US', isActive: true },
        order: { createdAt: 'DESC' },
      });
      expect(result).toBe(clauses);
    });
  });
});
