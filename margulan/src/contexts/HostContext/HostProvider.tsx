import React, { ReactNode } from 'react';
import { HostProvider } from './HostContext';

type AppProviderProps = {
  children: ReactNode;
};

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return <HostProvider>{children}</HostProvider>;
};

export default AppProvider;
