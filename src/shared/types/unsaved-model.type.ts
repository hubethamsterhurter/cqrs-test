import { ModelType } from "../domains/model.type";

export type UnsavedModel<M extends ModelType> = Omit<M, 'id' | 'updated_at' | 'created_at' | 'deleted_at'>