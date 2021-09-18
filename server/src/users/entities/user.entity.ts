import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  ws_id: string;

  @Prop([String])
  blocklist: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
