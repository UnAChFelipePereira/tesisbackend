import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { last } from 'rxjs';
import { ChangePasswordDto } from './dto/change-password.dto';
import { APP_GUARD } from '@nestjs/core';
import { TokenExpiredError } from '@nestjs/jwt';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() createUserDto: CreateUserDto) {
    const {email, password} = createUserDto
    return this.usersService.loginUser(email, password);
  }

  @Post('refresh')
  refreshToken(@Req() request: Request) {
    const [type, token] = request.headers['authorization']?.split(' ') || []
    return this.usersService.refreshToken(token);
  }

  @Post('perfil')
  async getperfil(@Body() createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    return this.usersService.Perfil(email);
    
  }

  
  @Put('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req){
    return this.usersService.changePassword(
      req.oid,
      changePasswordDto.oldPassword, 
      changePasswordDto.newPassword,
    );
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
    return this.usersService.forgotPassword(forgotPasswordDto.email);
  }

  @Put('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto){

    return this.usersService.resetPassword(
      resetPasswordDto.newPassword, 
      resetPasswordDto.resetToken,

    );
  } 
  
}
