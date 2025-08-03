import {
  Controller,
  Post,
  Param,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { WebhooksService } from './webhooks.service';
import { WebhookRequestDto } from './dto/webhook-request.dto';
import { WebhookResponseDto } from './dto/webhook-response.dto';
import { TypeMessage } from '../utils/types/message.type';

@ApiTags('Webhooks')
@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post(':provider')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Handle incoming webhook events' })
  @ApiParam({
    name: 'provider',
    description: 'The provider name for this webhook (e.g., test)',
    example: 'test',
  })
  @ApiBody({
    type: WebhookRequestDto,
    description: 'The incoming webhook payload',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: TypeMessage.getMessageByStatus(HttpStatus.OK),
    type: WebhookResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: TypeMessage.getMessageByStatus(HttpStatus.BAD_REQUEST),
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: TypeMessage.getMessageByStatus(
      HttpStatus.INTERNAL_SERVER_ERROR,
    ),
  })
  async handleWebhook(
    @Param('provider') provider: string,
    @Body() body: WebhookRequestDto,
    @Headers() headers: Record<string, string>,
  ): Promise<WebhookResponseDto> {
    return this.webhooksService.process(provider, body, headers);
  }
}
