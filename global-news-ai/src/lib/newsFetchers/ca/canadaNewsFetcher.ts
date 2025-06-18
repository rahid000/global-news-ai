
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Canadian sources
import { fetchCBCFetcher } from "./cBCFetcher";
import { fetchCTVNewsFetcher } from "./cTVNewsFetcher";

export async function fetchCanadaNews(): Promise<void> {
  const countryCode = "CA";
  console.log(`📰🇨🇦 Starting to fetch news for ${countryCode}...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchCanadaNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchCanadaNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "CBC") {
        newsItems = await fetchCBCFetcher();
      } else if (source.name === "CTV News") {
        newsItems = await fetchCTVNewsFetcher();
      } else {
        console.warn(`[fetchCanadaNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchCanadaNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchCanadaNews] No articles fetched from ${source.name}.`);
        if (source.name === "CBC" || source.name === "CTV News") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchCanadaNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchCanadaNews] Submitting ${allFetchedNews.length} total Canadian articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchCanadaNews] All fetched Canadian news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchCanadaNews] Error submitting Canadian news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchCanadaNews] No new Canadian articles to submit to Firestore.`);
  }
  
  console.log(`[fetchCanadaNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}

    