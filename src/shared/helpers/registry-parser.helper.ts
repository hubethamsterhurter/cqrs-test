import { validateSync } from "class-validator";
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { Registry } from "./registry.helper";
import { $DANGER } from "../types/danger.type";
import { Has_t } from "../types/has-_t.type";
import { ParseResult, ParseInvalidPayload, ParseSuccessPayload } from "./parse-result.helper";
import { LogConstruction } from "../decorators/log-construction.decorator";
import { $FIX_ME } from "../types/fix-me.type";
import { Has_o } from "../types/has-_o.type";
import { Trace } from "./Tracking.helper";
import { ClassLogger } from "./class-logger.helper";


@LogConstruction()
export abstract class RegistryParser<C extends ClassType<Has_t<PropertyKey> & Has_o> & Has_t<PropertyKey>> {
  _log = new ClassLogger(this);
  #registry: Registry<C, '_t'>;

  /**
   * @constructor
   *
   * @param registry
   */
  constructor(
    registry: Registry<C, '_t'>
  ) {
    this.#registry = registry;
  }


  // /**
  //  * @description
  //  * Parse a message from an object
  //  * 
  //  * @param data 
  //  */
  // fromObj<U>(data: {}): U extends MessageType<T> ? MessageParseResponse<U> : MessageParseResponse<T> {
  //   return this._parse(data) as $FIX_ME<any>;
  // }

  /**
   * @description
   * Parse a message from a string
   * 
   * @param data 
   */
  fromString(data: string): ParseResult<C> {
    let json: {};
    try {
      json = JSON.parse(data);
    } catch (err) {
      return new ParseResult({ status: 'malformed', err: new Error('Failed to parse as json.') });
    }
    return this._parse(json);
  }


  /**
   * @description
   * Parse a message
   *
   * @param rawJson 
   */
  private _parse(rawJson: Record<string | number, any>): ParseResult<C> {
    if (typeof rawJson !== 'object' || rawJson === null) {
      return new ParseResult({
        status: 'malformed',
        err: new Error(`Failed to parse message. Message must be non-null object.`),
      });
    }

    const _t = rawJson._t as $DANGER<InstanceType<C>>['_t'];
    if (!(typeof _t === 'string' || typeof _t === 'number')) {
      return new ParseResult({
        status: 'malformed',
        err: new Error(`Failed to parse message. _t must be a string or number.`),
      });
    }

    const Ctor = this.#registry.get(_t);

    if (!(Ctor)) {
      return new ParseResult({
        status: 'malformed',
        err: new Error(`Unable to find MessageCtor for _t: ${_t}`)
      });
    }

    const instance = plainToClass(Ctor, rawJson) as $FIX_ME<InstanceType<C>>;
    const validationErrors = validateSync(instance);

    if (validationErrors.length) {
      // recover the trace if possible
      const _o = rawJson._o as $DANGER<InstanceType<C>>['_o'];
      const recoveredTrace = plainToClass(Trace, _o);
      const traceValidationErrors = validateSync(recoveredTrace);

      this._log.warn('Unable to recover trace from message', traceValidationErrors);
      // try to parse the Trace independently

      const payload: ParseInvalidPayload<C> = {
        status: 'invalid',
        errs: validationErrors,
        Ctor: Ctor,
        _o: traceValidationErrors.length === 0 ? recoveredTrace : null,
      }

      return new ParseResult(payload);
    }

    const payload: ParseSuccessPayload<C> = {
      status: 'success',
      instance,
      Ctor,
    };
    return new ParseResult(payload);
  }
}
