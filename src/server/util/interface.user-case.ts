import { TaskEither } from "fp-ts/lib/TaskEither";
import { FailResult } from "./fail-result";

export interface IUseCase<T> {
  program(...args: any[]): TaskEither<FailResult, T>
}