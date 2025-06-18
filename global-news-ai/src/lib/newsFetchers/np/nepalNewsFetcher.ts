
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
import { fetchTheKathmanduPostFetcher } from "./theKathmanduPostFetcher";
import { fetchTheHimalayanTimesFetcher } from "./theHimalayanTimesFetcher";

export async function fetchNepalNews(): Promise<void> {
  const countryCode = "NP";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);

  if (!countryConfig) {
    console.error(`[fetchNepalNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }
  console.log(`📰🇳🇵 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    let specificScraperCalled = false;
    try {
      console.log(`[fetchNepalNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "The Kathmandu Post") {
        newsItems = await fetchTheKathmanduPostFetcher();
        specificScraperCalled = true;
      } else if (source.name === "The Himalayan Times") {
        newsItems = await fetchTheHimalayanTimesFetcher();
        specificScraperCalled = true;
      } else {
        console.warn(`[fetchNepalNews] No specific scraper implemented in orchestrator for ${source.name}. Skipping.`);
      }

      if (specificScraperCalled) {
          successfulSourceFetches++;
          if (newsItems.length > 0) {
            allFetchedNews.push(...newsItems);
            console.log(`[fetchNepalNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
          } else {
            console.log(`[fetchNepalNews] No articles fetched from ${source.name} (scraper called).`);
          }
      }
    } catch (error) {
      console.error(`[fetchNepalNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchNepalNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchNepalNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchNepalNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchNepalNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }

  console.log(`[fetchNepalNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
    