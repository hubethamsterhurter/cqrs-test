import * as tEi from 'fp-ts/lib/TaskEither';
import { A_HTTP_CODE, HTTP_CODE } from "../../shared/constants/http-code.constant";
import { TaskEither } from "fp-ts/lib/TaskEither";
import { BaseLangString } from '../lang/interface.lang-string';
import { UnknownLang } from '../lang/strings/unknown.lang';

export class FailResult {
  readonly message: BaseLangString;
  readonly code: A_HTTP_CODE;
  readonly error?: Error;

  /**
   * @description
   * Try-catch async fn
   *
   * @param fn
   */
  static tEitherTryCatch<R>(fn: () => Promise<R>): TaskEither<FailResult, R> {
    return tEi.tryCatch(fn, FailResult.fromUnknown);
  }

  /**
   * @description
   * Create from an unknown input
   *
   * @param unknown
   */
  static fromUnknown(unknown: unknown): FailResult {
    let msg: BaseLangString;
    let error: Error;
    if (typeof unknown === 'string') {
      msg = new UnknownLang({ unknown: unknown });
      error = new Error(unknown);
    } else if (unknown instanceof Error) {
      msg = new UnknownLang({ unknown: unknown.message });
      error = unknown;
    } else {
      msg = new UnknownLang({ unknown: String(unknown) });
      error = new Error(String(unknown));
    }
    return new FailResult({
      message: msg,
      code: HTTP_CODE._500,
      error
    });
  }

  /**
   * @constructor
   *
   * @param arg
   */
  constructor(arg: {
    readonly message: BaseLangString,
    readonly code: A_HTTP_CODE,
    readonly error: Error | undefined,
  }) {
    this.message = arg.message;
    this.code = arg.code;
    this.error = arg.error;
  }
}
