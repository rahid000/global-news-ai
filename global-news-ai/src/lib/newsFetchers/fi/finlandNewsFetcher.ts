
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import specific scrapers for Finnish sources
import { fetchYleNewsFetcher } from "./yleNewsFetcher";
import { fetchHelsinginSanomatFetcher } from "./helsinginSanomatFetcher";

export async function fetchFinlandNews(): Promise<void> {
  const countryCode = "FI";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchFinlandNews] Configuration for ${countryCode} not found.`);
    return;
  }
  console.log(`📰🇫🇮 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    let specificScraperCalled = false;
    try {
      console.log(`[fetchFinlandNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Yle News") {
        newsItems = await fetchYleNewsFetcher();
        specificScraperCalled = true;
      } else if (source.name === "Helsingin Sanomat") {
        newsItems = await fetchHelsinginSanomatFetcher();
        specificScraperCalled = true;
      } else {
        console.warn(`[fetchFinlandNews] No specific scraper implemented in orchestrator for ${source.name}. Skipping.`);
      }

      if (specificScraperCalled) {
        successfulSourceFetches++;
        if (newsItems.length > 0) {
          allFetchedNews.push(...newsItems);
          console.log(`[fetchFinlandNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        } else {
          console.log(`[fetchFinlandNews] No articles fetched from ${source.name} (scraper called).`);
        }
      }
    } catch (error) {
      console.error(`[fetchFinlandNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchFinlandNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchFinlandNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchFinlandNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchFinlandNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }
  
  console.log(`[fetchFinlandNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
