import { IsString } from "class-validator";

export class ReAuthenticateDto {
  @IsString()
  readonly auth_token_id!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    auth_token_id: string,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.auth_token_id = props.auth_token_id;
    }
  }
}