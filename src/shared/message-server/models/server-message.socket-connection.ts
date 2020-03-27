import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { VER } from "../../constants/ver";
import { IsDate, IsString } from "class-validator";

export class ServerMessageSocketConnection implements ServerMessageType<VER['_0_1'], SERVER_MESSAGE_TYPE['SOCKET_CONNECTED']> {
  static get _v() { return VER._0_1; }
  static get _t() { return SERVER_MESSAGE_TYPE.SOCKET_CONNECTED; }

  readonly _v = ServerMessageSocketConnection._v;
  readonly _t = ServerMessageSocketConnection._t;

  @IsString()
  readonly uuid!: string;

  @IsDate()
  @Type(() => Date)
  readonly connected_at!: Date;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: { uuid: string, connected_at: Date }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.uuid = props.uuid
      this.connected_at = props.connected_at;
    }
  }
}
