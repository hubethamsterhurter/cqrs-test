import { ClassType } from "class-transformer/ClassTransformer";
import { Has_t } from "./has-_t.type";
import { Has_o } from "./has-_o.type";

export interface MessageType<T> extends Has_t<T>, Has_o {}
export interface MessageCtorType<T> extends ClassType<MessageType<T>>, Has_t<T> {}
