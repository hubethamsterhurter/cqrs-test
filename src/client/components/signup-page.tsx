import './signup-page.css';
import * as op from 'rxjs/operators';
import React, { useContext } from 'react';
import { race } from 'rxjs';
import { Formik } from 'formik';
import { WsContext } from './ws-provider';
import { ClientMessageSignUp } from '../../shared/message-client/models/client-message.sign-up';
import { Trace } from '../../shared/helpers/Tracking.helper';
import { of } from 'rxjs';
import { ServerMessage } from '../../shared/message-server/modules/server-message-registry';


interface NewUser {
  user_name: string;
  password: string;
}

export const SignupPage: React.FC = function SignupPage(props) {
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

          const UNRESPONSIVE_WAIT = 5000;

          race<undefined | ServerMessage>(
            wsCtx.message$.pipe(op.filter(evt => evt._o.origin_id === trace.id)),
            of(undefined).pipe(op.delay(UNRESPONSIVE_WAIT)),
          )
            .pipe(op.take(1))
            .subscribe((evt) => { opts.setSubmitting(false); });

          wsCtx.send(new ClientMessageSignUp({
            user_name: values.user_name,
            password: values.password,
            _o: trace,
          }));
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