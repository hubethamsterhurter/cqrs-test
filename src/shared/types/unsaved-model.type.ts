import { IModel } from "../interfaces/interface.model";

export type UnsavedModel<M extends IModel> = Omit<M,
  'id'
  | '_n'
  | 'updated_at'
  | 'created_at'
  | 'deleted_at'
  | 'updated_by_id'
  | 'created_by_id'
  | 'deleted_by_id'
  | 'description'
>