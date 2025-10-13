import { UserType } from '../enums/user-type.enum';

export class UserViewResponseDto {
  id: string;
  name: string;
  email: string;
  type: UserType;
  created_at: Date;
  updated_at: Date;
}
