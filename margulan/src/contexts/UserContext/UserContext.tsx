import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { authAPI } from '../../utils/constants';
import { Game } from '../../vendor/types';


export type User = {
  _id: string;
  username: string;
  games: Game[];
};

type UserState = {
  user: null | User; // Updated to match your user object
  login: (user: User) => void; // Updated to match your user object
  logout: () => void;
  loading: boolean;
};


// Initial state
const initialState: UserState = {
  user: null,
  login: () => {},
  logout: () => {},
  loading: true
};

// Create the UserContext
const UserContext = createContext<UserState>(initialState);

// User reducer function
const userReducer = (state: UserState, action: any) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

// UserProvider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  

  const login = (user: User) => {
    dispatch({ type: 'LOGIN', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.checkAuth()
        
        if (response.data) {
          login(response.data);
        }
      } catch (error) {
        logout()
      }
      finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    checkAuth();
  }, []);

  return (
    <UserContext.Provider value={{ ...state, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
