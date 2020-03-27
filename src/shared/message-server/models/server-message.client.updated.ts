import { Type } from 'class-transformer';
import { ServerMessageType, SERVER_MESSAGE_TYPE } from "../modules/server-message-type";
import { ValidateNested, IsObject, Equals } from "class-validator";
import { VER } from "../../constants/ver";
import { ClientModel } from '../../domains/connected-client/client.model';

const _v = VER._0_1;
const _t = SERVER_MESSAGE_TYPE.CLIENT_UPDATED

export class ServerMessageClientUpdated implements ServerMessageType<VER['_0_1'], SERVER_MESSAGE_TYPE['CLIENT_UPDATED']> {
  static get _v() { return _v; }
  static get _t() { return _t; }

  @Equals( _v) readonly _v = ServerMessageClientUpdated._v;
  @Equals( _t) readonly _t = ServerMessageClientUpdated._t;

  @IsObject()
  @ValidateNested()
  @Type(() => ClientModel)
  model!: ClientModel;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: { model: ClientModel }) {
    // props will not be defined if we do not construct ourselves
    if (props) {
      this.model = props.model;
    }
  }
}