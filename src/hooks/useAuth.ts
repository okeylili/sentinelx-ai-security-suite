import { useState, useEffect } from 'react';
import { blink } from '@/lib/blink';
import type { BlinkUser } from '@blinkdotnew/sdk';

export function useAuth() {
  const [user, setUser] = useState<BlinkUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user);
      setLoading(state.isLoading);
    });
    return unsubscribe;
  }, []);

  const login = (redirectUrl?: string) => blink.auth.login(redirectUrl);
  const logout = () => blink.auth.signOut();

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
