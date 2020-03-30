import { IsString } from "class-validator";

export class DeleteChatDto {
  @IsString()
  readonly id!: string;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    id: string,
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.id = props.id;
    }
  }
}
