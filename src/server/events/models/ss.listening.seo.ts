import { BaseDto } from "../../../shared/base/base.dto";
import { CreateSe } from "../../../shared/helpers/create-se.helper";

export class SSListeningSeDto extends BaseDto {
  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    //
  }) {
    super();
    if (props) {
      //
    }
  }
}

export class SSListeningSeo extends CreateSe(SSListeningSeDto) {}
