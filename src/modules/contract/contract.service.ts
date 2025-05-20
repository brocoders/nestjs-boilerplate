import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from '../../entities/contract.entity';
import { Clause } from '../../entities/clause.entity';
import { RiskFlag } from '../../entities/risk-flag.entity';
import { Summary } from '../../entities/summary.entity';
import { QnA } from '../../entities/qna.entity';
import { HumanReview } from '../../entities/human-review.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { AiService } from '../ai/ai.service';

export interface ExportAnalysisResult {
  contract: Contract;
  summaries: Summary[];
  riskFlags: RiskFlag[];
  qna: QnA[];
}

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
    @InjectRepository(Clause)
    private clauseRepository: Repository<Clause>,
    @InjectRepository(RiskFlag)
    private riskFlagRepository: Repository<RiskFlag>,
    @InjectRepository(Summary)
    private summaryRepository: Repository<Summary>,
    @InjectRepository(QnA)
    private qnaRepository: Repository<QnA>,
    @InjectRepository(HumanReview)
    private humanReviewRepository: Repository<HumanReview>,
    private aiService: AiService,
  ) {}

  async create(createContractDto: CreateContractDto): Promise<Contract> {
    const contract = this.contractRepository.create(createContractDto);
    return await this.contractRepository.save(contract);
  }

  async findAll(): Promise<Contract[]> {
    return await this.contractRepository.find({
      relations: ['clauses', 'riskFlags', 'summaries', 'qnas', 'reviews'],
    });
  }

  async findOne(id: string): Promise<Contract> {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: ['clauses', 'riskFlags', 'summaries', 'qnas', 'reviews'],
    });

    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }

    return contract;
  }

  async update(
    id: string,
    updateContractDto: UpdateContractDto,
  ): Promise<Contract> {
    const contract = await this.findOne(id);
    Object.assign(contract, updateContractDto);
    return await this.contractRepository.save(contract);
  }

  async remove(id: string): Promise<void> {
    const contract = await this.findOne(id);
    await this.contractRepository.remove(contract);
  }

  async uploadContract(
    file: Express.Multer.File,
    contractType: string,
  ): Promise<Contract> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Unsupported file type');
    }
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File too large');
    }

    const contract = this.contractRepository.create({
      title: file.originalname,
      filename: file.filename,
      contractType,
      status: 'DRAFT',
    });

    return await this.contractRepository.save(contract);
  }

  async analyzeContract(id: string): Promise<Contract> {
    const contract = await this.findOne(id);

    if (!contract.fullText) {
      throw new BadRequestException('Contract text is required for analysis');
    }

    // Analyze contract using AI
    const analysis = await this.aiService.analyzeContract(
      contract.fullText,
      contract.contractType,
    );

    // Save clauses
    const clauses = await Promise.all(
      analysis.clauses.map((clauseData) =>
        this.clauseRepository.save({
          ...clauseData,
          contract,
        }),
      ),
    );

    // Save risk flags
    const riskFlags = await Promise.all(
      analysis.risks.map((riskData) =>
        this.riskFlagRepository.save({
          ...riskData,
          contract,
          clause: new Clause(),
        }),
      ),
    );

    // Save summary
    const summary = await this.summaryRepository.save({
      content: analysis.summary,
      summaryType: 'FULL',
      contract,
    });

    // Update contract status
    contract.status = 'IN_REVIEW';
    contract.clauses = clauses;
    contract.riskFlags = riskFlags;
    contract.summaries = [summary];

    return await this.contractRepository.save(contract);
  }

  async getContractSummary(id: string): Promise<Summary[]> {
    const contract = await this.findOne(id);
    return contract.summaries;
  }

  async getContractRisks(id: string): Promise<RiskFlag[]> {
    const contract = await this.findOne(id);
    return contract.riskFlags;
  }

  async getAnalysis(
    id: string,
  ): Promise<{ summaries: Summary[]; riskFlags: RiskFlag[] }> {
    const contract = await this.findOne(id);
    return {
      summaries: contract.summaries,
      riskFlags: contract.riskFlags,
    };
  }

  async getContractQnA(id: string): Promise<QnA[]> {
    const contract = await this.findOne(id);
    return contract.qnas;
  }

  async updateRiskFlag(
    contractId: string,
    riskId: string,
    status: 'open' | 'resolved' | 'ignored',
    notes?: string,
  ): Promise<RiskFlag> {
    await this.findOne(contractId);
    const riskFlag = await this.riskFlagRepository.findOne({
      where: { id: riskId, contract: { id: contractId } },
    });
    if (!riskFlag) {
      throw new NotFoundException(
        `Risk flag with ID ${riskId} not found for contract ${contractId}`,
      );
    }
    Object.assign(riskFlag, { status, notes });
    return this.riskFlagRepository.save(riskFlag);
  }

  async exportAnalysis(id: string): Promise<ExportAnalysisResult> {
    const contract = await this.findOne(id);
    return {
      contract,
      summaries: contract.summaries,
      riskFlags: contract.riskFlags,
      qna: contract.qnas,
    };
  }

  async getContractReviews(id: string): Promise<HumanReview[]> {
    const contract = await this.findOne(id);
    return contract.reviews;
  }

  async askQuestion(id: string, question: string): Promise<QnA> {
    const contract = await this.findOne(id);

    if (!contract.fullText) {
      throw new BadRequestException('Contract text is required for Q&A');
    }

    const answer = await this.aiService.answerQuestion(
      question,
      contract.fullText,
    );

    const qna = await this.qnaRepository.save({
      question,
      answer: answer.answer,
      contract,
    });

    return qna;
  }

  // Dedicated chat methods for future differentiation
  async getContractChat(id: string): Promise<any[]> {
    // TODO: Implement chat-specific storage and retrieval
    const contract = await this.findOne(id);
    return [contract];
  }

  submitChat(_id: string, question: string): any {
    // TODO: Implement chat-specific storage and processing
    return { question, answer: 'Chat answer (stub)' };
  }
}
