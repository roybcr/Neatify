import { Injectable } from '@nestjs/common';
import { WsResponse } from '@nestjs/websockets';
import {
  BehaviorSubject,
  mapTo,
  mergeMap,
  Observable,
  of,
  repeat,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import {
  generateRandomDuration,
  mapWsResponse,
  generateRandomNumber,
} from 'src/utils';
import {
  delayIntervalRange,
  displayIntervalRange,
  dummyNotification,
  EVENTS,
  notes,
} from '../constants';
import { NotificationDto } from '../notifications/dto/notification.dto';

@Injectable()
export class SchedulerService {
  private streamSubject: BehaviorSubject<WsResponse<NotificationDto>>;
  public streamSource$: Observable<WsResponse<NotificationDto>>;

  constructor() {
    this.streamSubject = new BehaviorSubject<WsResponse<NotificationDto>>({
      event: '',
      data: { ...dummyNotification[0] },
    });

    this.streamSource$ = this.streamSubject.asObservable();
  }

  runScheduleAsUsusal$() {
    return of('').pipe(
      switchMap(() =>
        timer(
          generateRandomDuration(
            displayIntervalRange.min,
            displayIntervalRange.max
          )
        )
          .pipe(
            mapTo(
              mapWsResponse(EVENTS.notification as string, dummyNotification[0])
            ),
            tap((x) => this.streamSubject.next(x))
          )
          .pipe(tap(() => console.log('Displaying Nothing...')))
          .pipe(tap(() => console.log('Waiting for incoming notification...')))
      ),
      mergeMap(() =>
        timer(
          generateRandomDuration(delayIntervalRange.min, delayIntervalRange.max)
        )
          .pipe(
            mapTo(
              mapWsResponse(
                EVENTS.notification as string,
                notes[generateRandomNumber(notes.length)]
              )
            ),
            tap((x) => this.streamSubject.next(x))
          )
          .pipe(
            tap((payload) => console.log(`Displaying: ${payload.data.message}`))
          )
      ),
      repeat()
    );
  }
}
