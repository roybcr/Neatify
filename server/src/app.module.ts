import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppGateway } from './app.gateway';
import { MONGODB_CONNECTION_URI } from './constants';
import { UsersModule } from './users/users.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [MongooseModule.forRoot(MONGODB_CONNECTION_URI), UsersModule, NotificationsModule],
  controllers: [],
  providers: [AppGateway],
})
export class AppModule {}
