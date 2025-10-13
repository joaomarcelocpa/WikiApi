import { UserType } from '../../users/enums/user-type.enum';

export interface JwtUser {
  id: string;
  email: string;
  name: string;
  type: UserType;
}
