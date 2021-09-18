import { Logger } from '@nestjs/common';
import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { from, interval, map, Subscription } from 'rxjs';
import { Socket, Server } from 'socket.io';

@WebSocketGateway(8080, { transports: 'polling', cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('AppGateway');
  sub: Subscription = new Subscription();

  afterInit(server: Server) {
    this.logger.log(server, 'Initialized!');
  }

  handleConnection(client: Socket): void {
    client.emit('connect', { data: 'hello!' });
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected', client.id);
    this.sub.unsubscribe();
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): WsResponse<string> {
    console.log('Message received', message);
    return { event: 'message', data: message };
  }
}
