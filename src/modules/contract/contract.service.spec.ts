import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContractService } from './contract.service';
import { Contract } from '../../entities/contract.entity';
import { Clause } from '../../entities/clause.entity';
import { RiskFlag, RiskFlagStatus } from '../../entities/risk-flag.entity';
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
  //let humanReviewRepository: jest.Mocked<Repository<HumanReview>>;
  let aiService: AiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractService,
        {
          provide: AiService,
          useValue: { analyzeContract: jest.fn(), answerQuestion: jest.fn() },
        },
        {
          provide: getRepositoryToken(Contract),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
        { provide: getRepositoryToken(Clause), useValue: { save: jest.fn() } },
        {
          provide: getRepositoryToken(RiskFlag),
          useValue: { findOne: jest.fn(), save: jest.fn() },
        },
        {
          provide: getRepositoryToken(Summary),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
        { provide: getRepositoryToken(QnA), useValue: { save: jest.fn() } },
        {
          provide: getRepositoryToken(HumanReview),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(ContractService);
    contractRepository = module.get(getRepositoryToken(Contract));
    clauseRepository = module.get(getRepositoryToken(Clause));
    riskFlagRepository = module.get(getRepositoryToken(RiskFlag));
    summaryRepository = module.get(getRepositoryToken(Summary));
    qnaRepository = module.get(getRepositoryToken(QnA));
    //humanReviewRepository = module.get(getRepositoryToken(HumanReview));
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

      await expect(service.findOne('2')).rejects.toBeInstanceOf(
        NotFoundException,
      );
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
      await expect(
        service.uploadContract(undefined as any, 'NDA'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException for unsupported file type', async () => {
      const badFile = {
        ...file,
        mimetype: 'text/plain',
      } as Express.Multer.File;
      await expect(
        service.uploadContract(badFile, 'NDA'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw BadRequestException for too large file', async () => {
      const bigFile = {
        ...file,
        size: 20 * 1024 * 1024,
      } as Express.Multer.File;
      await expect(
        service.uploadContract(bigFile, 'NDA'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
  });

  describe('analyzeContract', () => {
    it('should analyze contract, save AI results, and update contract', async () => {
      const contract = {
        id: '1',
        title: 'Test',
        filename: 'test.pdf',
        contractType: 'NDA',
        fullText: 'contract text',
        status: 'DRAFT',
        clauses: [],
        riskFlags: [],
        summaries: [],
        qnas: [],
        reviews: [],
        governingLaw: '',
        parties: '',
        language: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Contract;
      const analysis = {
        clauses: [
          {
            clauseNumber: '1',
            heading: 'Heading',
            text: 'Clause text',
            classification: 'Type',
            riskLevel: 'LOW',
          },
        ],
        risks: [
          {
            flagType: 'MISSING_CLAUSE',
            description: 'desc',
            severity: 'HIGH',
            status: 'open',
          },
        ],
        summary: 'AI summary',
      };
      contractRepository.findOne.mockResolvedValue(contract);
      aiService.analyzeContract = jest.fn().mockResolvedValue(analysis);
      const savedClause = {
        ...analysis.clauses[0],
        id: 'c1',
        contract,
        riskFlags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const savedRisk = {
        ...analysis.risks[0],
        id: 'r1',
        contract,
        clause: new Clause(),
        suggestedText: '',
        notes: '',
        isResolved: false,
        status: RiskFlagStatus.OPEN,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const savedSummary = {
        id: 's1',
        content: analysis.summary,
        summaryType: 'FULL',
        contract,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      clauseRepository.save.mockResolvedValue(savedClause);
      riskFlagRepository.save.mockResolvedValue(savedRisk as any);
      summaryRepository.save = jest.fn().mockResolvedValue(savedSummary);
      contractRepository.save.mockResolvedValue({
        ...contract,
        status: 'IN_REVIEW',
        clauses: [savedClause],
        riskFlags: [savedRisk],
        summaries: [savedSummary],
      });

      const result = await service.analyzeContract('1');

      expect(contractRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['clauses', 'riskFlags', 'summaries', 'qnas', 'reviews'],
      });
      expect(aiService.analyzeContract).toHaveBeenCalledWith(
        'contract text',
        'NDA',
      );
      expect(clauseRepository.save).toHaveBeenCalledWith({
        ...analysis.clauses[0],
        contract,
      });
      expect(riskFlagRepository.save).toHaveBeenCalledWith({
        ...analysis.risks[0],
        contract,
        clause: new Clause(),
      });
      expect(summaryRepository.save).toHaveBeenCalledWith({
        content: analysis.summary,
        summaryType: 'FULL',
        contract,
      });
      expect(contractRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'IN_REVIEW',
          clauses: [savedClause],
          riskFlags: [savedRisk],
          summaries: [savedSummary],
        }),
      );
      expect(result).toEqual(
        expect.objectContaining({
          status: 'IN_REVIEW',
          clauses: [savedClause],
          riskFlags: [savedRisk],
          summaries: [savedSummary],
        }),
      );
    });

    it('should throw BadRequestException if contract has no fullText', async () => {
      const contract = {
        id: '1',
        title: 'Test',
        filename: 'test.pdf',
        contractType: 'NDA',
        fullText: undefined,
        status: 'DRAFT',
        clauses: [],
        riskFlags: [],
        summaries: [],
        qnas: [],
        reviews: [],
        governingLaw: '',
        parties: '',
        language: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Contract;
      contractRepository.findOne.mockResolvedValue(contract);
      await expect(service.analyzeContract('1')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('askQuestion', () => {
    it('should call aiService.answerQuestion and save QnA', async () => {
      const contract = {
        id: '1',
        title: 'Test',
        filename: 'test.pdf',
        contractType: 'NDA',
        fullText: 'contract text',
        status: 'DRAFT',
        clauses: [],
        riskFlags: [],
        summaries: [],
        qnas: [],
        reviews: [],
        governingLaw: '',
        parties: '',
        language: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Contract;
      contractRepository.findOne.mockResolvedValue(contract);
      const aiAnswer = { answer: 'AI answer' };
      aiService.answerQuestion = jest.fn().mockResolvedValue(aiAnswer);
      const savedQnA = {
        id: 'q1',
        question: 'What is this?',
        answer: 'AI answer',
        contract,
        isAccepted: false,
        feedback: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      qnaRepository.save.mockResolvedValue(savedQnA);

      const result = await service.askQuestion('1', 'What is this?');

      expect(contractRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['clauses', 'riskFlags', 'summaries', 'qnas', 'reviews'],
      });
      expect(aiService.answerQuestion).toHaveBeenCalledWith(
        'What is this?',
        'contract text',
      );
      expect(qnaRepository.save).toHaveBeenCalledWith({
        question: 'What is this?',
        answer: 'AI answer',
        contract,
      });
      expect(result).toBe(savedQnA);
    });

    it('should throw BadRequestException if contract has no fullText', async () => {
      const contract = {
        id: '1',
        title: 'Test',
        filename: 'test.pdf',
        contractType: 'NDA',
        fullText: undefined,
        status: 'DRAFT',
        clauses: [],
        riskFlags: [],
        summaries: [],
        qnas: [],
        reviews: [],
        governingLaw: '',
        parties: '',
        language: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Contract;
      contractRepository.findOne.mockResolvedValue(contract);
      await expect(service.askQuestion('1', 'Q?')).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });
  });

  describe('getContractReviews', () => {
    it('should return contract reviews', async () => {
      const reviews = [
        {
          id: 'hr1',
          status: 'PENDING_REVIEW',
          comments: '',
          contract: undefined,
          reviewer: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as any[];
      const contract = {
        id: '1',
        title: 'Test',
        filename: 'test.pdf',
        contractType: 'NDA',
        fullText: 'contract text',
        status: 'DRAFT',
        clauses: [],
        riskFlags: [],
        summaries: [],
        qnas: [],
        reviews,
        governingLaw: '',
        parties: '',
        language: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Contract;
      contractRepository.findOne.mockResolvedValue(contract);
      const result = await service.getContractReviews('1');
      expect(contractRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['clauses', 'riskFlags', 'summaries', 'qnas', 'reviews'],
      });
      expect(result).toBe(reviews);
    });
  });
});
