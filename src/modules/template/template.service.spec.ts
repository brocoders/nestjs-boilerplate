import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TemplateService } from './template.service';
import { StandardClause } from './entities/standard-clause.entity';
import { CreateStandardClauseDto } from './dto/create-standard-clause.dto';
import { UpdateStandardClauseDto } from './dto/update-standard-clause.dto';
import { NotFoundException } from '@nestjs/common';

describe('TemplateService', () => {
  let service: TemplateService;
  let repository: jest.Mocked<Repository<StandardClause>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateService,
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

    service = module.get(TemplateService);
    repository = module.get(getRepositoryToken(StandardClause));
  });

  describe('create', () => {
    it('should create a template clause', async () => {
      const dto: CreateStandardClauseDto = {
        name: 'Clause',
        type: 'nda',
        text: 'text',
        jurisdiction: 'us',
      } as CreateStandardClauseDto;
      const clause = { id: '1', ...dto } as StandardClause;
      repository.create.mockReturnValue(clause);
      repository.save.mockResolvedValue(clause);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalledWith(clause);
      expect(result).toBe(clause);
    });
  });

  describe('findAll', () => {
    it('should return all active and latest templates', async () => {
      const templates = [
        {
          id: '1',
          name: 'Clause 1',
          isActive: true,
          isLatest: true,
        } as StandardClause,
        {
          id: '2',
          name: 'Clause 2',
          isActive: true,
          isLatest: true,
        } as StandardClause,
      ];
      repository.find.mockResolvedValue(templates);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        where: { isActive: true, isLatest: true },
      });
      expect(result).toBe(templates);
    });
  });

  describe('findOne', () => {
    it('should return the template when found', async () => {
      const template = {
        id: '1',
        name: 'Clause',
        isActive: true,
        isLatest: true,
      } as StandardClause;
      repository.findOne.mockResolvedValue(template);

      const result = await service.findOne('1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1', isActive: true },
      });
      expect(result).toBe(template);
    });

    it('should throw NotFoundException when not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findOne('1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('compareClause', () => {
    it('should compare text and return similarity and deviations', async () => {
      const template = {
        id: '1',
        text: 'standard text',
        type: 'nda',
        jurisdiction: 'us',
        version: '1.0.0',
        isActive: true,
        isLatest: true,
      } as StandardClause;
      repository.findOne.mockResolvedValue(template);

      const result = await service.compareClause('some standard text', '1');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '1', isActive: true },
      });
      expect(result.similarity).toBeGreaterThan(0);
      expect(Array.isArray(result.deviations)).toBe(true);
    });
  });

  describe('update', () => {
    it('should create new version when significant changes', async () => {
      const existing = {
        id: '1',
        name: 'Old',
        text: 'old text',
        type: 'nda',
        jurisdiction: 'us',
        version: '1.0.0',
        isActive: true,
        isLatest: true,
        nextVersions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as StandardClause;
      repository.findOne.mockResolvedValue(existing);
      repository.save.mockImplementation((val: any) => Promise.resolve(val));
      repository.create.mockImplementation((val: any) => val as any);

      const result = await service.update('1', {
        text: 'new text',
      } as UpdateStandardClauseDto);

      expect(repository.save).toHaveBeenCalled();
      expect(result.version).toBe('1.0.1');
    });
  });
});
