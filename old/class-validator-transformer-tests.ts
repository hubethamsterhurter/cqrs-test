
import {
  plainToClass,
  Type,
} from 'class-transformer';
import {
  IsString,
  Equals,
  validateOrReject,
  validate,
  validateSync,
  ValidateIf,
  MaxLength,
  MinLength,
  ValidateNested,
  IsNumber,
  IsDefined,
  IsObject,
  IsArray,
  IsEmpty,
  IsIn,
} from 'class-validator';

import 'reflect-metadata';
import { CLIENT_MESSAGE_TYPE, A_CLIENT_MESSAGE_TYPE, IClientMsg } from "../src/shared/msg-client/msg-client-type";
import { MsgClientUserCreate } from "../src/shared/msg-client/msg.client.user.create";

// type $TS_TEMP<T> = T;

// console.log('hello :)');

// const CLIENT_MSG_TYPE = {
//   CREATE_USER: 'CreateUser',
// } as const;
// type CLIENT_MSG_TYPE = typeof CLIENT_MSG_TYPE;
// type A_CLIENT_MSG_TYPE = typeof CLIENT_MSG_TYPE[keyof CLIENT_MSG_TYPE];

// interface ClientSocketMsg<T extends A_CLIENT_MSG_TYPE> {
//   readonly _type: T;
// }

// class Nested {
//   @IsString() firstProp!: string;
//   @IsNumber() secondProp!: number;
// }

// // everything validates a expected except nested objects

// # Nested Objects:
//  1.  create a class for for the nested object
//  2.  propert validators must include:
//    2.1.  @IsObject()         -> ensures NOT array and IS object (& not null)
//    2.2   @ValidateNested()   -> not sure why this should be required... but seems to be required to traverse & validate nested instances
//    2.3   @Type(() => CTor)   -> transforms into decorated instance that can be validated by ClassValidator
//      @note: to validate as an array of objects, use @IsArray() instead of @IsObject()

// // # Null & Undefined
// //  - use @Equals(null), @Equals(undefined) <allows ?:> and @IsIn([null, undefined]) <allows ?:>

// class ClientMsgCreateUser implements ClientSocketMsg<CLIENT_MSG_TYPE['CREATE_USER']> {
//   get _type() { return CLIENT_MSG_TYPE.CREATE_USER }

//   @MinLength(4)
//   @MaxLength(10)
//   @IsString() username!: string;

//   // nested validation
//   // @IsObject()
//   @IsArray()
//   @ValidateNested()
//   @Type(() => Nested)
//   testnested!: Nested;

//   @IsIn([null, undefined]) nullOrUndefined?: null | undefined;
//   @Equals(null) null!: null;
//   @Equals(undefined) undefined: undefined;
// }

// const plainMsg: ClientMsgCreateUser = {
//   username: 'hiasdasda',
//   // testnested: null as any,
//   testnested: [{
//     firstProp: 'hi',
//     secondProp: 5,
//   }] as $TS_TEMP<any>,


//   // nullOrUndefined: undefined as any,
//   null: null as any,
//   // undefined: undefined as any,
// } as $TS_TEMP<ClientMsgCreateUser>;
// const msg: ClientMsgCreateUser = plainToClass(ClientMsgCreateUser, plainMsg);

// const result = validateSync(msg)
//   // .then(
//   //   function onResolve(res) { console.info('RES', res) },
//   //   function onReject(rej) { console.warn('REJ', rej) },
//   // )
//   // .catch((err) => console.error('ERR', err))
//   // .then((res) => console.log('completed :)...'));


// console.log(msg.constructor, msg._type, msg.username, msg.testnested, result);

// const rawMsg: MsgClientUserCreate = {
//   _type: CLIENT_MESSAGE_TYPE.USER_CREATE,
//   username: 'hiiii',
//   password: 'hiii',
// }
// const parsedMsg = plainToClass(MsgClientUserCreate, rawMsg);
// const validation = validateSync(parsedMsg);


// console.log(parsedMsg, validation);

// console.log('hi');