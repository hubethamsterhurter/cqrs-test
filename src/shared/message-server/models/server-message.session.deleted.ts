import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { ValidateNested, IsObject, Equals, } from "class-validator";
import { SessionModel } from '../../domains/session/session.model';
import { Trace } from '../../helpers/Tracking.helper';

const _t = SERVER_MESSAGE_TYPE.SESSION_DELETED

export class ServerMessageSessionDeleted implements ServerMessageType<SERVER_MESSAGE_TYPE['SESSION_DELETED']> {
  static get _t() { return _t; }
  @Equals( _t) readonly _t = ServerMessageSessionDeleted._t;

  @IsObject()
  @ValidateNested()
  @Type(() => Trace)
  readonly trace!: Trace;

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
      this.trace = props._o;
      this.model = props.model;
    }
  }
}