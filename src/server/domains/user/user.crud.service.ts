import { UserModel, IUserAttributes } from "./user.model";
import { BaseCrudService } from "../../base/base.crud.service";
import { Service } from "typedi";

@Service()
export class UserCrudService extends BaseCrudService<IUserAttributes, UserModel>(UserModel) {}
