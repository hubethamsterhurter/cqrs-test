import { Type } from 'class-transformer'
import { IsString, IsDate, IsOptional, } from 'class-validator';
import { BaseModel } from '../../base/base.model';
import { ObjectType, Field } from 'type-graphql';
import { Entity, Column } from 'typeorm';
import { IAuditAttributes } from '../../../shared/interfaces/interface.audit-attributes.type';

@ObjectType()
@Entity({ name: 'auth_tokens', orderBy: { created_at: 'DESC' } })
export class AuthTokenModel extends BaseModel {
  @Field(() => String) @Column({ type: 'uuid' }) @IsString() session_id!: string;
  @Field(() => String) @Column({ type: 'uuid' }) @IsString() user_id!: string;

  @Column({ type: 'datetime', nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expires_at!: Date | null;
}