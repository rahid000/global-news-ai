
import admin from 'firebase-admin';

// Configuration for Firebase Admin SDK
// Ensure that NEXT_PUBLIC_FIREBASE_PROJECT_ID is set in your environment variables.
// For local development, you might need to set GOOGLE_APPLICATION_CREDENTIALS
// to point to your service account key JSON file.
// In Firebase/Google Cloud hosted environments, the SDK often initializes with default credentials.
const firebaseAdminConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // If using a service account key file locally:
  // credential: admin.credential.cert(require('./path/to/your/serviceAccountKey.json')),
};

export function initFirebaseAdmin() {
  if (!admin.apps.length) {
    try {
      admin.initializeApp(firebaseAdminConfig);
      console.log("Firebase Admin SDK initialized successfully.");
    } catch (error: any) {
      console.error("Firebase Admin SDK initialization error:", error.message);
      // Provide more specific advice if common errors occur
      if (error.code === 'app/duplicate-app') {
        console.warn("Firebase Admin SDK already initialized.");
      } else if (error.message.includes("GOOGLE_APPLICATION_CREDENTIALS")) {
         console.error("Ensure GOOGLE_APPLICATION_CREDENTIALS environment variable is set correctly for local development if not using default credentials.");
      } else if (error.message.includes("project ID")) {
         console.error("Ensure NEXT_PUBLIC_FIREBASE_PROJECT_ID is set in your environment variables.");
      }
    }
  }
  return admin;
}
