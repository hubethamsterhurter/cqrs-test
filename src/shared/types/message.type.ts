import { ClassType } from "class-transformer/ClassTransformer";
import { Has_t } from "./has-_t.type";
import { HasTrace } from "./has-_o.type";

export interface MessageType<T> extends Has_t<T>, HasTrace {}
export interface MessageCtorType<T> extends ClassType<MessageType<T>>, Has_t<T> {}
