import { Constructor } from "../shared/types/constructor.type";
import { Field, ObjectType } from "type-graphql";
import { CreateDateColumn } from "typeorm";
import { ICreateable } from "../shared/interfaces/interface.createable";

export function Createable<C extends Constructor>(Root: C) {
  @ObjectType({ isAbstract: true })
  abstract class CreateableMixin extends Root implements ICreateable {
    @Field(() => Date) @CreateDateColumn() readonly created_at!: Date;
  }

  return CreateableMixin;
}