export interface IModel {
  readonly _n: string;
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
