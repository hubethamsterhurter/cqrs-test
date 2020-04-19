import { BaseModel, IBaseModelAttributes } from '../../base/base.model';
import { ObjectType, Field } from 'type-graphql';
import { Entity, Column } from 'typeorm';
import { CHAT_DEFN } from '../../../shared/domains/chat/chat.definition';
import { ICreateable } from '../../../shared/interfaces/interface.createable';
import { IUpdateable } from '../../../shared/interfaces/interface.updateable';
import { ISoftDeleteable } from '../../../shared/interfaces/interface.soft-deleteable';
import { SoftDeleteable } from '../../../mixins/soft-deleteable.mixin';
import { Updateable } from '../../../mixins/updateable.mixin';
import { Createable } from '../../../mixins/createable.mixin';

export interface IChatAttributes extends IBaseModelAttributes, ICreateable, IUpdateable, ISoftDeleteable {
  author_id: string | null;
  content: string;
  sent_at: Date;
}

@ObjectType()
@Entity(CHAT_DEFN.__table__)
export class ChatModel extends SoftDeleteable(Updateable(Createable(BaseModel.mixable()))) implements IChatAttributes {
  @Field(() => String, { nullable: true })
  @Column({ type: 'uuid', nullable: true })
  author_id!: string | null;

  @Field(() => String)
  @Column({ type: 'varchar', length: CHAT_DEFN.content.maxLen })
  content!: string;

  @Field(() => Date)
  @Column({ type: 'datetime', })
  sent_at!: Date;
}
