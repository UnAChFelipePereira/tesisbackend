import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from './services/mail.service';
import { MulterModule } from '@nestjs/platform-express';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';


@Module({
  imports: [UsersModule, MongooseModule.forRoot('mongodb://root:admin@localhost/dbtesis'),
    MulterModule.register({dest: './uploads', })
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}
