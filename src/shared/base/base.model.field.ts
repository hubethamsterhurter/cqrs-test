import { BaseModel } from "./base.model";

export const BASE_MODEL_FIELD: {[K in keyof BaseModel]: K} = {
  _n: '_n',
  created_at: 'created_at',
  created_by_id: 'created_by_id',
  deleted_at: 'deleted_at',
  deleted_by_id: 'deleted_by_id',
  id: 'id',
  updated_at: 'updated_at',
  updated_by_id: 'updated_by_id',
}
export type BASE_MODEL_FIELD = typeof BASE_MODEL_FIELD;
export type A_BASE_MODEL_FIELD = BASE_MODEL_FIELD[keyof BASE_MODEL_FIELD];