import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { ValidateNested, IsObject, Equals, } from "class-validator";
import { SessionModel } from '../../domains/session/session.model';
import { Trace } from '../../helpers/Tracking.helper';

const _t = SERVER_MESSAGE_TYPE.CLIENT_CREATED

export class ServerMessageClientCreated implements ServerMessageType<SERVER_MESSAGE_TYPE['CLIENT_CREATED']> {
  static get _t() { return _t; }
  @Equals( _t) readonly _t = ServerMessageClientCreated._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly _o!: Trace;

  @IsObject()
  @ValidateNested()
  @Type(() => SessionModel)
  readonly model!: SessionModel;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    _o: Trace,
    model: SessionModel
  }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this._o = props._o;
      this.model = props.model;
    }
  }
}