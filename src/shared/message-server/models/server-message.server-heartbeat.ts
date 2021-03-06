import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { IsDate, IsObject, ValidateNested, Equals } from "class-validator";
import { Trace } from '../../helpers/Tracking.helper';

const _t = SERVER_MESSAGE_TYPE.HEARTBEAT

export class ServerMessageServerHeartbeat implements ServerMessageType<SERVER_MESSAGE_TYPE['HEARTBEAT']> {
  static get _t() { return _t; }
  @Equals(_t) readonly _t = ServerMessageServerHeartbeat._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly _o!: Trace;

  @IsDate()
  @Type(() => Date)
  readonly at!: Date;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    _o: Trace,
    at: Date
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this._o = props._o;
      this.at = props.at;
    }
  }
}
