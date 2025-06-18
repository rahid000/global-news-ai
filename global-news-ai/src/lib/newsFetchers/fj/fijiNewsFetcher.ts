
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import specific scrapers for Fijian sources
import { fetchFijiSunFetcher } from "./fijiSunFetcher";
import { fetchFijiTimesFetcher } from "./fijiTimesFetcher";

export async function fetchFijiNews(): Promise<void> {
  const countryCode = "FJ";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchFijiNews] Configuration for ${countryCode} not found.`);
    return;
  }
  console.log(`📰🇫🇯 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    let specificScraperCalled = false;
    try {
      console.log(`[fetchFijiNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Fiji Sun") {
        newsItems = await fetchFijiSunFetcher();
        specificScraperCalled = true;
      } else if (source.name === "Fiji Times") {
        newsItems = await fetchFijiTimesFetcher();
        specificScraperCalled = true;
      } else {
        console.warn(`[fetchFijiNews] No specific scraper implemented in orchestrator for ${source.name}. Skipping.`);
      }

      if (specificScraperCalled) {
        successfulSourceFetches++;
        if (newsItems.length > 0) {
          allFetchedNews.push(...newsItems);
          console.log(`[fetchFijiNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        } else {
          console.log(`[fetchFijiNews] No articles fetched from ${source.name} (scraper called).`);
        }
      }
    } catch (error) {
      console.error(`[fetchFijiNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchFijiNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchFijiNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchFijiNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchFijiNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }
  
  console.log(`[fetchFijiNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
