import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContractService } from './contract.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBody } from '@nestjs/swagger';

@ApiTags('contracts')
@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contract' })
  @ApiResponse({ status: 201, description: 'Contract created successfully' })
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractService.create(createContractDto);
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
  update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
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

  @Get(':id/qna')
  @ApiOperation({ summary: 'Get contract Q&A' })
  @ApiResponse({ status: 200, description: 'Return contract Q&A' })
  getContractQnA(@Param('id') id: string) {
    return this.contractService.getContractQnA(id);
  }

  @Post(':id/qna')
  @ApiOperation({ summary: 'Ask a question about the contract' })
  @ApiResponse({ status: 200, description: 'Question answered successfully' })
  askQuestion(
    @Param('id') id: string,
    @Body('question') question: string,
  ) {
    return this.contractService.askQuestion(id, question);
  }

  @Get(':id/reviews')
  @ApiOperation({ summary: 'Get contract reviews' })
  @ApiResponse({ status: 200, description: 'Return contract reviews' })
  getContractReviews(@Param('id') id: string) {
    return this.contractService.getContractReviews(id);
  }
} 