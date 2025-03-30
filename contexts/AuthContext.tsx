import { Session, User } from "@supabase/supabase-js";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getCurrentUser,
  getSession,
  onAuthStateChange,
} from "../services/authService";

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signedIn: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signedIn: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // loads user and session data
    async function loadUserAndSession() {
      try {
        if (!mounted) return;

        const sessionResult = await getSession();
        const userResult = await getCurrentUser();

        if (mounted) {
          setSession(sessionResult);
          setUser(userResult);
        }
      } catch (error) {
        console.log("No active session found - user not logged in");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    // set up auth state change listener
    const { data: authListener } = onAuthStateChange((session, user) => {
      if (mounted) {
        setSession(session);
        setUser(user);
        setLoading(false);
      }
    });

    loadUserAndSession();

    // cleanup function to prevent memory leaks and remove listeners
    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    session,
    loading,
    signedIn: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
