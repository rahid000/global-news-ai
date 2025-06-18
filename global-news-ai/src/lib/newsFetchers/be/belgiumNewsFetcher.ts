
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Belgian sources
import { fetchRTBFFetcher } from "./rTBFFetcher";
import { fetchVRTFetcher } from "./vRTFetcher";

export async function fetchBelgiumNews(): Promise<void> {
  const countryCode = "BE";
  console.log(`📰🇧🇪 Starting to fetch news for ${countryCode}...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchBelgiumNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchBelgiumNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "RTBF") {
        newsItems = await fetchRTBFFetcher();
      } else if (source.name === "VRT") {
        newsItems = await fetchVRTFetcher();
      } else {
        console.warn(`[fetchBelgiumNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchBelgiumNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchBelgiumNews] No articles fetched from ${source.name}.`);
        if (source.name === "RTBF" || source.name === "VRT") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchBelgiumNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchBelgiumNews] Submitting ${allFetchedNews.length} total Belgian articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchBelgiumNews] All fetched Belgian news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchBelgiumNews] Error submitting Belgian news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchBelgiumNews] No new Belgian articles to submit to Firestore.`);
  }
  
  console.log(`[fetchBelgiumNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}

    