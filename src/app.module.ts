import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from './services/mail.service';


@Module({
  imports: [UsersModule, MongooseModule.forRoot('mongodb://root:admin@localhost/dbtesis')],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
