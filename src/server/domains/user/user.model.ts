import { ObjectType, Field } from 'type-graphql';
import { A_USER_COLOUR } from '../../../shared/constants/user-colour';
import { BaseModel, IBaseModelAttributes } from '../../base/base.model';
import { Column, Entity, Index } from 'typeorm';
import { USER_DEFN } from '../../../shared/domains/user/user.definition';
import { ICreateable } from '../../../shared/interfaces/interface.createable';
import { IUpdateable } from '../../../shared/interfaces/interface.updateable';
import { ISoftDeleteable } from '../../../shared/interfaces/interface.soft-deleteable';
import { SoftDeleteable } from '../../../mixins/soft-deleteable.mixin';
import { Updateable } from '../../../mixins/updateable.mixin';
import { Createable } from '../../../mixins/createable.mixin';

export interface IUserAttributes extends IBaseModelAttributes, ICreateable, IUpdateable, ISoftDeleteable {
  name: string;
  password: string;
  colour: A_USER_COLOUR;
}


@ObjectType()
@Entity(USER_DEFN.__table__)
export class UserModel extends SoftDeleteable(Updateable(Createable(BaseModel.mixable()))) implements IUserAttributes {
  @Field(() => String)
  @Index({ unique: true })
  @Column({ type: 'string', length: USER_DEFN.name.maxLen })
  name!: string;

  @Field(() => String)
  @Column({ type: 'string' })
  password!: string;

  // TODO: enum
  @Field(() => String)
  @Column({ type: 'varchar', length: 50 })
  colour!: A_USER_COLOUR;
}
