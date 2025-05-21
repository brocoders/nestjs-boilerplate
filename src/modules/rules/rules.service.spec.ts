import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RulesService } from './rules.service';
import { Rule } from '../../entities/rule.entity';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('RulesService', () => {
  let service: RulesService;
  let repository: jest.Mocked<Repository<Rule>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RulesService,
        {
          provide: getRepositoryToken(Rule),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(RulesService);
    repository = module.get(getRepositoryToken(Rule));
  });

  describe('create', () => {
    it('should create a rule', async () => {
      const dto: CreateRuleDto = {
        name: 'Test',
        similarityThreshold: 10,
      } as CreateRuleDto;
      const rule = { id: '1', ...dto } as Rule;
      repository.create.mockReturnValue(rule);
      repository.save.mockResolvedValue(rule);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(rule);
      expect(result).toBe(rule);
    });

    it('should throw BadRequestException when thresholds conflict', async () => {
      const dto: CreateRuleDto = {
        name: 'Bad',
        similarityThreshold: 10,
        deviationAllowedPct: 5,
      } as CreateRuleDto;

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a rule when found', async () => {
      const rule = { id: '1', name: 'Test' } as Rule;
      repository.findOne.mockResolvedValue(rule);

      const result = await service.findOne('1');
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(result).toBe(rule);
    });

    it('should throw NotFoundException when rule not found', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findOne('2')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing rule', async () => {
      const rule = { id: '1', name: 'Test' } as Rule;
      repository.findOne.mockResolvedValue(rule);
      repository.save.mockResolvedValue({ ...rule, name: 'Updated' });

      const result = await service.update('1', {
        name: 'Updated',
      } as UpdateRuleDto);

      expect(repository.save).toHaveBeenCalledWith({
        ...rule,
        name: 'Updated',
      });
      expect(result.name).toBe('Updated');
    });

    it('should throw BadRequestException when thresholds conflict', async () => {
      const rule = { id: '1', name: 'Test' } as Rule;
      repository.findOne.mockResolvedValue(rule);

      await expect(
        service.update('1', {
          similarityThreshold: 1,
          deviationAllowedPct: 1,
        } as UpdateRuleDto),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a rule', async () => {
      const rule = { id: '1' } as Rule;
      repository.findOne.mockResolvedValue(rule);
      repository.remove.mockResolvedValue(rule);

      await service.remove('1');
      expect(repository.remove).toHaveBeenCalledWith(rule);
    });
  });
});
