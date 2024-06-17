import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/services/mail.service';
import { ResetToken, ResetTokenSchema } from './reset-token.schema';



@Module({
  
  imports:[MongooseModule.forFeature([{name: User.name, schema: UserSchema},{name: ResetToken.name, schema: ResetTokenSchema}])],
  controllers: [UsersController],
  providers: [UsersService,JwtService,MailService],
})
export class UsersModule {}
