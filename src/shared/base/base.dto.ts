import { IAuditAttributes } from "../interfaces/interface.audit-attributes.type";

export abstract class BaseViewable implements IAuditAttributes {
  readonly created_at!: IAuditAttributes['created_at']
  readonly created_by_id!: IAuditAttributes['created_by_id']
  readonly deleted_at!: IAuditAttributes['deleted_at']
  readonly deleted_by_id!: IAuditAttributes['deleted_by_id']
  readonly id!: IAuditAttributes['id']
  readonly updated_at!: IAuditAttributes['updated_at']
  readonly updated_by_id!: IAuditAttributes['updated_by_id']
}
