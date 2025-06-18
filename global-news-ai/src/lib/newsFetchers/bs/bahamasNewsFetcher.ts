
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Bahamian sources
import { fetchTheNassauGuardianFetcher } from "./theNassauGuardianFetcher";
import { fetchTheTribuneFetcher } from "./theTribuneFetcher";

export async function fetchBahamasNews(): Promise<void> {
  const countryCode = "BS";
  console.log(`📰🇧🇸 Starting to fetch news for ${countryCode}...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchBahamasNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchBahamasNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "The Nassau Guardian") {
        newsItems = await fetchTheNassauGuardianFetcher();
      } else if (source.name === "The Tribune") {
        newsItems = await fetchTheTribuneFetcher();
      } else {
        console.warn(`[fetchBahamasNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchBahamasNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchBahamasNews] No articles fetched from ${source.name}.`);
        if (source.name === "The Nassau Guardian" || source.name === "The Tribune") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchBahamasNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchBahamasNews] Submitting ${allFetchedNews.length} total Bahamian articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchBahamasNews] All fetched Bahamian news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchBahamasNews] Error submitting Bahamian news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchBahamasNews] No new Bahamian articles to submit to Firestore.`);
  }
  
  console.log(`[fetchBahamasNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}

    