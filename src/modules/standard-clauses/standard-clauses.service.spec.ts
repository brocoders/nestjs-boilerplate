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
      };
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

  describe('findAll', () => {
    it('should return all clauses', async () => {
      const clauses = [{ id: 1 }, { id: 2 }] as StandardClause[];
      (repo.find as jest.Mock).mockResolvedValue(clauses);

      const result = await service.findAll();

      expect(repo.find).toHaveBeenCalled();
      expect(result).toBe(clauses);
    });
  });

  describe('findByType', () => {
    it('should return clauses by type', async () => {
      const type = 'confidentiality';
      const clauses = [{ id: 1, type }] as StandardClause[];
      (repo.find as jest.Mock).mockResolvedValue(clauses);

      const result = await service.findByType(type);

      expect(repo.find).toHaveBeenCalledWith({ where: { type } });
      expect(result).toBe(clauses);
    });
  });

  describe('findByContractType', () => {
    it('should return clauses by contract type', async () => {
      const contractType = 'NDA';
      const clauses = [{ id: 1, contractType }] as StandardClause[];
      (repo.find as jest.Mock).mockResolvedValue(clauses);

      const result = await service.findByContractType(contractType);

      expect(repo.find).toHaveBeenCalledWith({ where: { contractType } });
      expect(result).toBe(clauses);
    });
  });

  describe('update', () => {
    it('should update and return the clause', async () => {
      const id = 1;
      const existing = {
        id,
        name: 'A',
        type: 't',
        contractType: 'c',
        text: 'txt',
      } as StandardClause;
      const dto = { name: 'B', text: 'new text' };
      const updated = { ...existing, ...dto } as StandardClause;
      (service.findOne as jest.Mock).mockResolvedValue(existing);
      (repo.save as jest.Mock).mockResolvedValue(updated);

      // Patch service.findOne to be a jest mock for this test
      const origFindOne = service.findOne;
      service.findOne = jest.fn().mockResolvedValue(existing);

      const result = await service.update(id, dto);

      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(repo.save).toHaveBeenCalledWith({ ...existing, ...dto });
      expect(result).toBe(updated);

      // Restore original findOne
      service.findOne = origFindOne;
    });
  });
});
