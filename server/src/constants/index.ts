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


