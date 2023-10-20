import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import useUser from '../UserContext/useUser';
import useHost from '../HostContext/useHost';

interface SocketContextType {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
  emitEvent: (event: string, data?: any) => void;
  handleBackendEvent: (event: string, callback: (data: any) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
  serverUrl: string;
}

export function SocketProvider({ children, serverUrl }: SocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const {user} = useUser();
  const {currentHost} = useHost();

  useEffect(() => {
    if (user) {
      const newSocket = io(serverUrl, {query: {userId: user._id, username: user.username, currentHost: currentHost?._id}});
      setSocket(newSocket);
  
      return () => {
        newSocket.disconnect();
      };
    }
  }, [serverUrl, user]);

  const connect = () => {
    if (socket) {
      socket.connect();
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  const emitEvent = (event: string, data?: any) => {
    if (socket) {
      socket.emit(event, data);
    }
  };

  const handleBackendEvent = (event: string, callback: (data: any) => void) => {
    if (socket) {
      socket.on(event, callback);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, connect, disconnect, emitEvent, handleBackendEvent }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
