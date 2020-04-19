import * as tEi from 'fp-ts/lib/TaskEither';
import * as ei from 'fp-ts/lib/Either';
import { IBaseModelAttributes, BaseModel } from './base.model';
import { Repository, FindOneOptions } from "typeorm";
import { BaseLangString } from '../lang/interface.lang-string';
import { FailResult } from '../util/fail-result';
import { pipe } from 'fp-ts/lib/pipeable';
import { HTTP_CODE } from '../../shared/constants/http-code.constant';
import { FourZeroFourLang } from '../lang/strings/404.lang';
import { Constructor } from '../../shared/types/constructor.type';
import { ModelDeletedLang } from '../lang/strings/model-deleted.lang';
import { $DANGER } from '../../shared/types/danger.type';

export abstract class BaseRepository<A extends IBaseModelAttributes, M extends BaseModel & A> extends Repository<M> {
  protected abstract ModelCtor: Constructor<M>
  protected abstract modelLang: BaseLangString;


  /**
   * @description
   * Find a model by id, or return 404
   *
   * @param options
   */
  eitherFindOneAlive(options?: FindOneOptions<M>): tEi.TaskEither<FailResult, M> {
    const program: tEi.TaskEither<FailResult, M> = pipe(
      // find
      this.eitherFindOne(options),

      // deleted?
      tEi.chainEitherK(model => (model.isSoftDeleteable() && model.deleted_at !== null)
        ? ei.left(new FailResult({
          code: HTTP_CODE._422,
          error: undefined,
          message: new ModelDeletedLang({ model: this.modelLang, }),
        }))
        : ei.right(model),
      ),
    );
    return program;
  }



  /**
   * @description
   * Find a model by id, or return 404
   *
   * @param options
   */
  eitherFindOne(options?: FindOneOptions<M>): tEi.TaskEither<FailResult, M> {
    const program: tEi.TaskEither<FailResult, M> = pipe(
      // find
      tEi.tryCatch(
        () => this.findOne(options),
        FailResult.fromUnknown,
      ),

      // found?
      tEi.chainEitherK(model => (model === undefined)
        ? ei.left(new FailResult({
            code: HTTP_CODE._404,
            error: undefined,
            message: new FourZeroFourLang({
              // find a better way to lang this
              name: (options?.where as $DANGER<any>)?.id ?? 'unknown',
              type: this.modelLang,
            })
          }))
        : ei.right(model)
      )
    );
    return program;
  }
}