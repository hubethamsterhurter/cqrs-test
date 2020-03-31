import { Type } from 'class-transformer';
import { IsString, IsDate, IsBoolean } from "class-validator";
import { CreateMo } from '../../../helpers/create-mo.helper';
import { BaseDto } from '../../../base/base.dto';

export class UserTypingDto extends BaseDto {
  @IsString()
  readonly user_name!: string;

  @IsBoolean()
  readonly typing!: boolean;

  @IsDate()
  @Type(() => Date)
  readonly timestamp!: Date;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    user_name: string,
    typing: boolean,
    timestamp: Date,
  }) {
    super();
    if (props) {
      this.user_name = props.user_name;
      this.typing = props.typing;
      this.timestamp = props.timestamp;
    }
  }
}

export class UserTypingSmo extends CreateMo(UserTypingDto) {}
