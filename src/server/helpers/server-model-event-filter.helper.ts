import { Model } from "../../shared/domains/model";
import { ModelCreatedSeo } from "../events/models/model-created.seo";
import { ModelUpdatedSeo } from "../events/models/model-updated.seo";
import { ModelDeletedSeo } from "../events/models/model-deleted.seo";
import { ClassType } from "class-transformer/ClassTransformer";

export function serverModelCreatedEventOf<M extends Model>(MCtor: ClassType<M>) {
  return function doFilter(evt: ModelCreatedSeo): evt is ModelCreatedSeo<M> {
    return evt._p.CTor === MCtor;
  }
}

export function serverModelUpdatedEventOf<M extends Model>(MCtor: ClassType<M>) {
  return function doFilter(evt: ModelUpdatedSeo): evt is ModelUpdatedSeo<M> {
    return evt._p.CTor === MCtor;
  }
}

export function serverModelDeletedEventOf<M extends Model>(MCtor: ClassType<M>) {
  return function doFilter(evt: ModelDeletedSeo): evt is ModelDeletedSeo<M> {
    return evt._p.CTor === MCtor;
  }
}