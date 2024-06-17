import { IsNotEmpty, IsString, IsEmail, MinLength} from 'class-validator';

export class CreateUserDto {

  @IsString()
  readonly name: string;

  @IsString()
  readonly lastname: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;

  
}