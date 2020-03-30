import { IsString } from "class-validator";

export class CreateAuthTokenDto {
  // TODO: strong validation
  @IsString()
  readonly body!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    body: string,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.body = props.body;
    }
  }
}