import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WsResponse,
} from '@nestjs/websockets';
import { distinctUntilChanged, Observable, Subscription } from 'rxjs';
import { mergeWith } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { APPGATEWAY, EVENTS } from './constants';
import { NotificationDto } from './notifications/dto/notification.dto';
import { SchedulerService } from './scheduler/scheduler.service';

@WebSocketGateway(8080, { cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger(APPGATEWAY);
  sub: Subscription = new Subscription();
  constructor(private readonly schedulerService: SchedulerService) {}

  afterInit(server: Server) {
    this.logger.debug(server, 'Initialized!');
  }

  handleConnection(@ConnectedSocket() client: Socket): void {
    client.emit(EVENTS.connection, client.id);
  }

  @SubscribeMessage(EVENTS.identity)
  handleMessage(
    @MessageBody('message') message: string
  ): Observable<WsResponse<NotificationDto>> {
    this.logger.log('Recieved message!', message);

    return this.schedulerService.streamSource$.pipe(
      mergeWith(this.schedulerService.runScheduleAsUsusal$()),
      distinctUntilChanged()
    );
  }

  @SubscribeMessage(EVENTS.block)
  handleBlock(@MessageBody('data') data: string) {
    this.logger.log('Client Blocked Resource', data);
    this.schedulerService.handleBlockEvent();
  }

  handleDisconnect() {
    this.sub.unsubscribe();
  }
}
