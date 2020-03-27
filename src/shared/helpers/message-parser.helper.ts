import ws from 'ws';
import { MessageType } from "../types/message.type";
import { ValidationError, validateSync } from "class-validator";
import { plainToClass } from 'class-transformer';
import { $FIX_ME } from '../types/fix-me.type';
import { MessageRegistry } from './message-registry.helper';
import { ClassType } from 'class-transformer/ClassTransformer';

export interface MessageParseResponseSuccess<M extends MessageType<any, any>> { status: 'success', message: M, Ctor: ClassType<M>, }
export interface MessageParseResponseInvalid<M extends MessageType<any, any>> { status: 'invalid', errs: ValidationError[], Ctor: ClassType<M>, }
export interface MessageParseResponseMalformed { status: 'malformed', err: Error }

export type MessageParseResponse<M extends MessageType<any, any>> =
  | MessageParseResponseSuccess<M>
  | MessageParseResponseInvalid<M>
  | MessageParseResponseMalformed;

/**
 * @description
 * Was the message successfully parsed & validated?
 * 
 * @param parseResponse 
 */
export function isSuccessfulMessageParse<M extends MessageType<any, any>>(
  parseResponse: MessageParseResponse<M>,
): parseResponse is MessageParseResponseSuccess<M> {
  return parseResponse.status === 'success';
}

/**
 * @description
 * Was the message invalid?
 * 
 * @param parseResponse 
 */
export function isInvalidMessageParse<M extends MessageType<any, any>>(
  parseResponse: MessageParseResponse<M>
): parseResponse is MessageParseResponseInvalid<M> {
  return parseResponse.status === 'invalid';
}

/**
 * @description
 * Was the message malformed?
 * 
 * @param parseResponse 
 */
export function isMalformedMessageParse<M extends MessageType<any, any>>(
  parseResponse: MessageParseResponse<M>
): parseResponse is MessageParseResponseMalformed  {
  return parseResponse.status === 'malformed';
}



export class MessageParser<V, T, M extends MessageType<V, T>> {
  /**
   * @constructor
   *
   * @param _registry
   */
  constructor(
    private _registry: MessageRegistry<V, T, M>
  ) {}


  /**
   * @description
   * Parse a message from an object
   * 
   * @param data 
   */
  fromObj<U>(data: {}): U extends M ? MessageParseResponse<U> : MessageParseResponse<M> {
    return this._parse(data) as $FIX_ME<any>;
  }

  /**
   * @description
   * Parse a message from a string
   * 
   * @param data 
   */
  fromString(data: string): MessageParseResponse<M> {
    let json: {};
    try {
      json = JSON.parse(data);
    } catch (err) {
      return { status: 'malformed', err: new Error('Message failed to parse as json.') };
    }
    return this._parse(json);
  }


  /**
   * @description
   * Parse a message
   *
   * @param rawJson 
   */
  private _parse(rawJson: Record<string | number, any>): MessageParseResponse<M> {
    if (typeof rawJson !== 'object' || rawJson === null) {
      return { status: 'malformed', err: new Error(`Failed to parse message. Message must be non-null object.`) };
    }

    const _v = rawJson._v;
    if (!(typeof _v === 'string' || typeof _v === 'number')) {
      return { status: 'malformed', err: new Error(`Failed to parse message. _v must be a string or number.`) };
    }

    const _t = rawJson._t;
    if (!(typeof _t === 'string' || typeof _t === 'number')) {
      return { status: 'malformed', err: new Error(`Failed to parse message. _t must be a string or number.`) };
    }

    const MessageCtor = this
      ._registry
      .get(_v as $FIX_ME<any>)
      ?.get(_t as $FIX_ME<any>);

    if (!(MessageCtor)) {
      return { status: 'malformed', err: new Error(`Unable to find MessageCtor for _v: ${_v}, _t: ${_t}`) };
    }

    const message = plainToClass(MessageCtor, rawJson);
    const validationErrors = validateSync(message);

    if (validationErrors.length) { return { status: 'invalid', errs: validationErrors, Ctor: MessageCtor }; }
    return { status: 'success', message, Ctor: MessageCtor };
  }
}
