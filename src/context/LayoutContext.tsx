import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface LayoutContextType {
  sidebarContent: ReactNode | null;
  setSidebarContent: (content: ReactNode | null) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarContent, setSidebarContent] = useState<ReactNode | null>(null);

  return (
    <LayoutContext.Provider value={{ sidebarContent, setSidebarContent }}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};
