import { DeepPartial } from "typeorm";
import { HasId } from "./has-id.type";
import { ISoftDeleteable } from "../interfaces/interface.soft-deleteable";
import { ICreateable } from "../interfaces/interface.createable";
import { IUpdateable } from "../interfaces/interface.updateable";

export type UnsavedModel<A extends HasId> =
  & Omit<A, 'id' | keyof ICreateable | keyof IUpdateable | keyof ISoftDeleteable>
  & DeepPartial<Pick<A, 'id'>>