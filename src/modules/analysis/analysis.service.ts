import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { Clause, ClauseType } from './entities/clause.entity';
import { RiskFlag, RiskType, RiskSeverity } from './entities/risk-flag.entity';
import { Summary, SummaryType } from './entities/summary.entity';
import { QnA } from './entities/qna.entity';
import { HumanReview } from './entities/human-review.entity';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { CreateClauseDto } from './dto/create-clause.dto';
import { UpdateClauseDto } from './dto/update-clause.dto';
import { CreateRiskFlagDto } from './dto/create-risk-flag.dto';
import { UpdateRiskFlagDto } from './dto/update-risk-flag.dto';
import { CreateSummaryDto } from './dto/create-summary.dto';
import { UpdateSummaryDto } from './dto/update-summary.dto';
import { CreateQnADto } from './dto/create-qna.dto';
import { UpdateQnADto } from './dto/update-qna.dto';
import { CreateHumanReviewDto } from './dto/create-human-review.dto';
import { UpdateHumanReviewDto } from './dto/update-human-review.dto';
import { ContractStatus } from './entities/contract.entity';
import { ReviewStatus } from './entities/human-review.entity';
import { AiService } from './ai.service';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Contract)
    private readonly contractRepository: Repository<Contract>,
    @InjectRepository(Clause)
    private readonly clauseRepository: Repository<Clause>,
    @InjectRepository(RiskFlag)
    private readonly riskFlagRepository: Repository<RiskFlag>,
    @InjectRepository(Summary)
    private readonly summaryRepository: Repository<Summary>,
    @InjectRepository(QnA)
    private readonly qnaRepository: Repository<QnA>,
    @InjectRepository(HumanReview)
    private readonly humanReviewRepository: Repository<HumanReview>,
    private readonly aiService: AiService,
  ) {}

  // Contract operations
  async createContract(createContractDto: CreateContractDto): Promise<Contract> {
    const contract = this.contractRepository.create({
      ...createContractDto,
      status: ContractStatus.PENDING_REVIEW,
    });
    return this.contractRepository.save(contract);
  }

  async findAllContracts(): Promise<Contract[]> {
    return this.contractRepository.find({
      relations: ['clauses', 'riskFlags', 'summaries', 'reviews'],
    });
  }

  async findContract(id: string): Promise<Contract> {
    const contract = await this.contractRepository.findOne({
      where: { id },
      relations: ['clauses', 'riskFlags', 'summaries', 'reviews'],
    });
    if (!contract) {
      throw new NotFoundException(`Contract with ID ${id} not found`);
    }
    return contract;
  }

  async updateContract(id: string, updateContractDto: UpdateContractDto): Promise<Contract> {
    const contract = await this.findContract(id);
    Object.assign(contract, updateContractDto);
    return this.contractRepository.save(contract);
  }

  async removeContract(id: string): Promise<void> {
    const contract = await this.findContract(id);
    await this.contractRepository.remove(contract);
  }

  // Clause operations
  async createClause(contractId: string, createClauseDto: CreateClauseDto): Promise<Clause> {
    const contract = await this.findContract(contractId);
    const clause = this.clauseRepository.create({
      ...createClauseDto,
      contract: { id: contractId },
    });
    return this.clauseRepository.save(clause);
  }

  async findContractClauses(contractId: string): Promise<Clause[]> {
    return this.clauseRepository.find({
      where: { contract: { id: contractId } },
      relations: ['riskFlags', 'summaries', 'qnaInteractions'],
    });
  }

  async findClause(id: string): Promise<Clause> {
    const clause = await this.clauseRepository.findOne({
      where: { id },
      relations: ['contract', 'riskFlags', 'summaries', 'qnaInteractions'],
    });
    if (!clause) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }
    return clause;
  }

  async updateClause(id: string, updateClauseDto: UpdateClauseDto): Promise<Clause> {
    const clause = await this.findClause(id);
    Object.assign(clause, updateClauseDto);
    return this.clauseRepository.save(clause);
  }

  async removeClause(id: string): Promise<void> {
    const clause = await this.findClause(id);
    await this.clauseRepository.remove(clause);
  }

  // Risk flag operations
  async createRiskFlag(contractId: string, clauseId: string | null, createRiskFlagDto: CreateRiskFlagDto): Promise<RiskFlag> {
    const contract = await this.findContract(contractId);
    const riskFlag = this.riskFlagRepository.create({
      ...createRiskFlagDto,
      contract: { id: contractId },
      ...(clauseId ? { clause: { id: clauseId } } : {}),
    });
    return this.riskFlagRepository.save(riskFlag);
  }

  async findContractRiskFlags(contractId: string): Promise<RiskFlag[]> {
    return this.riskFlagRepository.find({
      where: { contract: { id: contractId } },
      relations: ['clause'],
    });
  }

  async findRiskFlag(id: string): Promise<RiskFlag> {
    const riskFlag = await this.riskFlagRepository.findOne({
      where: { id },
      relations: ['contract', 'clause'],
    });
    if (!riskFlag) {
      throw new NotFoundException(`Risk flag with ID ${id} not found`);
    }
    return riskFlag;
  }

  async updateRiskFlag(id: string, updateRiskFlagDto: UpdateRiskFlagDto): Promise<RiskFlag> {
    const riskFlag = await this.findRiskFlag(id);
    Object.assign(riskFlag, updateRiskFlagDto);
    return this.riskFlagRepository.save(riskFlag);
  }

  async removeRiskFlag(id: string): Promise<void> {
    const riskFlag = await this.findRiskFlag(id);
    await this.riskFlagRepository.remove(riskFlag);
  }

  // Summary operations
  async createSummary(contractId: string, clauseId: string | null, createSummaryDto: CreateSummaryDto): Promise<Summary> {
    const contract = await this.findContract(contractId);
    const summary = this.summaryRepository.create({
      ...createSummaryDto,
      contract: { id: contractId },
      ...(clauseId ? { clause: { id: clauseId } } : {}),
    });
    return this.summaryRepository.save(summary);
  }

  async findContractSummaries(contractId: string): Promise<Summary[]> {
    return this.summaryRepository.find({
      where: { contract: { id: contractId } },
      relations: ['clause'],
    });
  }

  async findSummary(id: string): Promise<Summary> {
    const summary = await this.summaryRepository.findOne({
      where: { id },
      relations: ['contract', 'clause'],
    });
    if (!summary) {
      throw new NotFoundException(`Summary with ID ${id} not found`);
    }
    return summary;
  }

  async updateSummary(id: string, updateSummaryDto: UpdateSummaryDto): Promise<Summary> {
    const summary = await this.findSummary(id);
    Object.assign(summary, updateSummaryDto);
    return this.summaryRepository.save(summary);
  }

  async removeSummary(id: string): Promise<void> {
    const summary = await this.findSummary(id);
    await this.summaryRepository.remove(summary);
  }

  // Q&A operations
  async createQnA(contractId: string, clauseId: string | null, createQnADto: CreateQnADto): Promise<QnA> {
    const contract = await this.findContract(contractId);
    const qna = this.qnaRepository.create({
      ...createQnADto,
      contract: { id: contractId },
      ...(clauseId ? { clause: { id: clauseId } } : {}),
    });
    return this.qnaRepository.save(qna);
  }

  async findContractQnAs(contractId: string): Promise<QnA[]> {
    return this.qnaRepository.find({
      where: { contract: { id: contractId } },
      relations: ['clause'],
    });
  }

  async findQnA(id: string): Promise<QnA> {
    const qna = await this.qnaRepository.findOne({
      where: { id },
      relations: ['contract', 'clause'],
    });
    if (!qna) {
      throw new NotFoundException(`Q&A with ID ${id} not found`);
    }
    return qna;
  }

  async updateQnA(id: string, updateQnADto: UpdateQnADto): Promise<QnA> {
    const qna = await this.findQnA(id);
    Object.assign(qna, updateQnADto);
    return this.qnaRepository.save(qna);
  }

  async removeQnA(id: string): Promise<void> {
    const qna = await this.findQnA(id);
    await this.qnaRepository.remove(qna);
  }

  // Human review operations
  async createHumanReview(contractId: string, createHumanReviewDto: CreateHumanReviewDto): Promise<HumanReview> {
    const contract = await this.findContract(contractId);
    const review = this.humanReviewRepository.create({
      ...createHumanReviewDto,
      contract: { id: contractId },
    });
    return this.humanReviewRepository.save(review);
  }

  async findContractReviews(contractId: string): Promise<HumanReview[]> {
    return this.humanReviewRepository.find({
      where: { contract: { id: contractId } },
    });
  }

  async findReview(id: string): Promise<HumanReview> {
    const review = await this.humanReviewRepository.findOne({
      where: { id },
      relations: ['contract'],
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async updateReview(id: string, updateHumanReviewDto: UpdateHumanReviewDto): Promise<HumanReview> {
    const review = await this.findReview(id);
    Object.assign(review, updateHumanReviewDto);
    return this.humanReviewRepository.save(review);
  }

  async removeReview(id: string): Promise<void> {
    const review = await this.findReview(id);
    await this.humanReviewRepository.remove(review);
  }

  // Analysis operations
  async analyzeContract(contractId: string): Promise<void> {
    const contract = await this.findContract(contractId);
    
    // Update contract status
    contract.status = ContractStatus.IN_REVIEW;
    await this.contractRepository.save(contract);

    // Create initial human review
    await this.createHumanReview(contractId, {
      status: ReviewStatus.PENDING,
      startDate: new Date(),
    });

    // Split contract into clauses
    if (!contract.originalText) {
      throw new Error('Contract text is not available');
    }
    const clauses = await this.aiService.splitIntoClauses(contract.originalText);
    
    // Analyze each clause
    for (const [index, clauseText] of clauses.entries()) {
      // Create clause
      const clause = await this.createClause(contractId, {
        number: (index + 1).toString(),
        text: clauseText,
      });

      // Analyze clause
      const analysis = await this.aiService.analyzeClause(clauseText);
      
      // Update clause type
      await this.updateClause(clause.id, {
        type: analysis.type as ClauseType,
      });

      // Create risk flags
      for (const risk of analysis.risks) {
        await this.createRiskFlag(contractId, clause.id, {
          type: risk.type as RiskType,
          severity: risk.severity as RiskSeverity,
          description: risk.description,
          suggestedResolution: risk.suggestedResolution,
        });
      }

      // Generate clause summary
      await this.createSummary(contractId, clause.id, {
        type: SummaryType.CLAUSE,
        text: await this.aiService.generateSummary(clauseText, 'clause'),
      });
    }

    // Generate contract summary
    if (!contract.originalText) {
      throw new Error('Contract text is not available');
    }
    await this.createSummary(contractId, null, {
      type: SummaryType.FULL,
      text: await this.aiService.generateSummary(contract.originalText, 'full contract'),
    });

    // Update contract status
    contract.status = ContractStatus.IN_REVIEW;
    await this.contractRepository.save(contract);
  }

  async generateSummary(contractId: string, type: string): Promise<Summary> {
    const contract = await this.findContract(contractId);
    if (!contract.originalText) {
      throw new Error('Contract text is not available');
    }
    const summaryText = await this.aiService.generateSummary(contract.originalText, type);
    
    return this.createSummary(contractId, null, {
      type: type as SummaryType,
      text: summaryText,
    });
  }

  async answerQuestion(contractId: string, clauseId: string | null, question: string): Promise<QnA> {
    const contract = await this.findContract(contractId);
    if (!contract.originalText) {
      throw new Error('Contract text is not available');
    }
    let context = contract.originalText;
    
    if (clauseId) {
      const clause = await this.findClause(clauseId);
      context = clause.text;
    }
    
    const answer = await this.aiService.answerQuestion(question, context);
    
    return this.createQnA(contractId, clauseId, {
      question,
      answer,
    });
  }
} 