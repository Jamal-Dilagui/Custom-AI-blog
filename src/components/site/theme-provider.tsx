'use client'

import * as React from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Light editorial theme is the default; we keep it light for a paper-like reading experience.
  return <>{children}</>
}
