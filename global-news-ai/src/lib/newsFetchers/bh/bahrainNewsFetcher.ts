
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Bahraini sources
import { fetchGulfDailyNewsFetcher } from "./gulfDailyNewsFetcher";
import { fetchBahrainNewsAgencyFetcher } from "./bahrainNewsAgencyFetcher";

export async function fetchBahrainNews(): Promise<void> {
  const countryCode = "BH";
  console.log(`📰🇧🇭 Starting to fetch news for ${countryCode}...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchBahrainNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchBahrainNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Gulf Daily News") {
        newsItems = await fetchGulfDailyNewsFetcher();
      } else if (source.name === "Bahrain News Agency") {
        newsItems = await fetchBahrainNewsAgencyFetcher();
      } else {
        console.warn(`[fetchBahrainNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchBahrainNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchBahrainNews] No articles fetched from ${source.name}.`);
        if (source.name === "Gulf Daily News" || source.name === "Bahrain News Agency") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchBahrainNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchBahrainNews] Submitting ${allFetchedNews.length} total Bahraini articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchBahrainNews] All fetched Bahraini news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchBahrainNews] Error submitting Bahraini news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchBahrainNews] No new Bahraini articles to submit to Firestore.`);
  }
  
  console.log(`[fetchBahrainNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}

    