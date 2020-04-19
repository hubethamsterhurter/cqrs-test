export {}
// import * as tEi from 'fp-ts/lib/TaskEither';
// import * as ei from 'fp-ts/lib/Either';
// import { UserCrudService } from "../user.crud.service";
// import { UserRepository } from "../user.repository";
// import { Logger } from "../../../../shared/helpers/class-logger.helper";
// import { IUseCase } from "../../../util/interface.user-case";
// import { UserModel } from "../user.model";
// import { CreateUserCommand } from "../../../../shared/domains/user/command.create-user";
// import { FailResult } from '../../../util/fail-result';
// import { HTTP_CODE } from '../../../../shared/constants/http-code.constant';
// import { CannotActionModelLang } from '../../../lang/strings/cannot-action-model.lang';
// import { ActionCreateLang } from '../../../lang/strings/action.create.lang';
// import { UserLang } from '../../../lang/strings/user.lang';
// import { USER_COLOUR } from '../../../../shared/constants/user-colour';

// export class CreateUserUseCase implements IUseCase<UserModel> {
//   #log = new Logger(this);


//   /**
//    * @constructor
//    * 
//    * @param _userCrudService
//    * @param _userRepo
//    */
//   constructor(
//     private readonly _userCrudService: UserCrudService,
//     private readonly _userRepo: UserRepository,
//     private readonly _command: CreateUserCommand,
//   ) {}


//   /**
//    * @inheritdoc
//    */
//   program(hooks: {
//     //
//   }): tEi.TaskEither<FailResult, UserModel> { return async (): Promise<ei.Either<FailResult, UserModel>> => {
//     try {
//       const matchingUser = await this
//         ._userRepo
//         .findOne({
//           where: { name: this._command.name },
//           withDeleted: true
//         });

//       if (!matchingUser) {
//         return ei.left(new FailResult({
//           code: HTTP_CODE._422,
//           error: undefined,
//           message: new CannotActionModelLang({
//             action: new ActionCreateLang({}),
//             model: new UserLang({}),
//             name: this._command.name,
//           }),
//         }));
//       }

//       const savedUser = await this
//         ._userRepo
//         .manager
//         .transaction(async (transaction) => {
//           const user = await this._userCrudService.create({
//             fill: {
//               name: this._command.name,
//               colour: this._command.colour ?? USER_COLOUR.BLACK,
//               password: this._command.password,
//             },
//             transaction,
//           });
//           await transaction.release();
//           return user;
//         });

//       return tEi.right(savedUser);
//     } catch (err) {
//       return tEi.left(FailResult.fromUnknown(err))
//     }
//   } }
// }
