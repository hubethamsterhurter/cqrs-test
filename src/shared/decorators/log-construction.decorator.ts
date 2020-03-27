import { ClassLogger } from "../helpers/class-logger.helper";

const _log = new ClassLogger(LogConstruction);

export function LogConstruction() {
  return function doLogConstruction(constructor: Function) {
    _log.info(`Constructing "${constructor.name}"`);
  }
}