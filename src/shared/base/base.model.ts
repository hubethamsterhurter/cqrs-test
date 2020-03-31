import { IsString, IsOptional, IsDate } from "class-validator";
import { Type } from "class-transformer";
import { IModel } from "../interfaces/interface.model";

/**
 * @desciption
 * Root model
 */
export abstract class BaseModel implements IModel {
  @IsString()
  readonly _n = this.constructor.name;

  @IsString() readonly id!: string;

  // created
  @IsOptional() @IsString() readonly created_by_id!: string | null;
  @IsDate() @Type(() => Date) readonly created_at!: Date;

  // updated
  @IsOptional() @IsString() updated_by_id!: string | null;
  @IsDate() @Type(() => Date) updated_at!: Date;

  // deleted
  @IsOptional() @IsString() deleted_by_id!: string | null;
  @IsOptional() @IsDate() @Type(() => Date) deleted_at!: Date | null;


  /**
   * @constructor
   *
   * @param props
   */
  constructor(props: {
    id: string,

    created_at: Date,
    created_by_id: string | null,

    updated_at: Date,
    updated_by_id: string | null,

    deleted_at: Date | null,
    deleted_by_id: string | null,
  }) {
    if (props) {
      this.id = props.id;

      this.created_at = props.created_at;
      this.created_by_id = props.created_by_id;

      this.updated_at = props.updated_at;
      this.updated_by_id = props.updated_by_id;

      this.deleted_at = props.deleted_at;
      this.deleted_by_id = props.deleted_by_id;
    }
  }
}
