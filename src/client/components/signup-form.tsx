import './signup-page.css';
import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import { WsContext } from './ws-provider';
import { ClientMessageSignUp } from '../../shared/message-client/models/client-message.sign-up';


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
          wsCtx.send(new ClientMessageSignUp({
            user_name: values.user_name,
            password: values.password
          }));
          // full CQRS - submitting always false...?

          // setTimeout(() => {
          //   console.log(values);
          //   opts.setSubmitting(false);
          // }, 400);
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