import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContractService } from './contract.service';
import { UpdateContractDto } from './dto/update-contract.dto';
import { UpdateRiskFlagDto } from './dto/update-risk-flag.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('contracts')
@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a contract file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        contractType: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body('contractType') contractType: string,
  ) {
    return this.contractService.uploadContract(file, contractType);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload a contract file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        contractType: {
          type: 'string',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadContract(
    @UploadedFile() file: Express.Multer.File,
    @Query('contractType') contractType: string,
  ) {
    return this.contractService.uploadContract(file, contractType);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contracts' })
  @ApiResponse({ status: 200, description: 'Return all contracts' })
  findAll() {
    return this.contractService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a contract by id' })
  @ApiResponse({ status: 200, description: 'Return the contract' })
  findOne(@Param('id') id: string) {
    return this.contractService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contract' })
  @ApiResponse({ status: 200, description: 'Contract updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateContractDto: UpdateContractDto,
  ) {
    return this.contractService.update(id, updateContractDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a contract' })
  @ApiResponse({ status: 200, description: 'Contract deleted successfully' })
  remove(@Param('id') id: string) {
    return this.contractService.remove(id);
  }

  @Post(':id/analyze')
  @ApiOperation({ summary: 'Analyze a contract using AI' })
  @ApiResponse({ status: 200, description: 'Contract analysis completed' })
  analyzeContract(@Param('id') id: string) {
    return this.contractService.analyzeContract(id);
  }

  @Get(':id/summary')
  @ApiOperation({ summary: 'Get contract summaries' })
  @ApiResponse({ status: 200, description: 'Return contract summaries' })
  getContractSummary(@Param('id') id: string) {
    return this.contractService.getContractSummary(id);
  }

  @Get(':id/risks')
  @ApiOperation({ summary: 'Get contract risks' })
  @ApiResponse({ status: 200, description: 'Return contract risks' })
  getContractRisks(@Param('id') id: string) {
    return this.contractService.getContractRisks(id);
  }

  @Get(':id/analysis')
  @ApiOperation({ summary: 'Get full contract analysis' })
  @ApiResponse({ status: 200, description: 'Return analysis data' })
  getAnalysis(@Param('id') id: string) {
    return this.contractService.getAnalysis(id);
  }

  @Get(':id/qna')
  @ApiOperation({ summary: 'Get contract Q&A' })
  @ApiResponse({ status: 200, description: 'Return contract Q&A' })
  getContractQnA(@Param('id') id: string) {
    return this.contractService.getContractQnA(id);
  }

  @Post(':id/qna')
  @ApiOperation({ summary: 'Ask a question about the contract' })
  @ApiResponse({ status: 200, description: 'Question answered successfully' })
  askQuestion(@Param('id') id: string, @Body('question') question: string) {
    return this.contractService.askQuestion(id, question);
  }

  @Post(':id/chat')
  @ApiOperation({ summary: 'Submit a chat question' })
  @ApiResponse({ status: 200, description: 'Chat answered' })
  submitChat(@Param('id') id: string, @Body('question') question: string) {
    return this.contractService.askQuestion(id, question);
  }

  @Get(':id/chat')
  @ApiOperation({ summary: 'Get chat history' })
  @ApiResponse({ status: 200, description: 'Return chat messages' })
  getChat(@Param('id') id: string) {
    return this.contractService.getContractQnA(id);
  }

  @Patch(':id/risk-flags/:riskId')
  @ApiOperation({ summary: 'Update risk flag status' })
  @ApiResponse({ status: 200, description: 'Risk flag updated' })
  updateRiskFlag(
    @Param('id') id: string,
    @Param('riskId') riskId: string,
    @Body() body: UpdateRiskFlagDto,
  ) {
    return this.contractService.updateRiskFlag(
      id,
      riskId,
      body.status,
      body.notes,
    );
  }

  @Get(':id/export')
  @ApiOperation({ summary: 'Export contract analysis' })
  @ApiResponse({ status: 200, description: 'Return analysis export' })
  exportAnalysis(@Param('id') id: string) {
    return this.contractService.exportAnalysis(id);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get contract reviews' })
  @ApiResponse({ status: 200, description: 'Return contract reviews' })
  getContractReviews(@Param('id') id: string) {
    return this.contractService.getContractReviews(id);
  }
}
