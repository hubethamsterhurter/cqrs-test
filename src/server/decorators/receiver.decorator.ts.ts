// import { ClassLogger } from "../../shared/helpers/class-logger.helper";

// const _log = new ClassLogger('Receiver');


// export function Receiver(): ClassDecorator {
//   const ReceiverFn = function ReceiverFn<T extends { new(...args: any[]): {}}>(Ctor: T) {
//     const original = Ctor;

//     const modified = function (this: Function, ...args: any[]) {
//       _log.info(`Binding receiver metadata to ${original.name}`);
//       return original.apply(this, args);
//     }

//     modified.prototype = original.prototype;

//     return modified;
//   }

//   return ReceiverFn;
// }

// https://rbuckton.github.io/reflect-metadata/#reflection
function Receiver(): ClassDecorator {
  return function ReceiverFn(Ctor: Function) {
    const original = Ctor;

    const modified = new Proxy(Ctor, {
      construct(klass, args) {
        console.log(`constructing ${Ctor.name}`);
        console.log(original);
        console.log(klass);
        console.log(args);
        const instance = Reflect.construct(klass, args);
        Reflect.defineMetadata(klass, )
        return instance;
      },
    });

    // const modified = function (this: Function, ...args: any[]) {
    //   console.log(`Binding receiver metadata to ${original.name}`);
    //   console.log(original);
    //   // return original.call(this, ...args);
    //   return new (original as any)(...args);// (original.apply(this, args));
    // }
    // modified.prototype = original.prototype;

    return modified;
  } as any
}

@Receiver()
class Test {
  static hello = 'hi'

}

const t = new Test();

console.log(t, t.constructor, t.constructor.name, t.constructor.hello);