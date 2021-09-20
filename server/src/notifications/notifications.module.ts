import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './entities/notification.entity';
import { NotificationsService } from './notifications.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Notification.name,
        schema: NotificationSchema,
      },
    ]),
  ],
  controllers: [],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
