import { Type } from "class-transformer";
import { IDro } from "../interfaces/interface.dro";

export class BaseDro implements IDro {
  readonly _n = this.constructor.name;
  readonly id!: string;

  readonly created_by_id!: string | null;
  @Type(() => Date) readonly created_at!: Date;

  updated_by_id!: string | null;
  @Type(() => Date) updated_at!: Date;

  deleted_by_id!: string | null;
  @Type(() => Date) deleted_at!: Date | null;


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