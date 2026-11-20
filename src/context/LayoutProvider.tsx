import { useState } from 'react';
import type { ReactNode } from 'react';
import { LayoutContext } from './LayoutContext';

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarContent, setSidebarContent] = useState<ReactNode>(null);

  return (
    <LayoutContext.Provider value={{ sidebarContent, setSidebarContent }}>
      {children}
    </LayoutContext.Provider>
  );
}
