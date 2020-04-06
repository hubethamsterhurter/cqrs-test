import { Has_n } from "../types/has-_n.type";

export interface IModel extends Has_n {
  readonly id: string;

  // created
  readonly created_by_id: string | null;
  readonly created_at: Date;

  // updated
  updated_by_id: string | null;
  updated_at: Date;

  // deleted
  deleted_by_id: string | null;
  deleted_at: Date | null;

}
