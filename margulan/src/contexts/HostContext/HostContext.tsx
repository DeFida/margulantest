import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { authAPI, hostAPI } from '../../utils/constants';
import { User } from '../UserContext/UserContext';
import { Game } from '../../vendor/types';

export type Host = {
  _id: string;
  name: string;
  host: User;
  players: User[];
  waitTime: number;
  points: number;
  maxUsers: number;
  games: Game[];
};

type HostState = {
  host: Host | null;
  currentHost: Host | null;
  create: (host: Host) => void; // Updated to match your user object
  deleteHost: () => void;
  join: (host: Host) => void;
  leave: () => void;
  
};


// Initial state
const initialState: HostState = {
  host: null,
  currentHost: null,
  create: () => {},
  deleteHost: () => {},
  join: () => {},
  leave: () => {},
};

// Create the UserContext
const HostContext = createContext<HostState>(initialState);

// User reducer function
const userReducer = (state: HostState, action: any) => {
  switch (action.type) {
    case 'CREATE':
      return {
        ...state,
        host: action.payload,
      };
    case 'JOIN':
      return {
        ...state,
        currentHost: action.payload,
      };
    case 'LEAVE':
      return {
        ...state,
        currentHost: null,
      };
    case 'DELETE':
      return {
        ...state,
        host: null,
      };
    
    default:
      return state;
  }
};

// UserProvider component
export const HostProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  

  const create = (host: Host) => {
    dispatch({ type: 'CREATE', payload: host });
  };

  const join = (host: Host) => {
    dispatch({ type: 'JOIN', payload: host });
  };

  const leave = () => {
    dispatch({ type: 'LEAVE' });
  };

  const deleteHost = () => {
    dispatch({ type: 'DELETE' });
  };

  

  useEffect(() => {
    const checkHost = async () => {
      try {
        const response = await hostAPI.checkHost();
        
        if (response.data) {
          create(response.data);
          join(response.data);
        }
      }
      catch (e) {
        console.log(e);
      }
    };
    checkHost();
  }, []);

  useEffect(() => {
    const checkCurrentHost = async () => {
      try {
        const response = await hostAPI.checkCurrentHost();
        
        if (response.data) {
          join(response.data);
        }
      }
      catch (e) {
        console.log(e);
      }
    };
    checkCurrentHost();
  }, []);



  return (
    <HostContext.Provider value={{ ...state, create, deleteHost, join, leave }}>
      {children}
    </HostContext.Provider>
  );
};

export default HostContext;
