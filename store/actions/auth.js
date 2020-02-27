import { AsyncStorage } from 'react-native';

export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expTime));
    dispatch({
      type: AUTHENTICATE,
      userId,
      token
    });
  };
};

export const signUp = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDscFlBKMQVvjE_R4FgpMxrafM3W8Br6ZU',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      const errorId = errData.error.message;
      let message = 'Something went wrong!'; //default
      if (errorId === 'EMAIL_EXISTS') {
        message = 'This email exists already!';
      }
      throw new Error(message);
    }

    const responseData = await response.json();

    dispatch(
      authenticate(
        responseData.localId,
        responseData.idToken,
        parseInt(responseData.expiresIn) * 1000
      )
    );

    const expirationDate = new Date(
      new Date().getTime() + parseInt(responseData.expiresIn) * 1000
    );
    // second date to convert huge milisecond number back to concret date
    saveDataToStorage(
      responseData.idToken,
      responseData.localId,
      expirationDate
    );
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDscFlBKMQVvjE_R4FgpMxrafM3W8Br6ZU',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true
        })
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      const errorId = errData.error.message;
      let message = 'Something went wrong!'; //default
      if (errorId === 'EMAIL_NOT_FOUND') {
        message = 'This email could not be found!';
      } else if (errorId === 'INVALID_PASSWORD') {
        message = 'This password is not valid!';
      }
      throw new Error(message);
    }

    const responseData = await response.json();
    dispatch(
      authenticate(
        responseData.localId,
        responseData.idToken,
        parseInt(responseData.expiresIn) * 1000
      )
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(responseData.expiresIn) * 1000
    );
    // second date to convert huge milisecond number back to concret date
    saveDataToStorage(
      responseData.idToken,
      responseData.localId,
      expirationDate
    );
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem('userData');
  return { type: LOGOUT };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime / 100);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({
      token: token,
      userId: userId,
      expDate: expirationDate.toISOString()
    })
  );
};
