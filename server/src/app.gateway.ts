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
import {
  delay,
  mapTo,
  of,
  repeat,
  skip,
  Subscription,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { Server, Socket } from 'socket.io';
import { EVENTS } from './events.enum';
import { NotificationDto } from './notifications/dto/notification.dto';

@WebSocketGateway(8080, { transports: ['websocket'], cors: true })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('AppGateway');
  sub: Subscription = new Subscription();
  notes: NotificationDto[] = [
    { _id: '1', type: 'info', message: 'Big sale next week' },
    { _id: '2', type: 'info', message: 'New auction next month!' },
    {
      _id: '3',
      type: 'warning',
      message: 'Limited edition books for next auction',
    },
    {
      _id: '4',
      type: 'success',
      message: 'New books with limited edition coming next week',
    },
    { _id: '5', type: 'error', message: 'Last items with limited time offer' },
  ];

  generateRandomNumber() {
    return ~~(Math.random() * this.notes.length);
  }

  generateRandomDuration(min: number, max: number) {
    return (~~(Math.random() * (max - min + 1)) + min) * 1000;
  }

  timeManager$() {
    return of('').pipe(
      switchMap(() =>
        timer(this.generateRandomDuration(2, 8))
          .pipe(tap(() => this.logger.log('Displaying Nothing...')))
          .pipe(
            tap(() => this.logger.log('Waiting for incoming notification...')),
          ),
      ),

      switchMap(() =>
        timer(this.generateRandomDuration(5, 10)).pipe(
          mapTo(this.generateRandomNumber()),
          tap((random) =>
            this.logger.log(
              `Displaying Notification: ${this.notes[random].message}`,
            ),
          ),
        ),
      ),

      repeat(),
    );
  }

  afterInit(server: Server) {
    this.sub = this.timeManager$().subscribe(console.log);
    this.logger.log(server, 'Initialized!');
  }

  handleConnection(client: Socket): void {
    client.emit(EVENTS.connection, client.id);
  }

  handleDisconnect(client: Socket) {
    this.logger.log('Client disconnected', client.id);
    this.sub.unsubscribe();
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): WsResponse<string> {
    this.logger.log('Message received', message);
    return { event: 'message', data: message };
  }
}
