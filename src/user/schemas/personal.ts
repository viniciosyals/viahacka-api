import { Prop, raw, Schema } from '@nestjs/mongoose';

@Schema()
export class Personal {
  @Prop({ required: true })
  document: string;

  @Prop({ required: true })
  birthday: Date;

  @Prop({ required: true })
  phone: string;

  @Prop(
    raw({
      street: { type: String },
      number: { type: String },
      complement: { type: String },
      neighborhood: { type: String },
      city: { type: String },
      state: { type: String },
      postCode: { type: String },
    }),
  )
  address: any;
}
