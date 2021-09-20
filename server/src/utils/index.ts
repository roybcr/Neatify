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
const limitedEditionRegex = /(?:^|\W)(limited)\s(edition)(?:$|\W)/i;

const processNotificationText = (message: string) => {
  const s = saleRegex.test(message) ? message + ' ' + '!' : message;
  const n = newRegex.test(s) ? '~~' + ' ' + s : s;
  const le = limitedEditionRegex.test(n)
    ? n.replace(n.match(limitedEditionRegex)[0], ' LIMITED EDITION ')
    : n;
  return le;
};

export const mapWsResponse = (event: string, data: NotificationDto) => {
  Object.assign(data, { ...data, message: processNotificationText(data.message) });

  return {
    event,
    data,
  };
};
