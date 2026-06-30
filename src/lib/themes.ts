/**
 * Theme presets for different blog niches.
 * Each theme defines a complete color palette that overrides the CSS variables.
 */

export interface ThemePreset {
  id: string
  name: string
  niche: string
  description: string
  colors: {
    primary: string           // main accent (links, buttons, highlights)
    accent: string            // secondary accent
    background: string        // page background (warm/cool tint)
    foreground: string        // main text color
    card: string              // card background
    secondary: string         // muted backgrounds
    muted: string             // muted text areas
    border: string            // borders
  }
  fontSerif: string           // Google Font for headings (or 'inherit')
  fontSans: string            // Google Font for body (or 'inherit')
}

export const THEMES: ThemePreset[] = [
  {
    id: 'art',
    name: 'Art Studio',
    niche: 'Art & Crafts',
    description: 'Warm terracotta and cream — perfect for art, fluid art, and craft blogs.',
    colors: {
      primary: '#b45309',
      accent: '#9a3412',
      background: '#fdfaf3',
      foreground: '#3d3528',
      card: '#ffffff',
      secondary: '#f5efe4',
      muted: '#f0e9db',
      border: '#e2d9c8',
    },
    fontSerif: 'Playfair Display',
    fontSans: 'Inter',
  },
  {
    id: 'food',
    name: 'Foodie Kitchen',
    niche: 'Food & Recipes',
    description: 'Fresh sage green and warm white — ideal for food and recipe blogs.',
    colors: {
      primary: '#4a7c59',
      accent: '#c44536',
      background: '#fefcf7',
      foreground: '#2d2d2d',
      card: '#ffffff',
      secondary: '#f3f0e8',
      muted: '#e8e4d9',
      border: '#d9d3c5',
    },
    fontSerif: 'Lora',
    fontSans: 'Inter',
  },
  {
    id: 'tech',
    name: 'Tech Modern',
    niche: 'Technology',
    description: 'Sleek emerald and dark slate — clean and modern for tech blogs.',
    colors: {
      primary: '#059669',
      accent: '#0d9488',
      background: '#0f172a',
      foreground: '#e2e8f0',
      card: '#1e293b',
      secondary: '#1e293b',
      muted: '#334155',
      border: '#334155',
    },
    fontSerif: 'Inter',
    fontSans: 'Inter',
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle Bloom',
    niche: 'Lifestyle & Wellness',
    description: 'Soft rose and lavender — warm and inviting for lifestyle blogs.',
    colors: {
      primary: '#be185d',
      accent: '#7c3aed',
      background: '#fdf4f7',
      foreground: '#3d2438',
      card: '#ffffff',
      secondary: '#f9eef2',
      muted: '#f0e0e8',
      border: '#e2ccd6',
    },
    fontSerif: 'Cormorant Garamond',
    fontSans: 'Inter',
  },
  {
    id: 'fashion',
    name: 'Fashion Noir',
    niche: 'Fashion & Style',
    description: 'Bold black and gold — elegant and luxurious for fashion blogs.',
    colors: {
      primary: '#a67c00',
      accent: '#1a1a1a',
      background: '#fafafa',
      foreground: '#1a1a1a',
      card: '#ffffff',
      secondary: '#f0f0f0',
      muted: '#e0e0e0',
      border: '#d0d0d0',
    },
    fontSerif: 'Cormorant Garamond',
    fontSans: 'Inter',
  },
  {
    id: 'travel',
    name: 'Travel Ocean',
    niche: 'Travel & Adventure',
    description: 'Ocean blue and sandy beige — fresh and adventurous for travel blogs.',
    colors: {
      primary: '#0284c7',
      accent: '#f59e0b',
      background: '#f0f9ff',
      foreground: '#1e3a5f',
      card: '#ffffff',
      secondary: '#e0f2fe',
      muted: '#bae6fd',
      border: '#7dd3fc',
    },
    fontSerif: 'Lora',
    fontSans: 'Inter',
  },
  {
    id: 'wellness',
    name: 'Wellness Calm',
    niche: 'Health & Wellness',
    description: 'Calming teal and sage — peaceful and natural for wellness blogs.',
    colors: {
      primary: '#0d9488',
      accent: '#65a30d',
      background: '#f0fdfa',
      foreground: '#134e4a',
      card: '#ffffff',
      secondary: '#ccfbf1',
      muted: '#99f6e4',
      border: '#5eead4',
    },
    fontSerif: 'Lora',
    fontSans: 'Inter',
  },
  {
    id: 'business',
    name: 'Business Pro',
    niche: 'Business & Finance',
    description: 'Professional navy and silver — trustworthy and clean for business blogs.',
    colors: {
      primary: '#1e40af',
      accent: '#475569',
      background: '#f8fafc',
      foreground: '#1e293b',
      card: '#ffffff',
      secondary: '#f1f5f9',
      muted: '#e2e8f0',
      border: '#cbd5e1',
    },
    fontSerif: 'Inter',
    fontSans: 'Inter',
  },
  {
    id: 'photography',
    name: 'Photography Dark',
    niche: 'Photography',
    description: 'Dark charcoal with amber accents — dramatic for photography portfolios.',
    colors: {
      primary: '#f59e0b',
      accent: '#dc2626',
      background: '#18181b',
      foreground: '#fafafa',
      card: '#27272a',
      secondary: '#27272a',
      muted: '#3f3f46',
      border: '#3f3f46',
    },
    fontSerif: 'Inter',
    fontSans: 'Inter',
  },
  {
    id: 'gaming',
    name: 'Gaming Neon',
    niche: 'Gaming & Esports',
    description: 'Neon purple and cyan — bold and energetic for gaming blogs.',
    colors: {
      primary: '#9333ea',
      accent: '#06b6d4',
      background: '#0c0a14',
      foreground: '#e9d5ff',
      card: '#1a1625',
      secondary: '#1a1625',
      muted: '#2e2438',
      border: '#3b3247',
    },
    fontSerif: 'Inter',
    fontSans: 'Inter',
  },
  {
    id: 'education',
    name: 'Education Bright',
    niche: 'Education & Learning',
    description: 'Bright indigo and yellow — friendly and approachable for education blogs.',
    colors: {
      primary: '#4f46e5',
      accent: '#eab308',
      background: '#f5f3ff',
      foreground: '#1e1b4b',
      card: '#ffffff',
      secondary: '#ede9fe',
      muted: '#ddd6fe',
      border: '#c4b5fd',
    },
    fontSerif: 'Lora',
    fontSans: 'Inter',
  },
  {
    id: 'minimal',
    name: 'Minimal Clean',
    niche: 'Minimalist',
    description: 'Pure black and white — distraction-free for minimalist blogs.',
    colors: {
      primary: '#000000',
      accent: '#525252',
      background: '#ffffff',
      foreground: '#171717',
      card: '#ffffff',
      secondary: '#fafafa',
      muted: '#f5f5f5',
      border: '#e5e5e5',
    },
    fontSerif: 'Inter',
    fontSans: 'Inter',
  },
]

