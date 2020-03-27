import { UserModel } from "../user/user.model";
import { IsString, IsOptional, IsDate, MinLength, MaxLength } from "class-validator";
import { ModelType } from "../model.type";
import { Type } from "class-transformer";
import { ID_DEFINITION } from "../id.definition";

export class ClientModel implements ModelType {
  @MinLength(ID_DEFINITION.id.minLength)
  @MaxLength(ID_DEFINITION.id.maxLength)
  @IsString()
  id!: string;

  @IsString()
  socket_id!: string;

  // one user could have many sockets
  @IsOptional()
  @IsString()
  user_id!: null | UserModel['id'];

  @IsDate()
  @Type(() => Date)
  connected_at!: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  disconnected_at!: Date | null;

  @IsDate() @Type(() => Date) updated_at!: Date;
  @IsDate() @Type(() => Date) created_at!: Date;
  @IsOptional() @IsDate() @Type(() => Date) deleted_at!: Date | null;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    id: string,
    socket_uuid: string,
    user_id: UserModel['id'] | null,
    connected_at: Date,
    disconnected_at: Date | null,
  }) {
    if (props) {
      this.id = props.id;
      this.socket_id = props.socket_uuid;
      this.user_id = props.user_id;
      this.connected_at = props.connected_at;
      this.disconnected_at = props.disconnected_at;
    }
  }
}