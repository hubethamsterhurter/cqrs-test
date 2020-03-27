import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { VER } from "../../constants/ver";
import { IsObject, ValidateNested } from "class-validator";
import { ClientModel } from '../../domains/connected-client/client.model';

// @note: this class is technically deprecated...? can just use the model repos "created" event...
export class ServerMessageSocketConnection implements ServerMessageType<VER['_0_1'], SERVER_MESSAGE_TYPE['SOCKET_CONNECTED']> {
  static get _v() { return VER._0_1; }
  static get _t() { return SERVER_MESSAGE_TYPE.SOCKET_CONNECTED; }

  readonly _v = ServerMessageSocketConnection._v;
  readonly _t = ServerMessageSocketConnection._t;

  @IsObject()
  @ValidateNested()
  @Type(() => ClientModel)
  readonly model!: ClientModel;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: { model: ClientModel }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.model = props.model
    }
  }
}
