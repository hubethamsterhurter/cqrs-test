import './new-chat.css';
import * as op from 'rxjs/operators';
import React, { useContext, useState, useEffect } from 'react';
import { Subject, Subscription, timer, of } from 'rxjs';
import { WsContext } from './ws-provider';
import { ClientMessageCreateChat } from '../../shared/message-client/models/client-message.create-chat';
import { ClientMessageUserTyping } from '../../shared/message-client/models/client-message.user-typing';

const TYPING_DEBOUNCE = 2500;
const SUBMIT_DEBOUNCE = 0.1;
const ENTER_KEY = 13;

export const NewChat: React.FC = function NewChat(props) {
  const wsCtx = useContext(WsContext);
  const [draftMessage, setDraftMessage] = useState('');
  const [inpChange$] = useState(() => new Subject<React.ChangeEvent<HTMLInputElement>>());
  const [inpKeyDown$] = useState(() => new Subject<React.KeyboardEvent<HTMLInputElement>>());

  useEffect(() => {
    const enterKey$ = inpKeyDown$.pipe(op.filter(evt => evt.keyCode === ENTER_KEY));
    const nonEnterKey$ = inpKeyDown$.pipe(op.filter(evt => evt.keyCode !== ENTER_KEY))

    const subs: Subscription[] = [];

    // send message
    subs.push(enterKey$
      .pipe(op.throttle(() => timer(SUBMIT_DEBOUNCE), { leading: true, trailing: false }))
      .subscribe(enterEvt => {
        wsCtx.send(new ClientMessageCreateChat({ content: enterEvt.currentTarget.value, sent_at: new Date() }));
      })
    );

    // set typing
    subs.push(nonEnterKey$
      .pipe(
        op.throttle(() => timer(TYPING_DEBOUNCE), { leading: true, trailing: true }),
        op.switchMap((evt) => of(evt).pipe(op.takeUntil(enterKey$))),
      )
      .subscribe(nonEnterEvt => { wsCtx.send(new ClientMessageUserTyping()); })
    );

    subs.push(inpChange$.subscribe((evt) => setDraftMessage(evt.target.value)));

    return () => {
      inpChange$.unsubscribe();
      inpKeyDown$.unsubscribe();
      subs.forEach(sub => sub.unsubscribe());
    }
  }, []);

  return (
    <div className="new-chat">
      <input
        type='text'
        onKeyDown={inpKeyDown$.next.bind(inpKeyDown$)}
        onChange={inpChange$.next.bind(inpChange$)}
        value={draftMessage}
      />
    </div>
  );
}