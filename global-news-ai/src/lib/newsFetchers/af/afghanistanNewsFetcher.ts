
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import specific scrapers for Afghan sources
import { fetchToloNewsFetcher } from "./toloNewsFetcher";
import { fetchPajhwokFetcher } from "./pajhwokFetcher";

export async function fetchAfghanistanNews(): Promise<void> {
  const countryCode = "AF";
  console.log(`📰🇦🇫 Starting to fetch news for ${countryCode}...`);
  const allFetchedAfghanistanNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const afghanistanConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!afghanistanConfig) {
    console.error(`[fetchAfghanistanNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of afghanistanConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchAfghanistanNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "TOLOnews") {
        newsItems = await fetchToloNewsFetcher();
      } else if (source.name === "Pajhwok Afghan News") {
        newsItems = await fetchPajhwokFetcher();
      } else {
        console.warn(`[fetchAfghanistanNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedAfghanistanNews.push(...newsItems);
        console.log(`[fetchAfghanistanNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchAfghanistanNews] No articles fetched from ${source.name}.`);
        // Count as successful if a known scraper was called, even if it returned 0 items
        if (source.name === "TOLOnews" || source.name === "Pajhwok Afghan News") { 
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchAfghanistanNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedAfghanistanNews.length > 0) {
    console.log(`[fetchAfghanistanNews] Submitting ${allFetchedAfghanistanNews.length} total Afghan articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedAfghanistanNews);
      console.log(`[fetchAfghanistanNews] All fetched Afghan news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchAfghanistanNews] Error submitting Afghan news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchAfghanistanNews] No new Afghan articles to submit to Firestore.`);
  }
  
  console.log(`[fetchAfghanistanNews] Finished fetching for ${countryCode}. Sources processed: ${afghanistanConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedAfghanistanNews.length}.`);
}

    