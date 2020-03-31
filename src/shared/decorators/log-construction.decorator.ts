import { Logger } from "../helpers/class-logger.helper";

const _log = new Logger(LogConstruction);

export function LogConstruction() {
  return function doLogConstruction(constructor: Function) {
    _log.info(`Constructing "${constructor.name}"`);
  }
}