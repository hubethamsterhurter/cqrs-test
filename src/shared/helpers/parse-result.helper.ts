import { ValidationError } from "class-validator";
import { ClassType } from "class-transformer/ClassTransformer";
import { Has_u } from "../types/has-_d.type";
import { LogConstruction } from "../decorators/log-construction.decorator";
import { Trace } from "./Tracking.helper";

export interface ParseSuccessPayload<C extends ClassType<any>> {
  readonly status: 'success',
  readonly instance: InstanceType<C>,
  readonly Ctor: C,
}
export interface ParseInvalidPayload<C extends ClassType<any>> {
  readonly status: 'invalid',
  readonly _o: null | Trace,
  readonly errs: ValidationError[],
  readonly Ctor: C,
};
export interface ParseMalformedPayload {
  readonly status: 'malformed',
  readonly err: Error
}

export type AParsePayload<C extends ClassType<any>> =
  | ParseSuccessPayload<C>
  | ParseInvalidPayload<C>
  | ParseMalformedPayload;

@LogConstruction()
export class ParseResult<C extends ClassType<any>> implements Has_u<AParsePayload<C>> {
  /**
   * @constructor
   *
   * @param _u
   */
  constructor(readonly _u: AParsePayload<C>) {}


  /**
   * @description
   * Was the message successfully parsed & validated?
   *
   * @param parseResponse 
   */
  success(): this is Has_u<ParseSuccessPayload<C>> { return this._u.status === 'success'; }

  /**
   * @description
   * Was the message invalid?
   *
   * @param parseResponse 
   */
  invalid(): this is Has_u<ParseInvalidPayload<C>> { return this._u.status === 'invalid'; }

  /**
   * @description
   * Was the message malformed?
   *
   * @param parseResponse 
   */
  malformed<M>(): this is Has_u<ParseMalformedPayload> { return this._u.status === 'malformed'; }
}
