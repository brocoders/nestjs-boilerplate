import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalysisService } from './analysis.service';
import { AiService } from '../ai/ai.service';
import {
  Contract,
  ContractStatus,
  ContractType,
} from './entities/contract.entity';
import { Clause } from './entities/clause.entity';
import { RiskFlag } from './entities/risk-flag.entity';
import { Summary } from './entities/summary.entity';
import { QnA } from './entities/qna.entity';
import { HumanReview } from './entities/human-review.entity';
import { NotFoundException } from '@nestjs/common';

describe('AnalysisService', () => {
  let service: AnalysisService;
  let contractRepo: jest.Mocked<Repository<Contract>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalysisService,
        { provide: AiService, useValue: {} },
        {
          provide: getRepositoryToken(Contract),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
          },
        },
        { provide: getRepositoryToken(Clause), useValue: {} },
        { provide: getRepositoryToken(RiskFlag), useValue: {} },
        { provide: getRepositoryToken(Summary), useValue: {} },
        { provide: getRepositoryToken(QnA), useValue: {} },
        { provide: getRepositoryToken(HumanReview), useValue: {} },
      ],
    }).compile();

    service = module.get(AnalysisService);
    contractRepo = module.get(getRepositoryToken(Contract));
  });

  describe('createContract', () => {
    it('should create and save a contract with pending status', async () => {
      const dto = { title: 'Test', type: ContractType.NDA } as any;
      const created = {
        id: '1',
        status: ContractStatus.PENDING_REVIEW,
      } as Contract;

      (contractRepo.create as jest.Mock).mockReturnValue(created);
      (contractRepo.save as jest.Mock).mockResolvedValue(created);

      const result = await service.createContract(dto);

      expect(contractRepo.create).toHaveBeenCalledWith({
        ...dto,
        status: ContractStatus.PENDING_REVIEW,
      });
      expect(contractRepo.save).toHaveBeenCalledWith(created);
      expect(result).toBe(created);
    });
  });

  describe('findContract', () => {
    it('should return contract when found', async () => {
      const contract = { id: '1' } as Contract;
      (contractRepo.findOne as jest.Mock).mockResolvedValue(contract);

      const result = await service.findContract('1');

      expect(contractRepo.findOne).toHaveBeenCalled();
      expect(result).toBe(contract);
    });

    it('should throw NotFoundException when not found', async () => {
      (contractRepo.findOne as jest.Mock).mockResolvedValue(undefined);

      await expect(service.findContract('2')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
