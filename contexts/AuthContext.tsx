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

  // Dans AuthContext.tsx
  useEffect(() => {
    let mounted = true;

    // Vérifier si l'utilisateur est déjà connecté au démarrage
    async function loadUserAndSession() {
      try {
        if (!mounted) return;

        // Récupérer la session et l'utilisateur
        const sessionResult = await getSession();
        const userResult = await getCurrentUser();

        if (mounted) {
          setSession(sessionResult);
          setUser(userResult);
        }
      } catch (error) {
        // Ne pas logger d'erreur ici - c'est un comportement attendu
        console.log("No active session found - user not logged in");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    // Observer les changements d'authentification
    const { data: authListener } = onAuthStateChange((session, user) => {
      if (mounted) {
        setSession(session);
        setUser(user);
        setLoading(false);
      }
    });

    loadUserAndSession();

    // Nettoyer l'écouteur lors du démontage
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

// Hook personnalisé pour utiliser le contexte d'authentification
export function useAuth() {
  return useContext(AuthContext);
}
