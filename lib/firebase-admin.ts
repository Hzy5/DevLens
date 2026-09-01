import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRemoteJWKSet, jwtVerify } from "jose";

function adminCredentials() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL?.trim();
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n",
  ).replace(/^["']|["']$/g, "");

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

const googleSecureTokenJwks = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
  ),
);

function getAdminApp(): App | null {
  try {
    if (getApps().length) {
      return getApps()[0] ?? null;
    }

    const credentials = adminCredentials();
    if (!credentials) return null;

    return initializeApp({
      credential: cert(credentials),
    });
  } catch (error) {
    console.error("firebase_admin_init_failed", {
      type: error instanceof Error ? error.name : "unknown",
    });
    return null;
  }
}

export function getAdminDb() {
  try {
    if (!adminCredentials()) return null;
    const app = getAdminApp();
    return app ? getFirestore(app) : null;
  } catch (error) {
    console.error("firebase_admin_db_failed", {
      type: error instanceof Error ? error.name : "unknown",
    });
    return null;
  }
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

  const projectId = adminProjectId();
  if (!projectId) return null;

  try {
    const { payload } = await jwtVerify(token, googleSecureTokenJwks, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
      clockTolerance: 5,
    });

    const uid = typeof payload.sub === "string" ? payload.sub : "";
    if (!uid) return null;

    return {
      uid,
      email: typeof payload.email === "string" ? payload.email : null,
      emailVerified: payload.email_verified === true,
    };
  } catch (error) {
    console.error("firebase_verify_failed", {
      type: error instanceof Error ? error.name : "unknown",
    });
    return null;
  }
}
