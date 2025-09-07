import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { ApiOperationRoles } from '../../utils/decorators/swagger.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../roles/roles.guard';
import { Roles } from '../../roles/roles.decorator';
import { RoleEnum } from '../../roles/roles.enum';
import { SocketIoService } from './socketio.service';
import { QueryNamespaceDto } from './dto/query-socketio.dto';
import {
  EmitBroadcastDto,
  EmitRoomDto,
  EmitUserDto,
} from './dto/emit-socketio.dto';
import {
  HealthDto,
  NamespacesDto,
  RoomsDto,
  SocketsDto,
  EmitNamespaceResultDto,
  EmitRoomResultDto,
  EmitUserResultDto,
} from './dto/response-socketio.dto';
import { RegisterApiTag } from '../../common/api-docs/decorators/register-api-tag.decorator';
import { UserPresenceDto } from './dto/user-socketio.dto';

@RegisterApiTag(
  'SocketIO',
  'A Realtime gateway in NestJS for handling real-time WebSocket events,Base on Http Controller.',
  'https://docs.nestjs.com/websockets/gateways',
)
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(RoleEnum.admin)
@Controller({ path: 'socketio', version: '1' })
export class SocketIoController {
  constructor(private readonly socketio: SocketIoService) {}
  @ApiOperationRoles('Health/status (basic), Redis bootstrap flag', [
    RoleEnum.admin,
  ])
  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: HealthDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
  @ApiForbiddenResponse({ description: 'Requires admin role.' })
  health() {
    return this.socketio.health();
  }

  @ApiOperationRoles('List namespaces', [RoleEnum.admin])
  @Get('namespaces')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: NamespacesDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
  @ApiForbiddenResponse({ description: 'Requires admin role.' })
  namespaces() {
    return this.socketio.namespaces();
  }

  @ApiOperationRoles('List rooms in a namespace (default: /ws)', [
    RoleEnum.admin,
  ])
  @Get('rooms')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: RoomsDto })
  @ApiBadRequestResponse({
    description: 'Validation error for query parameters.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
  @ApiForbiddenResponse({ description: 'Requires admin role.' })
  rooms(@Query() query: QueryNamespaceDto) {
    return this.socketio.rooms(query);
  }

  @ApiOperationRoles('List sockets in a namespace (default: /ws)', [
    RoleEnum.admin,
  ])
  @Get('sockets')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: SocketsDto })
  @ApiBadRequestResponse({
    description: 'Validation error for query parameters.',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
  @ApiForbiddenResponse({ description: 'Requires admin role.' })
  sockets(@Query() query: QueryNamespaceDto) {
    return this.socketio.sockets(query);
  }

  @ApiOperationRoles('Broadcast event to a namespace (default: /ws)', [
    RoleEnum.admin,
  ])
  @Post('broadcast')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: EmitNamespaceResultDto })
  @ApiBadRequestResponse({
    description: 'Invalid payload (body validation failed).',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
  @ApiForbiddenResponse({ description: 'Requires admin role.' })
  broadcast(@Body() dto: EmitBroadcastDto) {
    return this.socketio.broadcast(dto);
  }

  @ApiOperationRoles('Emit to a room in a namespace (default: /ws)', [
    RoleEnum.admin,
  ])
  @Post('emit/room')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: EmitRoomResultDto })
  @ApiBadRequestResponse({
    description: 'Invalid payload (body validation failed).',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
  @ApiForbiddenResponse({ description: 'Requires admin role.' })
  emitToRoom(@Body() dto: EmitRoomDto) {
    return this.socketio.emitToRoom(dto);
  }

  @ApiOperationRoles('Emit to a user’s personal room (user:{id})', [
    RoleEnum.admin,
  ])
  @Post('emit/user')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: EmitUserResultDto })
  @ApiBadRequestResponse({
    description: 'Invalid payload (body validation failed).',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
  @ApiForbiddenResponse({ description: 'Requires admin role.' })
  emitToUser(@Body() dto: EmitUserDto) {
    return this.socketio.emitToUser(dto);
  }

  @ApiOperationRoles('Check if a user is connected and get presence info', [
    RoleEnum.admin,
  ])
  @Get('presence/user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: UserPresenceDto })
  @ApiBadRequestResponse({ description: 'Invalid user ID or namespace.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
  @ApiForbiddenResponse({ description: 'Requires admin role.' })
  userPresence(
    @Param('userId') userId: string,
    @Query() query: QueryNamespaceDto,
  ) {
    return this.socketio.userPresence(userId, query);
  }

  @ApiOperationRoles('Disconnect a socket by ID (in a namespace)', [
    RoleEnum.admin,
  ])
  @Delete('disconnect/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'Socket disconnected.' })
  @ApiBadRequestResponse({ description: 'Invalid socket ID or namespace.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
  @ApiForbiddenResponse({ description: 'Requires admin role.' })
  disconnect(@Param('id') id: string, @Query() query: QueryNamespaceDto) {
    return this.socketio.disconnectSocket(id, query);
  }

  @ApiOperationRoles('Kick a user (disconnect all sockets in user:{id})', [
    RoleEnum.admin,
  ])
  @Delete('unsubscribe/user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'All user sockets disconnected.' })
  @ApiBadRequestResponse({ description: 'Invalid user ID or namespace.' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT.' })
  @ApiForbiddenResponse({ description: 'Requires admin role.' })
  kickUser(@Param('userId') userId: string, @Query() query: QueryNamespaceDto) {
    return this.socketio.kickUser(userId, query);
  }
}
