import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<UserDocument>,
  ) {}

  async create(data: any) {
    const result = await this.userModel.create(data);
    return result.id;
  }

  async update(entity: User) {
    return await entity.save();
  }

  async findById(id: string) {
    return await this.userModel
      .findById(id)
      .select(['+password', '+riot.summonerId', '+riot.accountId']);
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async getUserBilling(id: string) {
    const entity = await this.userModel.findById(id);
    return {
      name: entity.name,
      document: entity.personal.document,
      email: entity.email,
      address: entity.personal.address,
      phone: entity.personal.phone,
      birthDate: entity.personal.birthday,
    };
  }

  async verifyPassword(password: string, entityPassword: string) {
    return await bcrypt.compare(password, entityPassword);
  }
}
