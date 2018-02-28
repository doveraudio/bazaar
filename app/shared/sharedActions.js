import { AsyncStorage } from 'react-native';
import { API_USERNAME, API_PASSWORD } from 'react-native-dotenv';
import config from '../../config';
import api from './api';
import * as sharedActionTypes from './sharedActionTypes';

import { STRIPE_PUBLISHABLE_KEY } from 'react-native-dotenv';
var stripe = require('stripe-client')(STRIPE_PUBLISHABLE_KEY);

export function toggleAuthForm() {
  return {
    type: sharedActionTypes.TOGGLE_AUTH_FORM,
  }
}

/**
 * Create account actions
 */
export function createAccount(data) {
  return async function(dispatch, getState) {
    try {
      dispatch(createAccountInProgress());

      let response = await api.call({
        url: '/api/v1/users',
        method: 'post',
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          password: data.password,
        }
      });

      return dispatch(createAccountComplete());
    } catch (exception) {
      dispatch({
        type: sharedActionTypes.SHOW_ERROR,
        title: 'Create account',
        message: exception.error,
      });

      return dispatch(createAccountFailed());
    }
  }
}

export function createAccountInProgress() {
  return {
    type: sharedActionTypes.CREATE_ACCOUNT_IN_PROGRESS,
    loading: true,
  }
}

export function createAccountComplete(user) {
  return {
    type: sharedActionTypes.CREATE_ACCOUNT_COMPLETE,
    loading: false,
  }
}

export function createAccountFailed() {
  return {
    type: sharedActionTypes.CREATE_ACCOUNT_FAILED,
    loading: false,
  }
}

/**
 * Login actions
 */
export function loginUser(data) {
  return async function(dispatch, getState) {
    try {
      dispatch(loginInProgress());

      let response = await api.call({
        url: '/api/v1/users/self',
        options: {
          username: data.email,
          password: data.password
        }
      });

      let user = response.data;
      user.password = data.password;
      await AsyncStorage.setItem('@store:user', JSON.stringify(user));

      return dispatch(loginComplete(user));
    } catch (exception) {
      dispatch({
        type: sharedActionTypes.SHOW_ERROR,
        title: 'Login',
        message: exception.error,
      });

      return dispatch(loginFailed());
    }
  }
}

export function loginInProgress() {
  return {
    type: sharedActionTypes.LOGIN_IN_PROGRESS,
    loading: true,
  }
}

export function loginComplete(user) {
  return {
    type: sharedActionTypes.LOGIN_COMPLETE,
    loading: false,
    user: user
  }
}

/**
 * Logout actions
 */
export function logout() {
  return async function(dispatch, getState) {
    try {
      await AsyncStorage.removeItem('@store:user');
      dispatch(logoutComplete());
    } catch (exception) {
      dispatch(logoutFailed());
    }
  }
}

export function logoutComplete() {
  return {
    type: sharedActionTypes.LOGOUT_COMPLETE,
    loading: false,
    user: null
  }
}

export function loginFailed() {
  return {
    type: sharedActionTypes.LOGIN_FAILED,
    loading: false,
    user: null
  }
}

/**
 * Load user from storage
 */
export function loadUser() {
  return async function(dispatch, getState) {
    try {
      dispatch(loadUserInProgress());

      // Check if user object is in storage
      let user = await AsyncStorage.getItem('@store:user');
      if (user) {
        user = JSON.parse(user);

        // Authenticate against the API
        let response = await api.call({
          url: '/api/v1/users/self',
          options: {
            username: user.email,
            password: user.password
          }
        });

        return dispatch(loginComplete(user));
      } else {
        throw 'err in loadUser';
      }
    } catch (exception) {
      dispatch(loadUserFailed());
      return dispatch(logout());
    }
  }
}

export function loadUserInProgress() {
  return {
    type: sharedActionTypes.LOAD_USER_IN_PROGRESS,
    loading: true,
  }
}

export function loadUserFailed() {
  return {
    type: sharedActionTypes.LOAD_USER_FAILED,
    loading: false,
    user: null
  }
}

/**
 * Payment actions
 */
export function processPayment(data) {
  return async function(dispatch, getState) {
    try {
      dispatch(paymentInProgress());

      let token = await stripe.createToken({
        card: {
          number: data.cardNumber,
          exp_month: data.expMonth,
          exp_year: data.expYear,
          cvc: data.cvc,
        }
      });

      if (token.error) {
        throw token.error.code;
      }

      let response = await api.call({
        url: '/api/v1/users/self/membership',
        method: 'post',
        data: {
          stripeToken: token.id,
          amount: data.amount
        }
      });

      if (response.status !== 200) {
        throw response.data;
      }

      dispatch(paymentComplete());
      // Todo: dispatch reload user to get new user data (or returned from succesful payment?)
    } catch (exception) {
      dispatch(paymentFailed(exception));
    }
  }
}

export function paymentInProgress(user) {
  return {
    type: sharedActionTypes.PAYMENT_IN_PROGRESS,
    paymentInProgress: true,
  }
}

export function paymentFailed(exception) {
  return {
    type: sharedActionTypes.SHOW_ERROR,
    title: 'Membership payment',
    message: exception.error,
  }
}

export function paymentComplete() {
  return {
    type: sharedActionTypes.SHOW_SUCCESS,
    title: 'Membership payment',
    message: 'Thank you for your payment, you are now a Local Food Nodes member.',
  };
}