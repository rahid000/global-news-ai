
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Belizean sources
import { fetchAmandalaFetcher } from "./amandalaFetcher";
import { fetchBreakingBelizeNewsFetcher } from "./breakingBelizeNewsFetcher";

export async function fetchBelizeNews(): Promise<void> {
  const countryCode = "BZ";
  console.log(`📰🇧🇿 Starting to fetch news for ${countryCode}...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchBelizeNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchBelizeNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Amandala") {
        newsItems = await fetchAmandalaFetcher();
      } else if (source.name === "Breaking Belize News") {
        newsItems = await fetchBreakingBelizeNewsFetcher();
      } else {
        console.warn(`[fetchBelizeNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchBelizeNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchBelizeNews] No articles fetched from ${source.name}.`);
        if (source.name === "Amandala" || source.name === "Breaking Belize News") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchBelizeNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchBelizeNews] Submitting ${allFetchedNews.length} total Belizean articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchBelizeNews] All fetched Belizean news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchBelizeNews] Error submitting Belizean news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchBelizeNews] No new Belizean articles to submit to Firestore.`);
  }
  
  console.log(`[fetchBelizeNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}

    