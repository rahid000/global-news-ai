
import { DateTime } from "luxon";
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils"; 
import { fetchProthomAloNews } from "./fetchProthomAloNews";
// Import other Bangladesh news source fetchers here
// import { fetchBdNews24 } from "./fetchBdNews24";

// Define which fetcher functions to run for Bangladesh
const bangladeshNewsSourceFetchers = [
  fetchProthomAloNews,
  // fetchBdNews24, 
  // Add more fetcher functions here
];

export async function fetchBangladeshNews(): Promise<void> {
  console.log("📰🇧🇩 Starting to fetch news for Bangladesh...");
  const allFetchedBangladeshNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const fetcher of bangladeshNewsSourceFetchers) {
    try {
      // Get the name of the fetcher function for logging if possible
      const fetcherName = fetcher.name || 'anonymousFetcher';
      console.log(`[fetchBangladeshNews] Fetching from source via ${fetcherName}...`);
      
      const newsItems = await fetcher(); // Each fetcher should return Omit<NewsItem, 'id' | 'countryCode'>[]
      
      if (newsItems.length > 0) {
        allFetchedBangladeshNews.push(...newsItems);
        console.log(`[fetchBangladeshNews] Successfully fetched ${newsItems.length} articles from ${fetcherName}.`);
      } else {
        console.log(`[fetchBangladeshNews] No articles fetched from ${fetcherName}.`);
      }
      successfulSourceFetches++;
    } catch (error) {
      const fetcherName = fetcher.name || 'anonymousFetcher';
      console.error(`[fetchBangladeshNews] Error fetching news from ${fetcherName}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedBangladeshNews.length > 0) {
    console.log(`[fetchBangladeshNews] Submitting ${allFetchedBangladeshNews.length} total Bangladeshi articles to Firestore using Admin SDK...`);
    try {
      // The saveMultipleNewsItemsToFirestore function will add 'id' and 'countryCode'
      await saveMultipleNewsItemsToFirestore("BD", allFetchedBangladeshNews);
      console.log('[fetchBangladeshNews] All fetched Bangladeshi news items submitted to Firestore.');
    } catch (error) {
      console.error('[fetchBangladeshNews] Error submitting Bangladeshi news items to Firestore:', error);
    }
  } else {
    console.log('[fetchBangladeshNews] No new Bangladeshi articles to submit to Firestore.');
  }
  
  console.log(`[fetchBangladeshNews] Finished fetching for Bangladesh. Successful source fetches: ${successfulSourceFetches}, Failed source fetches: ${failedSourceFetches}, Total articles for submission: ${allFetchedBangladeshNews.length}.`);
}
