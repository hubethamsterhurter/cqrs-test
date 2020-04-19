import { A_USER_COLOUR } from '../../constants/user-colour';
import { BaseViewable } from '../../base/base.dto';

export class UserViewable extends BaseViewable {
  readonly user_name!: string;

  readonly colour!: A_USER_COLOUR;
}