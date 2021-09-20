import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { NotificationDto } from 'src/notifications/dto/notification.dto';

@Schema()
export class User extends Document {
   @Prop()
   ws_id: string;

   @Prop([NotificationDto])
   blocklist: NotificationDto[];
}

export const UserSchema = SchemaFactory.createForClass(User);
