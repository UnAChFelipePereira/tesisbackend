import { Injectable, HttpException, HttpStatus, NotFoundException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import * as bcryp from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ResetToken } from './reset-token.schema';
import { MailService } from 'src/services/mail.service';
import { v4 as uuidv4 } from 'uuid';



type Tokens ={
  access_token: string,
  refresh_token: string
};

@Injectable()
export class UsersService {

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtSvc: JwtService,
              @InjectModel(ResetToken.name) private ResetTokenModel: Model<ResetToken>,
              private mailService: MailService,  
            ){}

  //async create(createUserDto: CreateUserDto):Promise<User> {
    async create(createUserDto: CreateUserDto) {
    try {
      const hasherPassword = await bcryp.hash(createUserDto.password,10);

      const newUser = new this.userModel({
        ... createUserDto,
        password: hasherPassword
      });

      const user = await newUser.save();
      const { access_token, refresh_token } = await this.generateTokens(user);
      return{
        access_token,
        refresh_token,
        user: this.removePassword(user),
        status:HttpStatus.CREATED,
        message:'Cuenta creada'

      }

    } catch (error) {
      throw new HttpException('Error al crear', HttpStatus.UNAUTHORIZED)
    }
  }



  async Perfil(email: string) {

    const user = await this.userModel.findOne({ email});
    const payload = {sub: user._id, email: user.email, name: user.name}
       const { access_token, refresh_token } = await this.generateTokens(payload);
       return {
        access_token,
        refresh_token,
        user: this.removePassword(user),
        message: 'DATOS CON ÉXITO',
       };  
  }


  async loginUser(email: string, password: string) {
    try {
      const user = await this.userModel.findOne({ email });
      const isPasswordValid = await bcryp.compare(password, user.password);

      if (!isPasswordValid) {
        throw new HttpException('Contraseña invalida', HttpStatus.UNAUTHORIZED)   
      }

      if (user && isPasswordValid) {
       const payload = {sub: user._id, email: user.email, name: user.name, lastname: user.lastname}
       const { access_token, refresh_token } = await this.generateTokens(payload);
       return {
        access_token: access_token,
        refresh_token: refresh_token,
        user: this.removePassword(user),
        message: 'INGRESO DE SESIÓN CON ÉXITO',

       };  

      }   
    } catch (error) {
      throw new HttpException('Revisa tus credenciales', HttpStatus.UNAUTHORIZED)
    }

  }

  async refreshToken(refreshToken: string){
try {
  const user = this.jwtSvc.verify(refreshToken, {secret: 'jwt secret_refresh'})
  const payload = { sub: user._id, email: user.email, name: user.name}
  const { access_token, refresh_token } = await this.generateTokens(payload);
  return{
    access_token,
    refresh_token,
    status:200,
    message:'Refresh Token exitoso'
  }
} catch (error) {
  throw new HttpException('Refresh_token fallido', HttpStatus.UNAUTHORIZED)
}


  }


  private async generateTokens(user): Promise <Tokens>{
    const jwtPayload = { sub: user._id, email: user.email, name: user.name}

    const[accessToken,refreshToken] = await Promise.all([

      this.jwtSvc.signAsync(jwtPayload, {secret: 'jwt secret', expiresIn: '1d'}),
      this.jwtSvc.signAsync(jwtPayload, {secret: 'jwt secret_refresh',expiresIn: '2d'})
  ])

  return {

    access_token: accessToken,
    refresh_token: refreshToken
  }
}


private removePassword(user){
  const {password, ... rest} = user.toObject();
  return rest;
}

async changePassword(oid, oldPassword: string, newPassword: string){

  const user = await this.userModel.findOne({ oid });
  
  if(!user){
    throw new NotFoundException ('Usuario no encontrado.');
  }
  const isPasswordValid = await bcryp.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw new HttpException('Contraseña invalida', HttpStatus.UNAUTHORIZED)   
  }

const newHashedPassword = await bcryp.hash(newPassword,10);
user.password = newHashedPassword;
await user.save();
return{
  status:200,
  message:'¡Cambio de clave éxitoso!'
}
}


async resetPassword(newPassword: string, resetToken: string){

  const token = await this.ResetTokenModel.findOne({
    token: resetToken,
    expiryDate: {$gte: new Date(),
     },
  });

  if (!token){
    throw new UnauthorizedException('Enlace Invalido')
  }

  const user = await this.userModel.findById(token.userId);
  if(!user){
    throw new InternalServerErrorException();
  }

  user.password = await bcryp.hash(newPassword,10);
  await user.save();
  return{
    status:200,
    message:'¡Cambio de clave éxitoso!'
  }
}





async forgotPassword(email: string) {
  const user = await this.userModel.findOne({ email });
  if (user) {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    const resetToken = uuidv4(20);

    await this.ResetTokenModel.create({
      token: resetToken,
      userId: user._id,
      expiryDate
    });
    this.mailService.sendPasswprdResetEmail(email, resetToken);
  }

  return { message: 'Se ha enviado un correo a la siguiente dirección: ' + email };
}


async updateProfilePic(userId: string, profilePicPath: string): Promise<void> {
  await this.userModel.findByIdAndUpdate(userId, { profilePic: profilePicPath });
}



}
