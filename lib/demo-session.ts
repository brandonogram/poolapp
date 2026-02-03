const DEMO_MODE_KEY = 'poolapp-demo-mode';

export function getDemoMode(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const sessionValue = sessionStorage.getItem(DEMO_MODE_KEY);
  if (sessionValue !== null) {
    return sessionValue === 'true';
  }

  const localValue = localStorage.getItem(DEMO_MODE_KEY);
  if (localValue !== null) {
    // Migrate any legacy demo flag into the session to avoid persistence.
    sessionStorage.setItem(DEMO_MODE_KEY, localValue);
    localStorage.removeItem(DEMO_MODE_KEY);
    return localValue === 'true';
  }

  return false;
}

export function setDemoMode(enabled: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (enabled) {
    sessionStorage.setItem(DEMO_MODE_KEY, 'true');
  } else {
    sessionStorage.removeItem(DEMO_MODE_KEY);
  }

  // Always clear any persisted demo flag.
  localStorage.removeItem(DEMO_MODE_KEY);
}

export function getDemoStorage(): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  return getDemoMode() ? sessionStorage : localStorage;
}

export function removeDemoSessionData(keys: string[]): void {
  if (typeof window === 'undefined') {
    return;
  }

  keys.forEach((key) => {
    sessionStorage.removeItem(key);
  });
}
