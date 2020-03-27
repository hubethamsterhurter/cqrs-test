import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { VER } from "../../constants/ver";
import { IsDate } from "class-validator";

export class ServerMessageServerHeartbeat implements ServerMessageType<VER['_0_1'], SERVER_MESSAGE_TYPE['HEARTBEAT']> {
  static get _v() { return VER._0_1; }
  static get _t() { return SERVER_MESSAGE_TYPE.HEARTBEAT; }

  readonly _v = ServerMessageServerHeartbeat._v;
  readonly _t = ServerMessageServerHeartbeat._t;

  @IsDate()
  @Type(() => Date)
  readonly at!: Date;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: { at: Date }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.at = props.at
    }
  }
}
