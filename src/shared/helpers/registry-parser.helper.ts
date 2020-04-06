import { validateSync } from "class-validator";
import { plainToClass } from 'class-transformer';
import { $DANGER } from "../types/danger.type";
import { ParseResult, ParseInvalidPayload, ParseSuccessPayload } from "./parse-result.helper";
import { LogConstruction } from "../decorators/log-construction.decorator";
import { $FIX_ME } from "../types/fix-me.type";
import { HasTrace } from "../types/has-_o.type";
import { Trace } from "./Tracking.helper";
import { Logger } from "./class-logger.helper";
import { Service } from "typedi";
import { Constructor } from "../types/constructor.type";
import { Has_n } from "../types/has-_n.type";

@Service({ global: true })
@LogConstruction()
export abstract class RegistryParser<T extends Has_n & HasTrace> {
  private _log = new Logger(this);

  /**
   * @constructor
   *
   * @param registry
   */
  constructor(readonly registry: { get(arg: string): Constructor<T> | undefined, add(arg: Constructor<T>): void; }) {}

  /**
   * @description
   * Parse a message from a string
   * 
   * @param data 
   */
  fromString(data: string): ParseResult<T> {
    let json: {};

    // JSON parse
    try {
      json = JSON.parse(data);
    } catch (err) {
      return new ParseResult({ status: 'malformed', err: new Error('Failed to parse as json.') });
    }

    // custom parse
    try {
      return this._parse(json);
    } catch (err) {
      this._log.error('Failed to parse json', err);
      return new ParseResult({ status: 'malformed', err: new Error('Failed to parse message json.') });
    }
  }


  /**
   * @description
   * Parse a message
   *
   * @param rawJson 
   */
  private _parse(rawJson: Record<string | number, any>): ParseResult<T> {
    if (typeof rawJson !== 'object' || rawJson === null) {
      return new ParseResult({
        status: 'malformed',
        err: new Error(`Failed to parse message. Message must be non-null object.`),
      });
    }

    const _n = rawJson._n as $DANGER<T>['_n'];
    if (typeof _n !== 'string') {
      return new ParseResult({
        status: 'malformed',
        err: new Error(`Failed to parse message. _n must be a string.`),
      });
    }

    const Ctor = this.registry.get(_n);

    if (!(Ctor)) {
      this._log.warn(`Unhandled message ${_n}`);
      return new ParseResult({
        status: 'unhandled',
        raw: rawJson,
      });
    }

    const instance = plainToClass(Ctor, rawJson) as $FIX_ME<T>;
    const validationErrors = validateSync(instance);

    if (validationErrors.length) {
      // recover the trace if possible
      const trace = rawJson.trace as $DANGER<T>['trace'];
      const recoveredTrace = plainToClass(Trace, trace);
      const traceValidationErrors = validateSync(recoveredTrace);

      if (traceValidationErrors.length) this._log.warn('Unable to recover trace from message', traceValidationErrors);
      // try to parse the Trace independently

      const payload: ParseInvalidPayload<T> = {
        status: 'invalid',
        errs: validationErrors,
        Ctor: Ctor,
        trace: traceValidationErrors.length === 0 ? recoveredTrace : null,
      }

      return new ParseResult(payload);
    }

    const payload: ParseSuccessPayload<T> = {
      status: 'success',
      instance,
      Ctor,
    };
    return new ParseResult(payload);
  }
}
