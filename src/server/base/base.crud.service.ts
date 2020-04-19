// import * as tEi from 'fp-ts/lib/TaskEither';
import { Logger } from "../../shared/helpers/class-logger.helper";
import { InjectRepository } from 'typeorm-typedi-extensions';
import { EntityManager, DeepPartial } from "typeorm";
import { UnsavedModel } from "../../shared/types/unsaved-model.type";
import { IBaseModelAttributes, BaseModel } from "./base.model";
import { $DANGER } from "../../shared/types/danger.type";
import { Constructor } from "../../shared/types/constructor.type";
import { BaseRepository } from "./base.repository";

/**
 * @description
 * Create a Base Crud Service
 * 
 * @param ModelCtor 
 */
export function BaseCrudService<A extends IBaseModelAttributes, M extends A & BaseModel>(
  ModelCtor: Constructor<M>,
) {
  abstract class BaseCrudServiceCore {
    protected readonly _log = new Logger(this);
    protected readonly ModelCtor: Constructor<M> = ModelCtor;

    /**
     * @constructor
     *
     * @param _repo
     */
    constructor(
      @InjectRepository(() => ModelCtor) protected readonly _repo: BaseRepository<A, M>
    ) {}


    /**
     * @description
     * Create a model
     * 
     * @param arg
     */
    async create(arg: {
      fill: UnsavedModel<A>,
      transaction: EntityManager,
    }): Promise<M> {
      const result = await arg.transaction.create<M>(
        this.ModelCtor,
        arg.fill as $DANGER<DeepPartial<M>>,
      );

      return result;
    }

    // /**
    //  * @description
    //  * Create a model
    //  * 
    //  * @param arg
    //  */
    // create(arg: {
    //   fill: UnsavedModel<M>,
    //   transaction: EntityManager,
    // }): tEi.TaskEither<FailResult, M> {
    //   const program = FailResult.asyncTryCatch(async () => {
    //       const result = await arg.transaction.create<M>(
    //         this.ModelCtor,
    //         arg.fill as $DANGER<DeepPartial<M>>,
    //       );
    //       return result;
    //     },
    //   );

    //   return program;
    // }


    /**
     * @description
     * Update a model
     *
     * @param arg
     */
    async update(arg: {
      model: M,
      transaction: EntityManager,
    }): Promise<M> {
      const result = await arg.transaction.save<M>(arg.model);
      return result;
    }


    // /**
    //  * @description
    //  * Update a model
    //  *
    //  * @param arg
    //  */
    // update(arg: {
    //   model: M,
    //   transaction: EntityManager,
    // }): tEi.TaskEither<FailResult, M> {
    //   const program = FailResult.asyncTryCatch(async () => {
    //     const result = await arg.transaction.save<M>(arg.model);
    //     return result;
    //   });

    //   return program;
    // }


    /**
     * @description
     * Delete a model
     *
     * False if not unaffected
     *
     * @param arg
     */
    async delete(arg: {
      model: M,
      transaction: EntityManager,
    }): Promise<boolean> {
      const result = await arg.transaction.delete<M>(
        this.ModelCtor,
        arg.model.id
      );

      return !!result.affected;
  }


  //   /**
  //    * @description
  //    * Delete a model
  //    *
  //    * False if not unaffected
  //    *
  //    * @param arg
  //    */
  //   delete(arg: {
  //     model: M,
  //     transaction: EntityManager,
  //   }): tEi.TaskEither<FailResult, boolean> {
  //     const program = FailResult.asyncTryCatch(async () => {
  //         const result = await arg.transaction.delete<M>(
  //           this.ModelCtor,
  //           arg.model.id
  //         );
  //         return !!result.affected;
  //       },
  //     );

  //     return program;
  //   }
  }

  return BaseCrudServiceCore;
}