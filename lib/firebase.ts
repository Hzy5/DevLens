import { getAnalytics, isSupported } from "firebase/analytics";
import { getApps, initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

function clientConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  };
}

export function isFirebaseConfigured() {
  const config = clientConfig();
  return Boolean(
    config.apiKey && config.authDomain && config.projectId && config.appId,
  );
}

function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured()) {
    throw new Error("firebase_not_configured");
  }

  return getApps()[0] ?? initializeApp(clientConfig());
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export async function initFirebaseAnalytics() {
  if (typeof window === "undefined" || !isFirebaseConfigured()) return;
  if (!(await isSupported())) return;
  getAnalytics(getFirebaseApp());
}

export function googleProvider() {
  return new GoogleAuthProvider();
}

export function emailVerificationSettings() {
  const origin =
    typeof window !== "undefined" ? window.location.origin : undefined;

  if (!origin) return undefined;

  return {
    url: `${origin}/verify-email`,
    handleCodeInApp: false,
  };
}
