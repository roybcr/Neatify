import { map, mapTo, of, scan } from 'rxjs';
import { WsResponse } from '@nestjs/websockets';
import { from, switchMap, tap } from 'rxjs';
import { NotificationDto } from '../notifications/dto/notification.dto';

export function generateRandomNumber(length: number): number {
  return ~~(Math.random() * length);
}

export function generateRandomDuration(min: number, max: number): number {
  return (~~(Math.random() * (max - min + 1)) + min) * 1000;
}

const saleRegex = /(?:^|\W)sale(?:$|\W)/i;
const newRegex = /(?:^|\W)new(?:$|\W)/i;
const limitedRegex = /(?:^|\W)limited(?:$|\W)/i;
const editionRegex = /(?:^|\W)edition(?:$|\W)/i;

export const processNotificationText = (message: string) => {
  const words$ = from([message]).pipe(
    map((x) => (saleRegex.test(x) ? x + '!' : x)),
    map((x) => (newRegex.test(x) ? '~~' + x : x)),
    scan((a, b) =>
      limitedRegex.test(a) && editionRegex.test(b)
        ? message.replace(a + ' ' + b, a.toUpperCase() + ' ' + b.toUpperCase())
        : a + ' ' + b
    )
  );

  return words$;
};

export const mapWsResponse = (event: string, data: NotificationDto) => {
  processNotificationText(data.message).subscribe(console.log);

  return {
    event,
    data,
  };
};
