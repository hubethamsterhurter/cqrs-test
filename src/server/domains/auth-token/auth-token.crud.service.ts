import { BaseCrudService } from "../../base/base.crud.service";
import { Service } from "typedi";
import { AuthTokenModel } from "./auth-token.model";

@Service()
export class AuthTokenCrudService extends BaseCrudService(AuthTokenModel) {}
