import React, { createContext, useContext, useState, ReactNode, FormEvent } from 'react';

type AppState = {
  theme: string;
  onLight: () => void;
  onDark: () => void;
  appLoading: boolean;
  setAppLoading: (value: boolean) => void;
};

// Create the AppContext
const AppContext = createContext<AppState | undefined>(undefined);

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Create the AppProvider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storedTheme = localStorage.getItem('theme');
  const initialTheme = storedTheme ? storedTheme : 'dark';
  const [theme, setTheme] = useState<string>(initialTheme);
  const [appLoading, setAppLoading] = useState(false)

  const onLight = () => {
    setTheme('light');
    localStorage.setItem('theme', 'light');

  };

  const onDark = () => {
    setTheme('dark');
    localStorage.setItem('theme', 'dark');
  };

  const appState: AppState = {
    theme,
    onLight,
    onDark,
    appLoading,
    setAppLoading
  };

  return <AppContext.Provider value={appState}>{children}</AppContext.Provider>;
};
