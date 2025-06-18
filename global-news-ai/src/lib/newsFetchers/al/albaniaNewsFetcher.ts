
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Albanian sources
import { fetchBalkanWebFetcher } from "./balkanWebFetcher";
import { fetchAlbanianDailyNewsFetcher } from "./albanianDailyNewsFetcher";

export async function fetchAlbaniaNews(): Promise<void> {
  const countryCode = "AL";
  console.log(`📰🇦🇱 Starting to fetch news for ${countryCode}...`);
  const allFetchedAlbaniaNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const albaniaConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!albaniaConfig) {
    console.error(`[fetchAlbaniaNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of albaniaConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchAlbaniaNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "BalkanWeb") {
        newsItems = await fetchBalkanWebFetcher();
      } else if (source.name === "Albanian Daily News") {
        newsItems = await fetchAlbanianDailyNewsFetcher();
      } else {
        console.warn(`[fetchAlbaniaNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedAlbaniaNews.push(...newsItems);
        console.log(`[fetchAlbaniaNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchAlbaniaNews] No articles fetched from ${source.name}.`);
        // Count implemented (even if they return 0) or attempted fetches
        if (source.name === "BalkanWeb" || source.name === "Albanian Daily News") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchAlbaniaNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedAlbaniaNews.length > 0) {
    console.log(`[fetchAlbaniaNews] Submitting ${allFetchedAlbaniaNews.length} total Albanian articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedAlbaniaNews);
      console.log(`[fetchAlbaniaNews] All fetched Albanian news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchAlbaniaNews] Error submitting Albanian news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchAlbaniaNews] No new Albanian articles to submit to Firestore.`);
  }
  
  console.log(`[fetchAlbaniaNews] Finished fetching for ${countryCode}. Sources processed: ${albaniaConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedAlbaniaNews.length}.`);
}
