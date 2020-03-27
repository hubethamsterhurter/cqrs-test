import { MessageType, MessageCtorType } from "../types/message.type";
import { ClassLogger } from "./class-logger.helper";

export type MessageRegistry<L1, L2, M extends MessageType<L1, L2>> = Map<L1, Map<L2, MessageCtorType<M>>>;

/** @description * Create a message registry */
export function createMessageRegistry<L1, L2, M extends MessageType<L1, L2>>(): MessageRegistry<L1, L2, M> {
  return new Map();
}

const _log = new ClassLogger(registerMessage);

/**
 * @description
 * Register a message
 * 
 * @param Ctor
 */
export function registerMessage<L1, L2, M extends MessageType<L1, L2>>(
  registry: MessageRegistry<L1, L2, M>,
  Ctor: MessageCtorType<M>
) {
  _log.info('Registering message', Ctor.name);

  // find or create _v registry
  const vRegMatch = registry.get(Ctor._v);
  if (!vRegMatch) { _log.info(`Creating registry for _v "${Ctor._v}"`); }
  const vReg: NonNullable<typeof vRegMatch> = vRegMatch || new Map();
  registry.set(Ctor._v, vReg);

  // register _t for the _v if it doesn't already exist
  const tRegMatch = vReg.get(Ctor._t);
  if (tRegMatch) { throw new TypeError(`Already registered message for _v::_t "${Ctor._v}::${Ctor._t}"`); }
  vReg.set(Ctor._t, Ctor);
}