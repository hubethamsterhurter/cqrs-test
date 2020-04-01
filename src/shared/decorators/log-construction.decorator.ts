import { Logger } from "../helpers/class-logger.helper";

const _log = new Logger(LogConstruction);

export function LogConstruction(): ClassDecorator {
  const LogConstructionDecorator: ClassDecorator = function LogConstructionDecorator(constructor: Function) {
    _log.info(`Constructing "${constructor.name}"`);
  }

  return LogConstructionDecorator;
}