export function getTheme(id: string): ThemePreset {
  return THEMES.find((t) => t.id === id) || THEMES[0]
}

/**
 * Apply a theme's colors as CSS custom properties on the document root.
 * Called by the settings context when settings load or change.
 */
export function applyTheme(theme: ThemePreset) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const c = theme.colors

  // Convert hex to oklch-compatible values for the existing CSS variable system.
  // We set raw hex values — the CSS variables accept any valid CSS color.
  root.style.setProperty('--primary', c.primary)
  root.style.setProperty('--accent', c.accent)
  root.style.setProperty('--background', c.background)
  root.style.setProperty('--foreground', c.foreground)
  root.style.setProperty('--card', c.card)
  root.style.setProperty('--secondary', c.secondary)
  root.style.setProperty('--muted', c.muted)
  root.style.setProperty('--border', c.border)
  root.style.setProperty('--ring', c.primary)

  // Set font families
  if (theme.fontSerif && theme.fontSerif !== 'inherit') {
    root.style.setProperty('--font-serif', `'${theme.fontSerif}', Georgia, serif`)
  }
  if (theme.fontSans && theme.fontSans !== 'inherit') {
    root.style.setProperty('--font-sans', `'${theme.fontSans}', system-ui, sans-serif`)
  }

  // Derive muted-foreground from foreground (60% opacity equivalent)
  root.style.setProperty('--muted-foreground', c.foreground)
  root.style.setProperty('--card-foreground', c.foreground)
  root.style.setProperty('--secondary-foreground', c.foreground)
  root.style.setProperty('--accent-foreground', c.foreground)
  root.style.setProperty('--popover', c.card)
  root.style.setProperty('--popover-foreground', c.foreground)
  root.style.setProperty('--primary-foreground', c.background === '#ffffff' || c.background === '#fefcf7' || c.background === '#fafafa' || c.background === '#f8fafc' || c.background === '#f5f3ff' || c.background === '#fdfaf3' || c.background === '#fef4f7' || c.background === '#f0fdfa' || c.background === '#f0f9ff' ? '#ffffff' : c.foreground)
  root.style.setProperty('--input', c.border)
  root.style.setProperty('--destructive', '#dc2626')
}
