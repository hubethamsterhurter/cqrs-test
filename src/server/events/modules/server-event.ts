import { AppHeartbeatSeo } from '../models/app-heartbeat.seo';
import { SSCloseSeo } from '../models/ss.close.seo';
import { SSConnectionSeo } from '../models/ss.connection.seo';
import { SSErrorSeo } from '../models/ss.error.seo';
import { SSHeadersSeo } from '../models/ss.headers.seo';
import { SSListeningSeo } from '../models/ss.listening.seo';
import { SCCloseSeo } from '../models/sc.close.seo';
import { SCErrorSeo } from '../models/sc.error.seo';
import { SCRawMessageSeo } from '../models/sc.raw-message.seo';
import { SCMessageSeo } from '../models/sc.message-parsed.seo';
import { SCMessageInvalidSeo } from '../models/sc.message-invalid.seo';
import { SCMessageMalformedSeo } from '../models/sc.message-errored.seo';
import { SCOpenSeo } from '../models/sc.open.seo';
import { SCPingSeo } from '../models/sc.ping.seo';
import { SCPongSeo } from '../models/sc.pong.seo';
import { SCUpgradeSeo } from '../models/sc.upgrade.seo';
import { SCUnexpectedResponseSeo } from '../models/sc.unexpected-response.seo';
import { ModelUpdatedSeo } from '../models/model-updated.seo';
import { ModelDeletedSeo } from '../models/model-deleted.seo';
import { ModelCreatedSeo } from '../models/model-created.seo';
import { UserSignedUpSeo } from '../models/user.signed-up.seo';
import { UserLoggedInSeo } from '../models/user.logged-in.seo';
import { UserLoggedOutSeo } from '../models/user.logged-out.seo';

export type ServerEventCtor =
  | typeof AppHeartbeatSeo
  | typeof SSCloseSeo
  | typeof SSConnectionSeo
  | typeof SSErrorSeo
  | typeof SSHeadersSeo
  | typeof SSListeningSeo
  | typeof SCCloseSeo
  | typeof SCErrorSeo
  | typeof SCRawMessageSeo
  | typeof SCMessageSeo
  | typeof SCMessageInvalidSeo
  | typeof SCMessageMalformedSeo
  | typeof SCOpenSeo
  | typeof SCPingSeo
  | typeof SCPongSeo
  | typeof SCUpgradeSeo
  | typeof SCUnexpectedResponseSeo
  | typeof ModelCreatedSeo
  | typeof ModelUpdatedSeo
  | typeof ModelDeletedSeo
  | typeof UserSignedUpSeo
  | typeof UserLoggedInSeo
  | typeof UserLoggedOutSeo;

export type ServerEvent = ServerEventCtor['prototype'];
