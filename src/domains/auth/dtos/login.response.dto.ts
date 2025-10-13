import { UserType } from '../../users/enums/user-type.enum';

export class LoginResponseDto {
  access_token: string;
  user: {
    id: string;
    name: string;
    email: string;
    type: UserType;
  };
}
