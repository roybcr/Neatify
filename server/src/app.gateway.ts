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
import { NotificationsService } from './notifications/notifications.service';
import { SchedulerService } from './scheduler/scheduler.service';
import { UsersService } from './users/users.service';

@WebSocketGateway(8080, { cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger(APPGATEWAY);
  private notifications: NotificationDto[];
  sub: Subscription = new Subscription();
  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService
  ) {}

  async afterInit(server: Server) {
    this.logger.debug(server, 'Initialized!');
    this.notifications = (await this.notificationsService.findAll()) as NotificationDto[];
  }

  async handleConnection(@ConnectedSocket() client: Socket): Promise<void> {
    client.emit(EVENTS.connection, client.id);
    this.usersService.create({
      ws_id: client.id,
      blocklist: [],
    });
  }

  @SubscribeMessage(EVENTS.identity)
  handleMessage(
    @MessageBody('message') message: string
  ): Observable<WsResponse<NotificationDto>> {
    this.logger.log('Recieved message!', message);
    // Start sending notifications at random intervals of display & delay.
    return this.schedulerService.streamSource$.pipe(
      mergeWith(this.schedulerService.runScheduleAsUsusal$(this.notifications)),
      distinctUntilChanged()
    );
  }

  @SubscribeMessage(EVENTS.block)
  async handleBlock(
    @MessageBody('data') data: string,
    @ConnectedSocket() client: Socket
  ) {
    this.logger.log('Client Blocked Resource', data);
    const user = await this.usersService.findOne(client.id);
    if (!user) {
      return;
    }
    const notification = await this.notificationsService.findOne(data); // Blocked notification id.
    if (!notification) {
      return;
    }

    // Insert blocked notification to the user's blocklist, and filter it out from the notifications reference.
    user.blocklist.push(notification as NotificationDto);
    await this.usersService.update(client.id, user);
    this.notifications = this.notifications.filter((x) => x._id !== data);

    // Will skip the next emission
    this.schedulerService.handleBlockEvent();
  }

  handleDisconnect() {
    this.sub.unsubscribe();
  }
}
