
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
import { fetchIraqiNewsFetcher } from "./iraqiNewsFetcher";
import { fetchRudawFetcher } from "./rudawFetcher";

export async function fetchIraqNews(): Promise<void> {
  const countryCode = "IQ";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchIraqNews] Configuration for ${countryCode} not found.`);
    return;
  }
  console.log(`📰🇮🇶 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    let specificScraperCalled = false;
    try {
      console.log(`[fetchIraqNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Iraqi News") {
        newsItems = await fetchIraqiNewsFetcher();
        specificScraperCalled = true;
      } else if (source.name === "Rudaw") {
        newsItems = await fetchRudawFetcher();
        specificScraperCalled = true;
      } else {
        console.warn(`[fetchIraqNews] No specific scraper implemented in orchestrator for ${source.name}. Skipping.`);
      }

      if (specificScraperCalled) {
        successfulSourceFetches++;
        if (newsItems.length > 0) {
          allFetchedNews.push(...newsItems);
          console.log(`[fetchIraqNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        } else {
          console.log(`[fetchIraqNews] No articles fetched from ${source.name} (scraper called).`);
        }
      }
    } catch (error) {
      console.error(`[fetchIraqNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchIraqNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchIraqNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchIraqNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchIraqNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }
  
  console.log(`[fetchIraqNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
