import { ReactNode } from "react";

import { LanguageProvider } from "../../entities/i18n/providers/language-provider";
import { AuthProvider } from "../../entities/session/providers/auth-provider";

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Combines all application providers in the correct order
 * Migrated from the original providers in App.tsx
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <LanguageProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </LanguageProvider>
  );
}