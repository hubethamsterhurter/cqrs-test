import { ValidationError } from "class-validator";
import { Has_u } from "../types/has-_u.type";
import { LogConstruction } from "../decorators/log-construction.decorator";
import { Trace } from "./Tracking.helper";
import { Constructor } from "../types/constructor.type";
import { $FIX_ME } from "../types/fix-me.type";

export interface ParseSuccessPayload<T> {
  readonly status: 'success',
  readonly instance: T,
  readonly Ctor: Constructor<T>,
}
export interface ParseInvalidPayload<T> {
  readonly status: 'invalid',
  readonly trace: null | Trace,
  readonly errs: ValidationError[],
  readonly Ctor: Constructor<T>,
};
export interface ParseMalformedPayload {
  readonly status: 'malformed',
  readonly err: Error
}
export interface ParseUnhandledPayload {
  readonly status: 'unhandled',
  readonly raw: unknown,
}

export type AParsePayload<T> =
  | ParseSuccessPayload<T>
  | ParseInvalidPayload<T>
  | ParseMalformedPayload
  | ParseUnhandledPayload;

@LogConstruction()
export class ParseResult<T> implements Has_u<AParsePayload<T>> {
  /**
   * @constructor
   *
   * @param _u
   */
  constructor(readonly _u: AParsePayload<T>) {}


  /**
   * @description
   * Was the message successfully parsed & validated?
   *
   * @param parseResponse 
   */
  success(): this is Has_u<ParseSuccessPayload<T>> { return this._u.status === 'success'; }

  /**
   * @description
   * Was a message successfully parsed & validated?
   * 
   * @param message
   */
  static success<U>(parse: ParseResult<U>): parse is ParseResult<U> & Has_u<ParseSuccessPayload<U>> { return (parse).success() }

  /**
   * @description
   * Was the message invalid?
   *
   * @param parseResponse 
   */
  invalid(): this is Has_u<ParseInvalidPayload<T>> { return this._u.status === 'invalid'; }

  /**
   * @description
   * Was the message invalid?
   * 
   * @param message
   */
  static invalid<U>(parse: ParseResult<U>): parse is ParseResult<U> & Has_u<ParseInvalidPayload<U>> { return (parse).invalid() }

  /**
   * @description
   * Was the message unhandled / not found?
   *
   * @param parseResponse 
   */
  unhandled(): this is Has_u<ParseUnhandledPayload> { return this._u.status === 'unhandled'; }

  /**
   * @description
   * Was the message invalid?
   * 
   * @param message
   */
  static unhandled<U>(parse: ParseResult<U>): parse is ParseResult<U> & Has_u<ParseUnhandledPayload> { return (parse).unhandled() }

  /**
   * @description
   * Was the message malformed?
   *
   * @param parseResponse 
   */
  malformed(): this is Has_u<ParseMalformedPayload> { return this._u.status === 'malformed'; }

  /**
   * @description
   * Was the message malformed?
   * 
   * @param message
   */
  static malformed<U>(parse: ParseResult<U>): parse is ParseResult<U> & Has_u<ParseMalformedPayload> { return (parse).malformed() }
}
