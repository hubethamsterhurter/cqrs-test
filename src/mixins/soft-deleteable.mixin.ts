import { Constructor } from "../shared/types/constructor.type";
import { Field, ObjectType } from "type-graphql";
import { DeleteDateColumn } from "typeorm";
import { ISoftDeleteable } from "../shared/interfaces/interface.soft-deleteable";

export function SoftDeleteable<C extends Constructor>(Root: C) {
  @ObjectType({ isAbstract: true })
  abstract class SoftDeleteableMixin extends Root implements ISoftDeleteable {
    softDeleteable(): this is ISoftDeleteable { return true; }
    isDeleted() { return this.deleted_at !== null; }

    @Field(() => Date) @DeleteDateColumn() readonly deleted_at!: Date | null;
  }

  return SoftDeleteableMixin;
}