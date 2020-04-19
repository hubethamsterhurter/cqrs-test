import {
  ObjectType, Field, ID,
} from 'type-graphql';
import {
  PrimaryGeneratedColumn,
} from 'typeorm';
import { HasId } from '../../shared/types/has-id.type';
import { Constructor } from '../../shared/types/constructor.type';
import { $DANGER } from '../../shared/types/danger.type';
import { ISoftDeleteable } from '../../shared/interfaces/interface.soft-deleteable';

export interface IBaseModelAttributes extends HasId {}

@ObjectType({ isAbstract: true })
export abstract class BaseModel implements IBaseModelAttributes {
  /**
   * @description
   * Allow abstract class to be used in mixins
   *
   * Typescript removes the new() signature from "abstract" classes, but
   * ts / js mixins require a new signatures to recognise the extended function
   * as a class
   *
   * This fucntion is a work-around to tell mixins that this is legal
   * 
   */
  static mixable(): Constructor<BaseModel> { return BaseModel as unknown as $DANGER<Constructor<BaseModel>>; }

  // overridable
  /**
   * @description
   * Can the model be soft deleted?
   */
  isSoftDeleteable(): this is ISoftDeleteable { return false; }

  @Field(() => ID) @PrimaryGeneratedColumn({ type: 'uuid' }) readonly id!: string;
  // @Field(() => Date) @CreateDateColumn() readonly created_at!: Date;
  // @Field(() => Date) @UpdateDateColumn() readonly updated_at!: Date;
  // @Field(() => Date) @DeleteDateColumn() readonly deleted_at!: Date | null;

  // @Field(() => String) @Column({ type: 'uuid', nullable: true }) readonly created_by_id!: string | null;
  // @Field(() => String) @Column({ type: 'uuid', nullable: true }) readonly updated_by_id!: string | null;
  // @Field(() => String) @Column({ type: 'uuid', nullable: true }) readonly deleted_by_id!: string | null;

  // @ManyToOne(() => UserModel, { lazy: true, nullable: true })
  // @JoinColumn({ name: 'created_by_id' })
  // creator: MaybePromise<UserModel | null> = null;

  // @ManyToOne(() => UserModel, { lazy: true, nullable: true })
  // @JoinColumn({ name: 'updated_by_id' })
  // updater: MaybePromise<UserModel | null> = null;

  // @ManyToOne(() => UserModel, { lazy: true, nullable: true })
  // @JoinColumn({ name: 'deleted_by_id' })
  // deleter: MaybePromise<UserModel | null> = null;
}
