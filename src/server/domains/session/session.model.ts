import { IsString, IsOptional, IsDate } from "class-validator";
import { Type } from "class-transformer";
import { BaseModel } from "../../base/base.model";
import { IAuditAttributes } from "../../../shared/interfaces/interface.audit-attributes.type";
import { ObjectType } from "type-graphql";
import { Entity } from "typeorm";

@ObjectType()
@Entity({ name: 'sessions'})
export class SessionModel extends BaseModel {
  @IsString()
  socket_id!: string;

  @IsOptional()
  @IsString()
  user_id!: string | null;

  @IsDate()
  @Type(() => Date)
  connected_at!: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  disconnected_at!: Date | null;

  /**
   * @constructor
   *
   * @param props
   */
  constructor(
    base: IAuditAttributes,
    props: {
      socket_id: string,
      user_id: string | null,
      connected_at: Date,
      disconnected_at: Date | null,
    }
  ) {
    super(base);
    if (props) {
      this.socket_id = props.socket_id;
      this.user_id = props.user_id;
      this.connected_at = props.connected_at;
      this.disconnected_at = props.disconnected_at;
    }
  }
}