import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractService } from './contract.service';
import { Contract } from '../../entities/contract.entity';
import { Clause } from '../../entities/clause.entity';
import { RiskFlag } from '../../entities/risk-flag.entity';
import { Summary } from '../../entities/summary.entity';
import { QnA } from '../../entities/qna.entity';
import { HumanReview } from '../../entities/human-review.entity';
import { AiService } from '../ai/ai.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('ContractService', () => {
  let service: ContractService;
  let contractRepository: jest.Mocked<Repository<Contract>>;
  let clauseRepository: jest.Mocked<Repository<Clause>>;
  let riskFlagRepository: jest.Mocked<Repository<RiskFlag>>;
  let summaryRepository: jest.Mocked<Repository<Summary>>;
  let qnaRepository: jest.Mocked<Repository<QnA>>;
  let humanReviewRepository: jest.Mocked<Repository<HumanReview>>;
  let aiService: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractService,
        { provide: AiService, useValue: { analyzeContract: jest.fn(), answerQuestion: jest.fn() } },
        { provide: getRepositoryToken(Contract), useValue: { create: jest.fn(), save: jest.fn(), findOne: jest.fn(), find: jest.fn(), remove: jest.fn() } },
        { provide: getRepositoryToken(Clause), useValue: { save: jest.fn() } },
        { provide: getRepositoryToken(RiskFlag), useValue: { findOne: jest.fn(), save: jest.fn() } },
        { provide: getRepositoryToken(Summary), useValue: { } },
        { provide: getRepositoryToken(QnA), useValue: { save: jest.fn() } },
        { provide: getRepositoryToken(HumanReview), useValue: { } },
      ],
    }).compile();

    service = module.get(ContractService);
    contractRepository = module.get(getRepositoryToken(Contract));
    clauseRepository = module.get(getRepositoryToken(Clause));
    riskFlagRepository = module.get(getRepositoryToken(RiskFlag));
    summaryRepository = module.get(getRepositoryToken(Summary));
    qnaRepository = module.get(getRepositoryToken(QnA));
    humanReviewRepository = module.get(getRepositoryToken(HumanReview));
    aiService = module.get(AiService);
  });

  describe('findOne', () => {
    it('should return a contract when found', async () => {
      const contract = { id: '1' } as Contract;
      contractRepository.findOne.mockResolvedValue(contract);

      const result = await service.findOne('1');

      expect(contractRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['clauses', 'riskFlags', 'summaries', 'qnas', 'reviews'],
      });
      expect(result).toBe(contract);
    });

    it('should throw NotFoundException when contract not found', async () => {
      contractRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('2')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('uploadContract', () => {
    const file = {
      originalname: 'test.pdf',
      filename: 'test.pdf',
      mimetype: 'application/pdf',
      size: 1024,
    } as Express.Multer.File;

    it('should create and save contract when file is valid', async () => {
      const created = { id: '1' } as Contract;
      contractRepository.create.mockReturnValue(created);
      contractRepository.save.mockResolvedValue(created);

      const result = await service.uploadContract(file, 'NDA');

      expect(contractRepository.create).toHaveBeenCalledWith({
        title: file.originalname,
        filename: file.filename,
        contractType: 'NDA',
        status: 'DRAFT',
      });
      expect(contractRepository.save).toHaveBeenCalledWith(created);
      expect(result).toBe(created);
    });

    it('should throw BadRequestException when no file', async () => {
      await expect(service.uploadContract(undefined as any, 'NDA')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException for unsupported file type', async () => {
      const badFile = { ...file, mimetype: 'text/plain' } as Express.Multer.File;
      await expect(service.uploadContract(badFile, 'NDA')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException for too large file', async () => {
      const bigFile = { ...file, size: 20 * 1024 * 1024 } as Express.Multer.File;
      await expect(service.uploadContract(bigFile, 'NDA')).rejects.toBeInstanceOf(BadRequestException);
    });
  });
});
