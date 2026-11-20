import { createContext, useContext } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';

interface LayoutContextValue {
  sidebarContent: ReactNode;
  setSidebarContent: Dispatch<SetStateAction<ReactNode>>;
}

export const LayoutContext = createContext<LayoutContextValue | undefined>(undefined);

export function useLayout(): LayoutContextValue {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used within a LayoutProvider');
  return context;
}
