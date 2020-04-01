import { validateSync } from "class-validator";
import { plainToClass } from 'class-transformer';
import { ClassType } from 'class-transformer/ClassTransformer';
import { $DANGER } from "../types/danger.type";
import { ParseResult, ParseInvalidPayload, ParseSuccessPayload } from "./parse-result.helper";
import { LogConstruction } from "../decorators/log-construction.decorator";
import { $FIX_ME } from "../types/fix-me.type";
import { HasTrace } from "../types/has-_o.type";
import { Trace } from "./Tracking.helper";
import { Logger } from "./class-logger.helper";
import { Service } from "typedi";


@Service({ global: true })
@LogConstruction()
export abstract class RegistryParser<C extends ClassType<{ _n: string } & HasTrace>> {
  private _log = new Logger(this);
  // #registry: Registry<string, C>;
  #registry: Map<string, C>;

  /**
   * @constructor
   *
   * @param registry
   */
  constructor(
    registry: Map<string, C>
  ) {
    this.#registry = registry;
  }

  /**
   * @description
   * Register a new constructor
   *
   * @param Ctor
   */
  register(Ctor: C) {
    this.#registry.set(Ctor.name, Ctor);
  }

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

    const _n = rawJson._n as $DANGER<InstanceType<C>>['_n'];
    if (typeof _n !== 'string') {
      return new ParseResult({
        status: 'malformed',
        err: new Error(`Failed to parse message. _n must be a string.`),
      });
    }

    const Ctor = this.#registry.get(_n);

    if (!(Ctor)) {
      return new ParseResult({
        status: 'malformed',
        err: new Error(`Unhandled message "${_n}".`)
      });
    }

    const instance = plainToClass(Ctor, rawJson) as $FIX_ME<InstanceType<C>>;
    const validationErrors = validateSync(instance);

    if (validationErrors.length) {
      // recover the trace if possible
      const trace = rawJson.trace as $DANGER<InstanceType<C>>['trace'];
      const recoveredTrace = plainToClass(Trace, trace);
      const traceValidationErrors = validateSync(recoveredTrace);

      if (traceValidationErrors.length) this._log.warn('Unable to recover trace from message', traceValidationErrors);
      // try to parse the Trace independently

      const payload: ParseInvalidPayload<C> = {
        status: 'invalid',
        errs: validationErrors,
        Ctor: Ctor,
        trace: traceValidationErrors.length === 0 ? recoveredTrace : null,
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
