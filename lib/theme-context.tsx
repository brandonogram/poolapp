'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

type Theme = 'light' | 'dark' | 'system';
type ContrastMode = 'normal' | 'high';
type TextSize = 'normal' | 'large';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
  contrastMode: ContrastMode;
  setContrastMode: (mode: ContrastMode) => void;
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

const THEME_KEY = 'poolapp-theme';
const CONTRAST_KEY = 'poolapp-contrast';
const TEXT_SIZE_KEY = 'poolapp-text-size';
const REDUCED_MOTION_KEY = 'poolapp-reduced-motion';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [contrastMode, setContrastModeState] = useState<ContrastMode>('normal');
  const [textSize, setTextSizeState] = useState<TextSize>('normal');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize from localStorage and system preferences
  useEffect(() => {
    setMounted(true);

    // Load saved preferences
    const savedTheme = localStorage.getItem(THEME_KEY) as Theme | null;
    const savedContrast = localStorage.getItem(CONTRAST_KEY) as ContrastMode | null;
    const savedTextSize = localStorage.getItem(TEXT_SIZE_KEY) as TextSize | null;
    const savedReducedMotion = localStorage.getItem(REDUCED_MOTION_KEY);

    if (savedTheme) setThemeState(savedTheme);
    if (savedContrast) setContrastModeState(savedContrast);
    if (savedTextSize) setTextSizeState(savedTextSize);
    if (savedReducedMotion !== null) {
      setReducedMotion(savedReducedMotion === 'true');
    } else {
      // Check system preference for reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setReducedMotion(prefersReducedMotion);
    }
  }, []);

  // Resolve theme based on system preference
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolvedTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();
    mediaQuery.addEventListener('change', updateResolvedTheme);
    return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
  }, [theme, mounted]);

  // Apply theme classes to document
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Theme
    root.classList.remove('light', 'dark');
    root.classList.add(resolvedTheme);

    // Contrast mode
    root.classList.remove('high-contrast');
    if (contrastMode === 'high') {
      root.classList.add('high-contrast');
    }

    // Text size
    root.classList.remove('text-large');
    if (textSize === 'large') {
      root.classList.add('text-large');
    }

    // Reduced motion
    root.classList.remove('reduced-motion');
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    }
  }, [resolvedTheme, contrastMode, textSize, reducedMotion, mounted]);

  // Listen for system reduced motion changes
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a preference
      if (localStorage.getItem(REDUCED_MOTION_KEY) === null) {
        setReducedMotion(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  };

  const setContrastMode = (mode: ContrastMode) => {
    setContrastModeState(mode);
    localStorage.setItem(CONTRAST_KEY, mode);
  };

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem(TEXT_SIZE_KEY, size);
  };

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion;
    setReducedMotion(newValue);
    localStorage.setItem(REDUCED_MOTION_KEY, String(newValue));
  };

  // Prevent flash of incorrect theme
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden' }}>
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        resolvedTheme,
        contrastMode,
        setContrastMode,
        textSize,
        setTextSize,
        reducedMotion,
        toggleReducedMotion,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return safe defaults for SSR/prerendering - components will hydrate properly
    return {
      theme: 'system' as const,
      setTheme: () => {},
      resolvedTheme: 'light' as const,
      contrastMode: 'normal' as const,
      setContrastMode: () => {},
      textSize: 'normal' as const,
      setTextSize: () => {},
      reducedMotion: false,
      toggleReducedMotion: () => {},
    };
  }
  return context;
}
