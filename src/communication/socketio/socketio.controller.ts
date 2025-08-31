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
  ApiTags,
  ApiOperation,
} from '@nestjs/swagger';
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

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'), RolesGuard)
@ApiTags('SocketIO')
@Controller({ path: 'socketio', version: '1' })
export class SocketIoController {
  constructor(private readonly socketio: SocketIoService) {}

  @Roles(RoleEnum.admin)
  @ApiOperation({ summary: 'Health/status (basic), Redis bootstrap flag' })
  @Get('health')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      example: {
        ok: true,
        bootstrapped: true,
        namespaces: ['/ws'],
      },
    },
  })
  health() {
    return this.socketio.health();
  }

  @Roles(RoleEnum.admin)
  @ApiOperation({ summary: 'List namespaces' })
  @Get('namespaces')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: { example: { namespaces: ['/ws', '/binance'] } } })
  namespaces() {
    return this.socketio.namespaces();
  }

  @Roles(RoleEnum.admin)
  @ApiOperation({ summary: 'List rooms in a namespace (default: /ws)' })
  @Get('rooms')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      example: { namespace: '/ws', rooms: ['user:123', 'orders:open'] },
    },
  })
  rooms(@Query() query: QueryNamespaceDto) {
    return this.socketio.rooms(query);
  }

  @Roles(RoleEnum.admin)
  @ApiOperation({ summary: 'List sockets in a namespace (default: /ws)' })
  @Get('sockets')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    schema: {
      example: {
        namespace: '/ws',
        sockets: [
          {
            id: 'abc123',
            rooms: ['abc123', 'user:123'],
            user: { id: '123', email: 'a@b.com' },
          },
        ],
      },
    },
  })
  sockets(@Query() query: QueryNamespaceDto) {
    return this.socketio.sockets(query);
  }

  @Roles(RoleEnum.admin)
  @ApiOperation({ summary: 'Broadcast event to a namespace (default: /ws)' })
  @Post('broadcast')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: { example: { ok: true } } })
  broadcast(@Body() dto: EmitBroadcastDto) {
    return this.socketio.broadcast(dto);
  }

  @Roles(RoleEnum.admin)
  @ApiOperation({ summary: 'Emit to a room in a namespace (default: /ws)' })
  @Post('emit/room')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: { example: { ok: true } } })
  emitToRoom(@Body() dto: EmitRoomDto) {
    return this.socketio.emitToRoom(dto);
  }

  @Roles(RoleEnum.admin)
  @ApiOperation({ summary: 'Emit to a user’s personal room (user:{id})' })
  @Post('emit/user')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ schema: { example: { ok: true } } })
  emitToUser(@Body() dto: EmitUserDto) {
    return this.socketio.emitToUser(dto);
  }

  @Roles(RoleEnum.admin)
  @ApiOperation({ summary: 'Disconnect a socket by ID (in a namespace)' })
  @Delete('disconnect/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  disconnect(@Param('id') id: string, @Query() query: QueryNamespaceDto) {
    return this.socketio.disconnectSocket(id, query);
  }

  @Roles(RoleEnum.admin)
  @ApiOperation({
    summary: 'Kick a user (disconnect all sockets in user:{id})',
  })
  @Delete('kick/user/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  kickUser(@Param('userId') userId: string, @Query() query: QueryNamespaceDto) {
    return this.socketio.kickUser(userId, query);
  }
}
