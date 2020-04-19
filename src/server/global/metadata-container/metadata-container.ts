import { Service, Inject } from "typedi";
import { EventBus } from "../event-bus/event-bus";
import { EventStream } from "../event-stream/event-stream";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Logger } from "../../../shared/helpers/class-logger.helper";
import { Constructor } from '../../../shared/types/constructor.type';
import { IActionableMetadata } from './interface.actionable-metadata';


type PrototypeMetadata = Map<string | symbol, IActionableMetadata[]>;
type MethodMetadataRegistryValue = { Ctor: Constructor, prototypeMetadata: PrototypeMetadata }
type MethodMetadataRegistry = Map<Constructor, MethodMetadataRegistryValue>


let __created__ = false;
@Service({ global: true })
@LogConstruction()
export class MetadataContainer {
  #log = new Logger(this);
  #methodMetadataRegistry: MethodMetadataRegistry = new Map();



  /**
   * @constructor
   *
   * @param _eb
   * @param _es
   */
  constructor(
    @Inject(() => EventBus) private readonly _eb: EventBus,
    @Inject(() => EventStream) private readonly _es: EventStream,
  ) {
    if (__created__) throw new Error(`Can only create one instance of "${this.constructor.name}".`);
    __created__ = true;
  }


  /**
   * @description
   * Retrieve a method metadata registry value
   *
   * @param arg
   */
  get(arg: {
    Ctor: Constructor,
  }): MethodMetadataRegistryValue | undefined {
    return this.#methodMetadataRegistry.get(arg.Ctor);
  }



  /**
   * @description
   * Add method data
   *
   * @param arg
   */
  registerMethodMetadata(arg: {
    Ctor: Constructor,
    propertyKey: string | symbol,
    metadata: IActionableMetadata,
  }) {
    // find or create ctor registry
    const CtorRegistry: MethodMetadataRegistryValue = this.#methodMetadataRegistry.get(arg.Ctor) ?? { Ctor: arg.Ctor, prototypeMetadata: new Map() };
    
    // find or create and append to method metadata
    const metadataArr: IActionableMetadata[] = (CtorRegistry.prototypeMetadata.get(arg.propertyKey) ?? []).concat(arg.metadata);

    // reset to newly incremented metadata
    CtorRegistry.prototypeMetadata.set(arg.propertyKey, metadataArr);

    this.#methodMetadataRegistry.set(arg.Ctor, CtorRegistry);
  }
}

