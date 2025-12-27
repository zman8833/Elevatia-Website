import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminDb: Firestore;
let adminAuth: Auth;

// Only initialize if we have the required env vars
const hasConfig = 
  process.env.FIREBASE_PROJECT_ID && 
  process.env.FIREBASE_CLIENT_EMAIL && 
  process.env.FIREBASE_PRIVATE_KEY;

if (hasConfig) {
  let app: App;

  if (!getApps().length) {
    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } else {
    app = getApps()[0];
  }

  adminDb = getFirestore(app);
  adminAuth = getAuth(app);
}

// Super admin UID - can extend to check a superAdmins collection later
const SUPER_ADMIN_UID = process.env.SUPER_ADMIN_UID || '';

export { adminDb, adminAuth, SUPER_ADMIN_UID };

