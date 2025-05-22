import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StandardClausesService } from './standard-clauses.service';
import { StandardClause } from '../../entities/standard-clause.entity';
import { NotFoundException } from '@nestjs/common';

describe('StandardClausesService', () => {
  let service: StandardClausesService;
  let repo: jest.Mocked<Repository<StandardClause>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StandardClausesService,
        {
          provide: getRepositoryToken(StandardClause),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(StandardClausesService);
    repo = module.get(getRepositoryToken(StandardClause));
  });

  describe('create', () => {
    it('should create and save clause', async () => {
      const dto = {
        name: 'A',
        type: 't',
        contractType: 'c',
        text: 'txt',
      } as any;
      const entity = { id: 1, ...dto } as StandardClause;
      (repo.create as jest.Mock).mockReturnValue(entity);
      (repo.save as jest.Mock).mockResolvedValue(entity);

      const result = await service.create(dto);

      expect(repo.create).toHaveBeenCalledWith(dto);
      expect(repo.save).toHaveBeenCalledWith(entity);
      expect(result).toBe(entity);
    });
  });

  describe('findOne', () => {
    it('should return clause when found', async () => {
      const clause = { id: 1 } as StandardClause;
      (repo.findOne as jest.Mock).mockResolvedValue(clause);

      const result = await service.findOne(1);

      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(clause);
    });

    it('should throw NotFoundException when not found', async () => {
      (repo.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(service.findOne(2)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete clause', async () => {
      (repo.delete as jest.Mock).mockResolvedValue({ affected: 1 });
      await service.remove(1);
      expect(repo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when nothing deleted', async () => {
      (repo.delete as jest.Mock).mockResolvedValue({ affected: 0 });
      await expect(service.remove(1)).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
