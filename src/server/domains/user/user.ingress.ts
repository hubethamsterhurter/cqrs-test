// import * as currably from 'fp-ts/lib/'
import * as tEi from 'fp-ts/lib/TaskEither';
import * as ei from 'fp-ts/lib/Either';
import { Inject, Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { UserRepository } from '../user/user.repository';
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { UserCrudService } from './user.crud.service';
import { CreateUserCommand } from "../../../shared/domains/user/command.create-user";
import { UpdateUserCommand } from "../../../shared/domains/user/command.update-user";
import { HTTP_CODE } from "../../../shared/constants/http-code.constant";
import { UserModel } from "./user.model";
import { FailResult } from '../../util/fail-result';
import { CannotActionModelLang } from '../../lang/strings/cannot-action-model.lang';
import { CreateLang } from '../../lang/strings/action.create.lang';
import { UserLang } from '../../lang/strings/model.user.lang';
import { USER_COLOUR } from '../../../shared/constants/user-colour';
import { UpdateLang } from '../../lang/strings/action.update.lang';
import { AlreadyExistsLang } from '../../lang/strings/reason.already-exists.lang';



@Service()
@LogConstruction()
export class UserIngress {
  #log = new Logger(this);


  /**
   * @constructor
   * 
   * @param _userCrudService
   * @param _userRepo
   */
  constructor(
    @Inject(() => UserCrudService) private readonly _userCrudService: UserCrudService,
    @Inject(() => UserRepository) private readonly _userRepo: UserRepository,
  ) {}


  /**
   * @description
   * Create a user
   *
   * @param dto
   */
  create(arg: { dto: CreateUserCommand }): tEi.TaskEither<FailResult, UserModel> {
    return async (): Promise<ei.Either<FailResult, UserModel>> => {
      try {
        const matchingUser = await this
          ._userRepo
          .findOne({
            where: { name: arg.dto.name },
            withDeleted: true
          });

        if (matchingUser) {
          return ei.left(new FailResult({
            code: HTTP_CODE._422,
            error: undefined,
            message: new CannotActionModelLang({
              action: new CreateLang({}),
              model: new UserLang({}),
              name: arg.dto.name,
              reason: new AlreadyExistsLang({}),
            }),
          }));
        }


        const savedUser: UserModel = await this
          ._userRepo
          .manager
          .transaction(async (transaction) => {
            const user = await this
              ._userCrudService
              .create({
                fill: {
                  name: arg.dto.name,
                  colour: arg.dto.colour ?? USER_COLOUR.BLACK,
                  password: arg.dto.password,
                },
                transaction,
              });
            await transaction.release();
            return user;
          });

        return ei.right(savedUser);
      } catch (err) {
        return ei.left(FailResult.fromUnknown(err))
      }
    }
  }


  /**
   * @description
   * Update a user
   * 
   * @param dto
   */
  update(arg: { dto: UpdateUserCommand }): tEi.TaskEither<FailResult, UserModel> {
    return async (): Promise<ei.Either<FailResult, UserModel>> => {
      try {
        const userEither = await this
          ._userRepo
          .eitherFindOneAlive(
            { where: { id: arg.dto.id },
            withDeleted: true
          })();

        if (ei.isLeft(userEither)) return userEither;
        const user = userEither.right;

        const isChangingName = typeof arg.dto.name === 'string'
          ? arg.dto.name !== user.name
          : false;

        // non-unique name
        if (isChangingName) {
          const matchingNameUser = await this
            ._userRepo
            .findOne({
              where: { name: arg.dto.name },
              withDeleted: true,
            });

          if (matchingNameUser?.name === arg.dto.name) {
            return ei.left(new FailResult({
              code: HTTP_CODE._422,
              error: undefined,
              message: new CannotActionModelLang({
                action: new UpdateLang({}),
                model: new UserLang({}),
                name: arg.dto.name!,
                reason: new AlreadyExistsLang({}),
              })
            }));
          }
        }

        // todo immutable
        if (arg.dto.name) user.name = arg.dto.name;
        if (arg.dto.password) user.password = arg.dto.password;
        if (arg.dto.colour) user.colour = arg.dto.colour;

        const savedUser: UserModel = await this
          ._userRepo
          .manager
          .transaction(async (transaction) => {
            const updatedUser = await this
              ._userCrudService
              .update({
                model: user,
                transaction,
              });
            await transaction.release();
            return updatedUser;
          });

        return ei.right(savedUser);
      } catch (err) {
        return ei.left(FailResult.fromUnknown(err))
      }
    }
  }
}