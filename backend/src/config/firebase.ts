import admin from 'firebase-admin';
import { logger } from '../utils/logger';

let db: admin.firestore.Firestore;

export const initializeFirebase = async () => {
  try {
    // Initialize Firebase Admin SDK
    if (!admin.apps.length) {
      const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
        ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
        : require('../../firebase-service-account.json'); // Fallback for development

      const config: any = {
        credential: admin.credential.cert(serviceAccount),
      };
      
      if (process.env.FIREBASE_DATABASE_URL) {
        config.databaseURL = process.env.FIREBASE_DATABASE_URL;
      }
      
      admin.initializeApp(config);
    }

    db = admin.firestore();
    
    // Test connection
    await db.collection('_health').doc('test').set({ timestamp: new Date() });
    logger.info('Firebase Firestore connection successful');
    
  } catch (error) {
    logger.error('Firebase initialization failed:', error);
    throw error;
  }
};

export const getFirestore = () => {
  if (!db) {
    throw new Error('Firestore not initialized. Call initializeFirebase() first.');
  }
  return db;
};

export { admin };