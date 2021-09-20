import { mapTo, of } from 'rxjs';
import { WsResponse } from '@nestjs/websockets';
import { from, switchMap, tap } from 'rxjs';
import { NotificationDto } from '../notifications/dto/notification.dto';

export function generateRandomNumber(length: number): number {
  return ~~(Math.random() * length);
}

export function generateRandomDuration(min: number, max: number): number {
  return (~~(Math.random() * (max - min + 1)) + min) * 1000;
}

export const mapWsResponse = (event: string, data: NotificationDto) => {
  return {
    event,
    data,
  };
};

const saleRegex = /(?:^|\W)sale(?:$|\W)/i;
const newRegex = /(?:^|\W)new(?:$|\W)/i;
const limitedEditionRegex = /\blimited\W+(?:\w+\W+){1,6}?edition\b/i;

export const processNotificationText = (message: string) => {
  const words$ = from([message]).pipe(
    switchMap((x) => (saleRegex.test(x) ? x + '!' : x)),
    switchMap((x) => (newRegex.test(x) ? '~~' + x : x)),
    switchMap((x) =>
      limitedEditionRegex.test(x)
        ? message.replace(limitedEditionRegex, (match) => match.toUpperCase())
        : x
    ),
    tap((x) => console.log(x))
  );

  return words$;
};
