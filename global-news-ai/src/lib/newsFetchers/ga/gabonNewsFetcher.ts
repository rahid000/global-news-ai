
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import specific scrapers for Gabonese sources
import { fetchGabonReviewFetcher } from "./gabonReviewFetcher";
import { fetchLUnionGaFetcher } from "./lUnionGaFetcher";

export async function fetchGabonNews(): Promise<void> {
  const countryCode = "GA";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchGabonNews] Configuration for ${countryCode} not found.`);
    return;
  }
  console.log(`📰🇬🇦 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    let specificScraperCalled = false;
    try {
      console.log(`[fetchGabonNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Gabon Review") {
        newsItems = await fetchGabonReviewFetcher();
        specificScraperCalled = true;
      } else if (source.name === "L’Union") {
        newsItems = await fetchLUnionGaFetcher();
        specificScraperCalled = true;
      } else {
        console.warn(`[fetchGabonNews] No specific scraper implemented in orchestrator for ${source.name}. Skipping.`);
      }

      if (specificScraperCalled) {
        successfulSourceFetches++;
        if (newsItems.length > 0) {
          allFetchedNews.push(...newsItems);
          console.log(`[fetchGabonNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        } else {
          console.log(`[fetchGabonNews] No articles fetched from ${source.name} (scraper called).`);
        }
      }
    } catch (error) {
      console.error(`[fetchGabonNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchGabonNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchGabonNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchGabonNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchGabonNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }
  
  console.log(`[fetchGabonNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
