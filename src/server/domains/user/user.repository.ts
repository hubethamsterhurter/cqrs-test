import { EntityRepository } from "typeorm";
import { UserModel, IUserAttributes } from "./user.model";
import { BaseRepository } from "../../base/base.repository";
import { Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { UserLang } from "../../lang/strings/model.user.lang";

@EntityRepository(UserModel)
@Service()
@LogConstruction()
export class UserRepository extends BaseRepository<IUserAttributes, UserModel> {
  protected ModelCtor = UserModel;
  protected modelLang = new UserLang({});
}
