import { Constructor } from "../shared/types/constructor.type";
import { Field, ObjectType } from "type-graphql";
import { UpdateDateColumn } from "typeorm";
import { IUpdateable } from "../shared/interfaces/interface.updateable";

export function Updateable<C extends Constructor>(Root: C) {
  @ObjectType({ isAbstract: true })
  abstract class UpdateableMixin extends Root implements IUpdateable {
    @Field(() => Date) @UpdateDateColumn() readonly updated_at!: Date;
  }

  return UpdateableMixin;
}