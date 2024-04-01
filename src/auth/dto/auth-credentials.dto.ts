import { IsString, Matches } from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @Matches(/(?=^[^_]+_?[^_]+$)\w{3,20}$/, {
    message: 'username-weak',
  })
  username: string;

  @IsString()
  @Matches(/(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: 'password-weak',
  })
  password: string;
}
