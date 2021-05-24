import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Personal } from './personal';

export type UserDocument = User & Document;

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
    sparse: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: false })
  personal: Personal;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

const UserFactory = SchemaFactory.createForClass(User);

UserFactory.pre<User>('save', function (next) {
  if (this.password && this.password.length > 0) {
    bcrypt.hash(this.password, bcrypt.genSaltSync(), (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  }
});

export const UserSchema = UserFactory;
