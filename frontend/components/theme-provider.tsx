/**
 * Theme Provider component
 * @module components/theme-provider
 * @description A wrapper component for next-themes provider to enable theme switching
 */

'use client'

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

const ThemeProvider = ({ children, ...props }: ThemeProviderProps) => {
  // --- Hooks -----------------------------------------------------------------
  // --- END: Hooks ------------------------------------------------------------

  // --- Local state -----------------------------------------------------------
  // --- END: Local state ------------------------------------------------------

  // --- Refs ------------------------------------------------------------------
  // --- END: Refs -------------------------------------------------------------

  // --- Data and handlers -----------------------------------------------------
  // --- END: Data and handlers ------------------------------------------------

  // --- Side effects ----------------------------------------------------------
  // --- END: Side effects -----------------------------------------------------

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export { ThemeProvider }
