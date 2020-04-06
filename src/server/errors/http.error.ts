import { A_HTTP_CODE } from "../../shared/constants/http-code.constant";

export class ServerError extends Error {
  get http_code() { return this.#http_code; }
  #http_code: A_HTTP_CODE;

  /**
   * @constructor
   * A HTTP error
   *
   * @param code
   * @param message
   */
  constructor(code: A_HTTP_CODE, message: string) {
    super(message);
    this.#http_code = code;
  }
}