
import type { Firestore } from 'firebase-admin/firestore';
import { initFirebaseAdmin } from './initFirebaseAdmin';
import type { NewsItem } from './types/NewsItem'; // Assuming NewsItem type is defined

// Initialize Firebase Admin SDK when this module is loaded
const admin = initFirebaseAdmin();
let db: Firestore;

try {
  db = admin.firestore();
} catch (error) {
    console.error("Failed to get Firestore instance from Firebase Admin SDK:", error);
    // Fallback or error handling strategy if db cannot be initialized
    // For now, operations will fail if db is not initialized.
}


export async function saveNewsItemToFirestore(countryCode: string, newsArticle: Omit<NewsItem, 'id' | 'countryCode'>): Promise<string | null> {
  if (!db) {
    console.error("Firestore Admin DB is not initialized. Skipping saveNewsItemToFirestore.");
    return null;
  }

  try {
    const newsCollectionRef = db.collection("news");
    
    // Check for duplicates by URL before adding
    const q = newsCollectionRef.where("url", "==", newsArticle.url);
    const snapshot = await q.get();
    if (!snapshot.empty) {
      console.log(`ℹ️ News item already exists in Firestore (URL match): ${newsArticle.title} (${newsArticle.url})`);
      // Return the ID of the existing document if needed, or just null/undefined
      return snapshot.docs[0].id; 
    }

    const docRef = newsCollectionRef.doc(); // Auto-generate ID
    const itemToSave: NewsItem = {
      ...newsArticle,
      id: docRef.id,
      countryCode: countryCode,
    };
    await docRef.set(itemToSave);
    console.log(`✅ Saved to Firestore (Admin): ${itemToSave.title} (ID: ${docRef.id})`);
    return docRef.id;
  } catch (error) {
    console.error(`Error saving news item to Firestore (Admin): ${newsArticle.title}`, error);
    return null;
  }
}

export async function saveMultipleNewsItemsToFirestore(countryCode: string, newsArticles: Omit<NewsItem, 'id' | 'countryCode'>[]): Promise<void> {
  if (!db) {
    console.error("Firestore Admin DB is not initialized. Skipping saveMultipleNewsItemsToFirestore.");
    return;
  }
  if (!newsArticles || newsArticles.length === 0) {
    return;
  }
  console.log(`Attempting to save ${newsArticles.length} news items for country ${countryCode} using Admin SDK.`);
  for (const newsArticle of newsArticles) {
    await saveNewsItemToFirestore(countryCode, newsArticle);
  }
  console.log(`Finished saving multiple news items for ${countryCode}.`);
}

// The user originally provided this function structure:
// export async function saveNewsToFirestore(countryCode: string, news: any) {
//   if (!db) {
//     console.error("Firestore Admin DB is not initialized. Skipping saveNewsToFirestore.");
//     return;
//   }
//   const ref = db.collection("news").doc();
//   try {
//     await ref.set({
//       ...news, // news should contain title, summary, verified, createdAt, source
//       countryCode,
//       id: ref.id,
//     });
//     console.log(`✅ Saved (Admin): ${news.title} (ID: ${ref.id}) to news collection for ${countryCode}`);
//   } catch (error) {
//      console.error(`Error saving news to Firestore (Admin) for ${countryCode}, title: ${news.title}:`, error);
//   }
// }
// I've opted for a more strongly typed version above (saveNewsItemToFirestore)
// that aligns with the NewsItem type.
