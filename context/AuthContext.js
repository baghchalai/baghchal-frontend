import { createContext, useEffect, useReducer } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return { token: action.payload };
    case 'LOGOUT':
      return { token: null };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    token: null,
  });

  useEffect(() => {
    let token = JSON.parse(localStorage.getItem('token'));

    if (token) {
      axios({
        method: 'GET',
        url: `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/users/me/`,
        headers: {
          Authorization: `JWT ${token.access}`,
        },
      }).then((res) => {
        token = { ...token, ...res.data };
        console.log(token);
        dispatch({ type: 'LOGIN', payload: token });
      }).catch((err) => console.log(err));

      dispatch({ type: 'LOGIN', payload: token });
    }
  }, []);
  //   console.log('AuthContext State', state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
