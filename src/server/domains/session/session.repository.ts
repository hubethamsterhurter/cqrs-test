import { EntityRepository, Repository } from "typeorm";
import { SessionModel } from "./session.model";

@EntityRepository(SessionModel)
export class SessionRepository extends Repository<SessionModel> {}
