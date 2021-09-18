import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Mongoose } from 'mongoose';

@Schema()
export class Notification extends Document {
  @Prop()
  type: string;

  @Prop()
  text: string;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
