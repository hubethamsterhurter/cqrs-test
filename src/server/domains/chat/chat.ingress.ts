// import * as currably from 'fp-ts/lib/'
import * as tEi from 'fp-ts/lib/TaskEither';
import * as ei from 'fp-ts/lib/Either';
import { Inject, Service } from "typedi";
import { LogConstruction } from "../../../shared/decorators/log-construction.decorator";
import { Logger } from '../../../shared/helpers/class-logger.helper';
import { HTTP_CODE } from "../../../shared/constants/http-code.constant";
import { UserModel } from "../user/user.model";
import { FailResult } from '../../util/fail-result';
import { CannotActionModelLang } from '../../lang/strings/cannot-action-model.lang';
import { UserLang } from '../../lang/strings/model.user.lang';
import { UpdateLang } from '../../lang/strings/action.update.lang';
import { AlreadyExistsLang } from '../../lang/strings/reason.already-exists.lang';
import { ChatCrudService } from './chat.crud.service';
import { ChatRepository } from './chat.repository';
import { CreateChatCommand } from '../../../shared/domains/chat/command.create-chat';
import { UpdateChatCommand } from '../../../shared/domains/chat/command.update-chat';
import { ChatModel } from './chat.model';



@Service()
@LogConstruction()
export class ChatIngress {
  #log = new Logger(this);


  /**
   * @constructor
   * 
   * @param _chatCrudService
   * @param _chatRepo
   */
  constructor(
    @Inject(() => ChatCrudService) private readonly _chatCrudService: ChatCrudService,
    @Inject(() => ChatRepository) private readonly _chatRepo: ChatRepository,
  ) {}


  /**
   * @description
   * Create a user
   *
   * @param dto
   */
  create(arg: {
    dto: CreateChatCommand,
    user: UserModel,
  }): tEi.TaskEither<FailResult, ChatModel> {
    return async (): Promise<ei.Either<FailResult, ChatModel>> => {
      try {
        const savedChat: ChatModel = await this
          ._chatRepo
          .manager
          .transaction(async (transaction) => {
            const user = await this
              ._chatCrudService
              .create({
                fill: {
                  author_id: null,
                  content: arg.dto.content,
                  sent_at: arg.dto.sent_at,
                },
                transaction,
              });
            await transaction.release();
            return user;
          });

        return ei.right(savedChat);
      } catch (err) {
        return ei.left(FailResult.fromUnknown(err))
      }
    }
  }


  /**
   * @description
   * Update a user
   * 
   * @param dto
   */
  update(arg: {
    dto: UpdateChatCommand,
    updater: UserModel,
  }): tEi.TaskEither<FailResult, ChatModel> {
    return async (): Promise<ei.Either<FailResult, ChatModel>> => {
      try {
        // TODO: check author or permissions
        const chatEither = await this
          ._chatRepo
          .eitherFindOneAlive(
            { where: { id: arg.dto.id },
            withDeleted: true
          })();

        if (ei.isLeft(chatEither)) return chatEither;
        const chat = chatEither.right;

        // todo immutable & fillable
        if (arg.dto.content) chat.content = arg.dto.content;

        const savedChat: ChatModel = await this
          ._chatRepo
          .manager
          .transaction(async (transaction) => {
            const updatedChat = await this
              ._chatCrudService
              .update({
                model: chat,
                transaction,
              });
            await transaction.release();
            return updatedChat;
          });

        return ei.right(savedChat);
      } catch (err) {
        return ei.left(FailResult.fromUnknown(err))
      }
    }
  }
}