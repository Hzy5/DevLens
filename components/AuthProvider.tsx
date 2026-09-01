"use client";

import {
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { firebaseAuthMessage } from "@/lib/firebase-errors";
import {
  emailVerificationSettings,
  getFirebaseAuth,
  googleProvider,
  initFirebaseAnalytics,
  isFirebaseConfigured,
} from "@/lib/firebase";

type AuthResult = {
  emailVerified: boolean;
};

type AuthContextValue = {
  user: User | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  isEmailVerified: boolean;
  getIdToken: (forceRefresh?: boolean) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signInWithGoogle: () => Promise<AuthResult>;
  signOut: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  refreshEmailVerification: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isLoaded, setIsLoaded] = useState(() => !isFirebaseConfigured());

  const syncUser = useCallback((next: User | null) => {
    setUser(next);
    setEmailVerified(Boolean(next?.emailVerified));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured()) {
      return;
    }

    void initFirebaseAnalytics();
    const auth = getFirebaseAuth();
    return onIdTokenChanged(auth, (next) => {
      syncUser(next);
    });
  }, [syncUser]);

  const getIdToken = useCallback(async (forceRefresh = false) => {
    const current = getFirebaseAuth().currentUser ?? user;
    if (!current) return null;
    return current.getIdToken(forceRefresh);
  }, [user]);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const credential = await signInWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password,
      );
      syncUser(credential.user);
      return { emailVerified: credential.user.emailVerified };
    } catch (error) {
      throw new Error(firebaseAuthMessage(error));
    }
  }, [syncUser]);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const credential = await createUserWithEmailAndPassword(
        getFirebaseAuth(),
        email,
        password,
      );
      try {
        await sendEmailVerification(
          credential.user,
          emailVerificationSettings(),
        );
      } catch {
        // Account exists; they can resend from /verify-email.
      }
      syncUser(credential.user);
      return { emailVerified: credential.user.emailVerified };
    } catch (error) {
      throw new Error(firebaseAuthMessage(error));
    }
  }, [syncUser]);

  const signInWithGoogle = useCallback(async () => {
    try {
      const credential = await signInWithPopup(
        getFirebaseAuth(),
        googleProvider(),
      );
      syncUser(credential.user);
      return { emailVerified: credential.user.emailVerified };
    } catch (error) {
      throw new Error(firebaseAuthMessage(error));
    }
  }, [syncUser]);

  const signOut = useCallback(async () => {
    if (!isFirebaseConfigured()) return;
    await firebaseSignOut(getFirebaseAuth());
  }, []);

  const sendVerificationEmail = useCallback(async () => {
    const current = getFirebaseAuth().currentUser;
    if (!current) {
      throw new Error("Sign in to confirm your email.");
    }
    if (current.emailVerified) return;

    try {
      await sendEmailVerification(current, emailVerificationSettings());
    } catch (error) {
      throw new Error(firebaseAuthMessage(error));
    }
  }, []);

  const refreshEmailVerification = useCallback(async () => {
    const current = getFirebaseAuth().currentUser;
    if (!current) {
      return false;
    }

    await current.reload();
    const next = getFirebaseAuth().currentUser;
    const verified = Boolean(next?.emailVerified);
    syncUser(next);
    if (verified && next) {
      await next.getIdToken(true);
    }
    return verified;
  }, [syncUser]);

  useEffect(() => {
    if (!isLoaded || !user || emailVerified) return;

    function onVisible() {
      if (document.visibilityState === "visible") {
        void refreshEmailVerification();
      }
    }

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    const immediate = window.setTimeout(() => {
      void refreshEmailVerification();
    }, 0);
    const timer = window.setInterval(() => {
      void refreshEmailVerification();
    }, 8000);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      window.clearTimeout(immediate);
      window.clearInterval(timer);
    };
  }, [isLoaded, user, emailVerified, refreshEmailVerification]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoaded,
      isSignedIn: Boolean(user),
      isEmailVerified: emailVerified,
      getIdToken,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      sendVerificationEmail,
      refreshEmailVerification,
    }),
    [
      user,
      isLoaded,
      emailVerified,
      getIdToken,
      signIn,
      signUp,
      signInWithGoogle,
      signOut,
      sendVerificationEmail,
      refreshEmailVerification,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
