import { BaseMessage } from "../base/base.message";

function formatDateLog(date: Date) {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getMilliseconds().toString().padStart(3, '0').substr(0, 2)}`;
}

export class Logger {
  private _name: string;

  /**
   * @constructor
   *
   * @param inp
   */
  constructor(inp: string | Function | { constructor: Function }) {
    if (typeof inp === 'string') {
      this._name = inp;
    } else if (inp instanceof Function) {
      this._name = inp.name;
    } else {
      this._name = inp.constructor.name;
    }
  }

  info(...args: any[]) {
    console.log(`[${formatDateLog(new Date())}] ${this._name}:`, ...args);
  }

  warn(...args: any[]) {
    console.warn(`[${formatDateLog(new Date())}] ${this._name}:`, ...args);
  }

  error(...args: any[]) {
    console.error(`[${formatDateLog(new Date())}] ${this._name}:`, ...args);
  }

  message(message: BaseMessage) {
    this.info(`\t->\t SENDING MESSAGE \t -> \t ${message?._n?.padEnd(25, ' ')} \t -> \t ${message?.trace?.origin_id}`);
  }
}