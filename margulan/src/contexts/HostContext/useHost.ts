import { useContext } from 'react';
import HostContext from './HostContext';

const useHost = () => {
  const context = useContext(HostContext);

  if (!context) {
    throw new Error('useHost must be used within a HostProvider');
  }

  return context;
};

export default useHost;
