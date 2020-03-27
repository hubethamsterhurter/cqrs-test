import { HasId } from "../types/has-id.type";

export interface ModelType extends HasId {
  updated_at: Date;
  created_at: Date;
  deleted_at: Date | null;
}