import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

import { RouteType, UserType } from '../../App';
import Spinner from '../UI/Spinner';
import logo from '../../assets/images/logo.png';
import signInImage from '../../assets/images/signin.jpg';

type PropTypes = {
  loadUser: (user: UserType) => void;
  onRouteChange: (route: RouteType) => void;
};

const Signin = ({ loadUser, onRouteChange }: PropTypes) => {
  return (
    <div className="fixed w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl">
      <div className="flex w-full">
        <div
          className="relative hidden bg-cover lg:block lg:w-1/2"
          style={{ backgroundImage: `url(${signInImage})` }}
        >
          <div className="absolute top-0 left-0 w-full h-full bg-gray-800 opacity-30"></div>
        </div>

        <div className="w-full max-w-sm mx-auto overflow-hidden bg-white dark:bg-gray-800">
          <div className="px-6 py-10">
            <div className="flex items-center text-center justify-center mb-5">
              <img src={logo} alt="RecogBot Logo" className="w-14 h-14 mr-3" />
              <h1 className="text-3xl dark:text-white">Photo RecogBot</h1>
            </div>

            <p className="mt-1 text-center text-gray-500 dark:text-gray-400">
              Login or create account
            </p>

            <Formik
              initialValues={{ password: '', email: '' }}
              validationSchema={Yup.object({
                password: Yup.string().required('Required'),
                email: Yup.string()
                  .email('Invalid email address')
                  .required('Required'),
              })}
              onSubmit={(values, { setSubmitting, setStatus }) => {
                setSubmitting(true);
                axios({
                  method: 'post',
                  url: `${process.env.REACT_APP_REMOTE_URL}/api/signin`,
                  withCredentials: true,
                  data: {
                    email: values.email,
                    password: values.password,
                    withCredentials: true,
                  },
                })
                  .then((response) => {
                    if (response.data.id) {
                      setSubmitting(false);
                      loadUser(response.data);
                      onRouteChange('home');
                    }
                  })
                  .catch((err) => {
                    setStatus('Your username or password is incorrect');
                    setSubmitting(false);
                    console.log(err);
                  });
              }}
            >
              {({ isSubmitting, status }) => (
                <Form>
                  <div className="w-full mt-4">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200 text-left"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <Field
                      className="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-200 placeholder-gray-500 bg-white border rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                      type="email"
                      name="email"
                      aria-label="Email Address"
                    />
                    <div className="text-sm text-red-600 mt-1">
                      <ErrorMessage name="email" />
                    </div>
                  </div>

                  <div className="w-full mt-4">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-600 dark:text-gray-200 text-left"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <Field
                      className="block w-full px-4 py-2 mt-2 text-gray-700 dark:text-gray-200 placeholder-gray-500 bg-white border rounded-md border-gray-300 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
                      type="password"
                      name="password"
                      aria-label="Password"
                    />
                    <div className="text-sm text-red-600 mt-1">
                      <ErrorMessage name="password" />
                    </div>
                  </div>

                  <div className="flex items-center justify-end mt-4">
                    {/* <button className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500">
                      Forget Password?
                    </button> */}

                    {!isSubmitting ? (
                      <button
                        className="px-4 py-2 leading-5 text-white transition-colors duration-300 transform bg-blue-900 rounded hover:bg-blue-800 focus:outline-none"
                        type="submit"
                      >
                        Login
                      </button>
                    ) : (
                      <Spinner />
                    )}
                  </div>
                  <div className="text-sm text-red-600 mt-3">
                    {status && status}
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          <div className="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700">
            <span className="text-sm text-gray-600 dark:text-gray-200">
              Don't have an account?{' '}
            </span>

            <button
              className="mx-2 text-sm font-bold text-blue-500 dark:text-blue-400 hover:underline"
              onClick={() => onRouteChange('register')}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
