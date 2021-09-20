import { WsResponse } from '@nestjs/websockets';
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
