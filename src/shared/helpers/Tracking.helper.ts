import { v4 } from 'uuid'
import { IsOptional, IsString } from "class-validator";

export class Trace {
  @IsString()
  readonly id!: string;

  @IsOptional()
  @IsString()
  readonly prev_id!: null | string;

  @IsString()
  readonly origin_id!: string;


  /**
   * @constructor
   *
   * @param opts
   */
  constructor(opts: {
    id?: string;
    last_id?: string | null;
    origin_id?: string;
  } = {}) {
    if (opts) {
      this.id = opts.id ?? v4();
      this.prev_id = opts.last_id ?? null;
      this.origin_id = opts.origin_id ?? this.id;
    }
  }


  /**
   * @description
   * Clone
   *
   * @param prev_id 
   */
  clone(newId?: string): Trace {
    if (!newId) newId = v4();
    return new Trace({ 
      id: newId,
      last_id: this.id,
      origin_id: this.origin_id,
    });
  }
}
