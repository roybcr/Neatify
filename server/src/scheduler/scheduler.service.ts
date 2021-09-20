import { Injectable } from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import {
  BehaviorSubject,
  mapTo,
  Observable,
  of,
  repeat,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { generateRandomDuration, mapWsResponse, generateRandomNumber } from 'src/utils';
import {
  delayIntervalRange,
  displayIntervalRange,
  dummyNotification,
  EVENTS,
} from '../constants';
import { NotificationDto } from '../notifications/dto/notification.dto';

@Injectable()
export class SchedulerService {
  private streamSubject: BehaviorSubject<WsResponse<NotificationDto>>;
  public streamSource$: Observable<WsResponse<NotificationDto>>;

  private skipNextEmission: boolean = false;

  constructor() {
    this.streamSubject = new BehaviorSubject<WsResponse<NotificationDto>>({
      event: '',
      data: { ...dummyNotification[0] },
    });

    this.streamSource$ = this.streamSubject.asObservable();
  }

  runScheduleAsUsusal$(notifications: NotificationDto[]) {
    return of('').pipe(
      switchMap(() =>
        timer(generateRandomDuration(displayIntervalRange.min, displayIntervalRange.max))
          .pipe(
            mapTo(mapWsResponse(EVENTS.notification as string, dummyNotification[0])),
            tap((x) => this.streamSubject.next(x))
          )
          .pipe(tap(() => console.log('Displaying Nothing...')))
          .pipe(tap(() => console.log('Waiting for incoming notification...')))
      ),

      switchMap(() =>
        this.skipNextEmission === true
          ? this.skipNextNotification$()
          : timer(generateRandomDuration(delayIntervalRange.min, delayIntervalRange.max))
              .pipe(
                mapTo(
                  mapWsResponse(
                    EVENTS.notification as string,
                    notifications[generateRandomNumber(notifications.length)]
                  )
                ),
                tap((x) => this.streamSubject.next(x))
              )
              .pipe(tap((payload) => console.log(`Displaying: ${payload.data.message}`)))
      ),
      repeat()
    );
  }

  skipNextNotification$() {
    return timer(generateRandomDuration(delayIntervalRange.min, delayIntervalRange.max))
      .pipe(
        mapTo(mapWsResponse(EVENTS.block as string, dummyNotification[0])),
        tap((x) => this.streamSubject.next(x))
      )
      .pipe(tap(() => console.log('Skipping notification')))
      .pipe(tap(() => (this.skipNextEmission = false)));
  }

  handleBlockEvent() {
    this.skipNextEmission = true;
    console.log('Blocked the next call');
  }
}
