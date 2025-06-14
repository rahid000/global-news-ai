import { db } from "@/lib/firebase";
import type { NewsItem } from "@/lib/types/NewsItem";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

export async function submitNewsItem(news: NewsItem): Promise<void> {
  if (!db) {
    console.error("Firestore database is not initialized. Skipping submitNewsItem.");
    return;
  }
  const newsRef = collection(db, "news");

  // Avoid duplicate by checking URL
  const q = query(newsRef, where("url", "==", news.url));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    console.log("ℹ️ News item already exists (URL match):", news.title, news.url);
    return;
  }

  try {
    await addDoc(newsRef, news);
    console.log("✅ Submitted to Firestore:", news.title);
  } catch (error) {
    console.error("Error submitting news item to Firestore:", error, news);
  }
}

export async function submitMultipleNewsItems(newsItems: NewsItem[]): Promise<void> {
  if (!db) {
    console.error("Firestore database is not initialized. Skipping submitMultipleNewsItems.");
    return;
  }
  if (!newsItems || newsItems.length === 0) {
    return;
  }
  for (const newsItem of newsItems) {
    await submitNewsItem(newsItem);
  }
}
