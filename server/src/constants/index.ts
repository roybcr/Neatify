import { NotificationDto } from 'src/notifications/dto/notification.dto';

export const CORS_ORIGIN = 'http://localhost:3000';
export const MONGODB_CONNECTION_URI = 'mongodb://localhost:27017/neatify-db';
export const APPGATEWAY = 'AppGateway';

export const delayIntervalRange = {
   min: 5,
   max: 10,
};

export const displayIntervalRange = {
   min: 1,
   max: 4,
};

export enum EVENTS {
   connect = 'connect',
   connection = 'connection',
   identity = 'identity',
   disconnect = 'disconnect',
   notification = 'notification',
   block = 'block',
   delay = 'delay',
}

export const dummyNotification: NotificationDto[] = [
   {
      _id: '-1',
      type: '',
      message: '',
   },
];

export const notes: NotificationDto[] = [
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
