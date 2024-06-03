import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  
  imports:[MongooseModule.forFeature([{name: User.name, schema: UserSchema}])],
  controllers: [UsersController],
  providers: [UsersService,JwtService],
})
export class UsersModule {}