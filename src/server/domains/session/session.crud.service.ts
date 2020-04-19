import { BaseCrudService } from "../../base/base.crud.service";
import { Service } from "typedi";
import { SessionModel } from "./session.model";

@Service()
export class SessionCrudService extends BaseCrudService(SessionModel) {}
