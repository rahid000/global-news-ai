
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Belarusian sources
import { fetchBelTAFetcher } from "./belTAFetcher";
import { fetchTUTBYFetcher } from "./tUTBYFetcher";

export async function fetchBelarusNews(): Promise<void> {
  const countryCode = "BY";
  console.log(`📰🇧🇾 Starting to fetch news for ${countryCode}...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchBelarusNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchBelarusNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "BelTA") {
        newsItems = await fetchBelTAFetcher();
      } else if (source.name === "TUT.BY") {
        newsItems = await fetchTUTBYFetcher();
      } else {
        console.warn(`[fetchBelarusNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchBelarusNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchBelarusNews] No articles fetched from ${source.name}.`);
        if (source.name === "BelTA" || source.name === "TUT.BY") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchBelarusNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchBelarusNews] Submitting ${allFetchedNews.length} total Belarusian articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchBelarusNews] All fetched Belarusian news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchBelarusNews] Error submitting Belarusian news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchBelarusNews] No new Belarusian articles to submit to Firestore.`);
  }
  
  console.log(`[fetchBelarusNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}

    