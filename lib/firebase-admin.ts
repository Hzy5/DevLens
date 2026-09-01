import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function adminCredentials() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  );

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return { projectId, clientEmail, privateKey };
}

function adminProjectId() {
  return (
    process.env.FIREBASE_ADMIN_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    ""
  );
}

export function hasFirestoreCredentials() {
  return Boolean(adminCredentials());
}

function getAdminApp(): App | null {
  if (getApps().length) {
    return getApps()[0] ?? null;
  }

  const credentials = adminCredentials();
  if (credentials) {
    return initializeApp({
      credential: cert(credentials),
    });
  }

  const projectId = adminProjectId();
  if (!projectId) return null;

  return initializeApp({ projectId });
}

function getAdminAuth() {
  const app = getAdminApp();
  return app ? getAuth(app) : null;
}

export function getAdminDb() {
  if (!hasFirestoreCredentials()) return null;
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}

export type VerifiedRequestUser = {
  uid: string;
  email: string | null;
  emailVerified: boolean;
};

export async function verifyRequestUser(
  request: Request,
): Promise<VerifiedRequestUser | null> {
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token) return null;

  const auth = getAdminAuth();
  if (!auth) return null;

  try {
    const decoded = await auth.verifyIdToken(token);
    return {
      uid: decoded.uid,
      email: decoded.email ?? null,
      emailVerified: Boolean(decoded.email_verified),
    };
  } catch (error) {
    console.error("firebase_verify_failed", {
      type: error instanceof Error ? error.name : "unknown",
    });
    return null;
  }
}
