import { ModelCreatedSeo } from "../events/models/model-created.seo";
import { ModelUpdatedSeo } from "../events/models/model-updated.seo";
import { ModelDeletedSeo } from "../events/models/model-deleted.seo";
import { ClassType } from "class-transformer/ClassTransformer";
import { IModel } from "../../shared/interfaces/interface.model";

export function serverModelCreatedEventOf<M extends IModel>(MCtor: ClassType<M>) {
  return function doFilter(evt: ModelCreatedSeo): evt is ModelCreatedSeo<M> {
    return evt.dto.CtorName === MCtor.name;
  }
}

export function serverModelUpdatedEventOf<M extends IModel>(MCtor: ClassType<M>) {
  return function doFilter(evt: ModelUpdatedSeo): evt is ModelUpdatedSeo<M> {
    return evt.dto.CtorName === MCtor.name;
  }
}

export function serverModelDeletedEventOf<M extends IModel>(MCtor: ClassType<M>) {
  return function doFilter(evt: ModelDeletedSeo): evt is ModelDeletedSeo<M> {
    return evt.dto.CtorName === MCtor.name;
  }
}