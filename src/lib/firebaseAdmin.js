import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

if (!global._firebaseAdminApp) {
  const adminApp = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
  global._firebaseAdminApp = adminApp;
}

export const adminAuth = getAdminAuth(global._firebaseAdminApp);
export const adminDb   = getAdminFirestore(global._firebaseAdminApp);
