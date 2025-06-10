import { Toaster } from "sonner";

import { AppProviders } from "./providers";
import { AppRouter } from "./router";

// Import global styles
import "../styles/globals.css";

/**
 * Main application component that initializes the app
 * This replaces the original App.tsx file
 */
export default function App() {
  return (
    <AppProviders>
      <AppRouter />
      <Toaster />
    </AppProviders>
  );
}