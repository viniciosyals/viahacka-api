import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_HOST, {
      useCreateIndex: true,
      useNewUrlParser: true,
    }),
    UserModule,
    AuthModule,
    ScheduleModule.forRoot(),
  ],
  providers: [],
})
export class AppModule {}
