import { AuthTokenModel } from "./auth-token.model";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(AuthTokenModel)
export class AuthTokenRepository extends Repository<AuthTokenModel> {}
