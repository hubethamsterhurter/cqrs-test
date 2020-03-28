import './signup-page.css';
import * as op from 'rxjs/operators';
import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import { WsContext } from './ws-provider';
import { ClientMessageSignUp } from '../../shared/message-client/models/client-message.sign-up';
import { Trace } from '../../shared/helpers/Tracking.helper';
import { of, timer } from 'rxjs';
import { ServerMessage } from '../../shared/message-server/modules/server-message-registry';
import { ServerMessageClientMessageInvalid } from '../../shared/message-server/models/server-message.client-message-invalid';
import { ofServerMessage } from '../../server/helpers/server-server-message-event-filter.helper';
import { ServerMessageClientMessageMalformed } from '../../shared/message-server/models/server-message.client-message-malformed';
import { ServerMessageError } from '../../shared/message-server/models/server-message.error';


interface NewUser {
  user_name: string;
  password: string;
}

export const SignupPage: React.FC = function SignupPage(props) {
  const [newUser, setNewUser] = useState<NewUser>({ user_name: '', password: ''});
  const wsCtx = useContext(WsContext);

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <Formik
        initialValues={{ user_name: '', password: '' }}
        // TODO: validate
        validate={() => []}
        onSubmit={(values, opts) => {
          const trace = new Trace();

          wsCtx.send(new ClientMessageSignUp({
            user_name: values.user_name,
            password: values.password,
            _o: trace,
          }));

          of(undefined)
            .pipe(
              op.race<undefined | ServerMessage>(
                of(undefined).pipe(op.delay(5000)),
                wsCtx.message$.pipe(op.filter(evt => evt._o.id === trace.id)),
              ),
              op.take(1),
            )
            .subscribe((evt) => {
              if (!evt) {
                console.log('No response from server...');
              } else if (evt._t === ServerMessageClientMessageInvalid._t) {
                console.log('Message Invalid', evt);
              } else if (evt._t === ServerMessageClientMessageMalformed._t) {
                console.log('Message Malformed', evt);
              } else if (evt._t === ServerMessageError._t) {
                console.log('Message Error', evt);
              } else {
                console.log('Unhandled evt', evt);
              }
              opts.setSubmitting(false);
            });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => {
          return (
            <form
              className="signup-form"
              onSubmit={handleSubmit}
            >
              <label>Username</label>
              <input
                type="text"
                name="user_name"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.user_name}
              />
              {errors.user_name && touched.user_name}
              <label>Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
              {errors.password && touched.password}
              <button type="submit" disabled={isSubmitting}>
                Submit
              </button>
            </form>
          )
        }}
      </Formik>
    </div>
  );
}