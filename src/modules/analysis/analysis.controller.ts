import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AnalysisService } from './analysis.service';
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

@ApiTags('analysis')
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  // Contract endpoints
  @Post('contracts')
  @ApiOperation({ summary: 'Create a new contract' })
  @ApiResponse({ status: 201, description: 'Contract created successfully' })
  createContract(@Body() createContractDto: CreateContractDto) {
    return this.analysisService.createContract(createContractDto);
  }

  @Get('contracts')
  @ApiOperation({ summary: 'Get all contracts' })
  @ApiResponse({ status: 200, description: 'Return all contracts' })
  findAllContracts() {
    return this.analysisService.findAllContracts();
  }

  @Get('contracts/:id')
  @ApiOperation({ summary: 'Get a contract by id' })
  @ApiResponse({ status: 200, description: 'Return the contract' })
  findContract(@Param('id') id: string) {
    return this.analysisService.findContract(id);
  }

  @Patch('contracts/:id')
  @ApiOperation({ summary: 'Update a contract' })
  @ApiResponse({ status: 200, description: 'Contract updated successfully' })
  updateContract(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
    return this.analysisService.updateContract(id, updateContractDto);
  }

  @Delete('contracts/:id')
  @ApiOperation({ summary: 'Delete a contract' })
  @ApiResponse({ status: 200, description: 'Contract deleted successfully' })
  removeContract(@Param('id') id: string) {
    return this.analysisService.removeContract(id);
  }

  // Clause endpoints
  @Post('contracts/:contractId/clauses')
  @ApiOperation({ summary: 'Create a new clause' })
  @ApiResponse({ status: 201, description: 'Clause created successfully' })
  createClause(@Param('contractId') contractId: string, @Body() createClauseDto: CreateClauseDto) {
    return this.analysisService.createClause(contractId, createClauseDto);
  }

  @Get('contracts/:contractId/clauses')
  @ApiOperation({ summary: 'Get all clauses for a contract' })
  @ApiResponse({ status: 200, description: 'Return all clauses' })
  findContractClauses(@Param('contractId') contractId: string) {
    return this.analysisService.findContractClauses(contractId);
  }

  @Get('clauses/:id')
  @ApiOperation({ summary: 'Get a clause by id' })
  @ApiResponse({ status: 200, description: 'Return the clause' })
  findClause(@Param('id') id: string) {
    return this.analysisService.findClause(id);
  }

  @Patch('clauses/:id')
  @ApiOperation({ summary: 'Update a clause' })
  @ApiResponse({ status: 200, description: 'Clause updated successfully' })
  updateClause(@Param('id') id: string, @Body() updateClauseDto: UpdateClauseDto) {
    return this.analysisService.updateClause(id, updateClauseDto);
  }

  @Delete('clauses/:id')
  @ApiOperation({ summary: 'Delete a clause' })
  @ApiResponse({ status: 200, description: 'Clause deleted successfully' })
  removeClause(@Param('id') id: string) {
    return this.analysisService.removeClause(id);
  }

  // Risk flag endpoints
  @Post('contracts/:contractId/risk-flags')
  @ApiOperation({ summary: 'Create a new risk flag' })
  @ApiResponse({ status: 201, description: 'Risk flag created successfully' })
  createRiskFlag(
    @Param('contractId') contractId: string,
    @Query('clauseId') clauseId: string | null,
    @Body() createRiskFlagDto: CreateRiskFlagDto,
  ) {
    return this.analysisService.createRiskFlag(contractId, clauseId, createRiskFlagDto);
  }

  @Get('contracts/:contractId/risk-flags')
  @ApiOperation({ summary: 'Get all risk flags for a contract' })
  @ApiResponse({ status: 200, description: 'Return all risk flags' })
  findContractRiskFlags(@Param('contractId') contractId: string) {
    return this.analysisService.findContractRiskFlags(contractId);
  }

  @Get('risk-flags/:id')
  @ApiOperation({ summary: 'Get a risk flag by id' })
  @ApiResponse({ status: 200, description: 'Return the risk flag' })
  findRiskFlag(@Param('id') id: string) {
    return this.analysisService.findRiskFlag(id);
  }

  @Patch('risk-flags/:id')
  @ApiOperation({ summary: 'Update a risk flag' })
  @ApiResponse({ status: 200, description: 'Risk flag updated successfully' })
  updateRiskFlag(@Param('id') id: string, @Body() updateRiskFlagDto: UpdateRiskFlagDto) {
    return this.analysisService.updateRiskFlag(id, updateRiskFlagDto);
  }

  @Delete('risk-flags/:id')
  @ApiOperation({ summary: 'Delete a risk flag' })
  @ApiResponse({ status: 200, description: 'Risk flag deleted successfully' })
  removeRiskFlag(@Param('id') id: string) {
    return this.analysisService.removeRiskFlag(id);
  }

  // Summary endpoints
  @Post('contracts/:contractId/summaries')
  @ApiOperation({ summary: 'Create a new summary' })
  @ApiResponse({ status: 201, description: 'Summary created successfully' })
  createSummary(
    @Param('contractId') contractId: string,
    @Query('clauseId') clauseId: string | null,
    @Body() createSummaryDto: CreateSummaryDto,
  ) {
    return this.analysisService.createSummary(contractId, clauseId, createSummaryDto);
  }

  @Get('contracts/:contractId/summaries')
  @ApiOperation({ summary: 'Get all summaries for a contract' })
  @ApiResponse({ status: 200, description: 'Return all summaries' })
  findContractSummaries(@Param('contractId') contractId: string) {
    return this.analysisService.findContractSummaries(contractId);
  }

  @Get('summaries/:id')
  @ApiOperation({ summary: 'Get a summary by id' })
  @ApiResponse({ status: 200, description: 'Return the summary' })
  findSummary(@Param('id') id: string) {
    return this.analysisService.findSummary(id);
  }

  @Patch('summaries/:id')
  @ApiOperation({ summary: 'Update a summary' })
  @ApiResponse({ status: 200, description: 'Summary updated successfully' })
  updateSummary(@Param('id') id: string, @Body() updateSummaryDto: UpdateSummaryDto) {
    return this.analysisService.updateSummary(id, updateSummaryDto);
  }

  @Delete('summaries/:id')
  @ApiOperation({ summary: 'Delete a summary' })
  @ApiResponse({ status: 200, description: 'Summary deleted successfully' })
  removeSummary(@Param('id') id: string) {
    return this.analysisService.removeSummary(id);
  }

  // Q&A endpoints
  @Post('contracts/:contractId/qna')
  @ApiOperation({ summary: 'Create a new Q&A interaction' })
  @ApiResponse({ status: 201, description: 'Q&A created successfully' })
  createQnA(
    @Param('contractId') contractId: string,
    @Query('clauseId') clauseId: string | null,
    @Body() createQnADto: CreateQnADto,
  ) {
    return this.analysisService.createQnA(contractId, clauseId, createQnADto);
  }

  @Get('contracts/:contractId/qna')
  @ApiOperation({ summary: 'Get all Q&A interactions for a contract' })
  @ApiResponse({ status: 200, description: 'Return all Q&A interactions' })
  findContractQnAs(@Param('contractId') contractId: string) {
    return this.analysisService.findContractQnAs(contractId);
  }

  @Get('qna/:id')
  @ApiOperation({ summary: 'Get a Q&A interaction by id' })
  @ApiResponse({ status: 200, description: 'Return the Q&A interaction' })
  findQnA(@Param('id') id: string) {
    return this.analysisService.findQnA(id);
  }

  @Patch('qna/:id')
  @ApiOperation({ summary: 'Update a Q&A interaction' })
  @ApiResponse({ status: 200, description: 'Q&A updated successfully' })
  updateQnA(@Param('id') id: string, @Body() updateQnADto: UpdateQnADto) {
    return this.analysisService.updateQnA(id, updateQnADto);
  }

  @Delete('qna/:id')
  @ApiOperation({ summary: 'Delete a Q&A interaction' })
  @ApiResponse({ status: 200, description: 'Q&A deleted successfully' })
  removeQnA(@Param('id') id: string) {
    return this.analysisService.removeQnA(id);
  }

  // Human review endpoints
  @Post('contracts/:contractId/reviews')
  @ApiOperation({ summary: 'Create a new human review' })
  @ApiResponse({ status: 201, description: 'Review created successfully' })
  createHumanReview(@Param('contractId') contractId: string, @Body() createHumanReviewDto: CreateHumanReviewDto) {
    return this.analysisService.createHumanReview(contractId, createHumanReviewDto);
  }

  @Get('contracts/:contractId/reviews')
  @ApiOperation({ summary: 'Get all human reviews for a contract' })
  @ApiResponse({ status: 200, description: 'Return all human reviews' })
  findContractReviews(@Param('contractId') contractId: string) {
    return this.analysisService.findContractReviews(contractId);
  }

  @Get('reviews/:id')
  @ApiOperation({ summary: 'Get a human review by id' })
  @ApiResponse({ status: 200, description: 'Return the human review' })
  findReview(@Param('id') id: string) {
    return this.analysisService.findReview(id);
  }

  @Patch('reviews/:id')
  @ApiOperation({ summary: 'Update a human review' })
  @ApiResponse({ status: 200, description: 'Review updated successfully' })
  updateReview(@Param('id') id: string, @Body() updateHumanReviewDto: UpdateHumanReviewDto) {
    return this.analysisService.updateReview(id, updateHumanReviewDto);
  }

  @Delete('reviews/:id')
  @ApiOperation({ summary: 'Delete a human review' })
  @ApiResponse({ status: 200, description: 'Review deleted successfully' })
  removeReview(@Param('id') id: string) {
    return this.analysisService.removeReview(id);
  }

  // Analysis endpoints
  @Post('contracts/:id/analyze')
  @ApiOperation({ summary: 'Start AI analysis of a contract' })
  @ApiResponse({ status: 200, description: 'Analysis started successfully' })
  analyzeContract(@Param('id') id: string) {
    return this.analysisService.analyzeContract(id);
  }

  @Post('contracts/:id/summaries')
  @ApiOperation({ summary: 'Generate a summary for a contract' })
  @ApiResponse({ status: 200, description: 'Summary generated successfully' })
  generateSummary(@Param('id') id: string, @Query('type') type: string) {
    return this.analysisService.generateSummary(id, type);
  }

  @Post('contracts/:id/questions')
  @ApiOperation({ summary: 'Ask a question about a contract' })
  @ApiResponse({ status: 200, description: 'Question answered successfully' })
  answerQuestion(
    @Param('id') id: string,
    @Query('clauseId') clauseId: string | null,
    @Body('question') question: string,
  ) {
    return this.analysisService.answerQuestion(id, clauseId, question);
  }
} 