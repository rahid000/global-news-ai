
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Argentinian sources
import { fetchClarínFetcher } from "./clarínFetcher";
import { fetchLaNaciónFetcher } from "./laNaciónFetcher";

export async function fetchArgentinaNews(): Promise<void> {
  const countryCode = "AR";
  console.log(`📰🇦🇷 Starting to fetch news for ${countryCode}...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchArgentinaNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchArgentinaNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Clarín") {
        newsItems = await fetchClarínFetcher();
      } else if (source.name === "La Nación") {
        newsItems = await fetchLaNaciónFetcher();
      } else {
        console.warn(`[fetchArgentinaNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchArgentinaNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchArgentinaNews] No articles fetched from ${source.name}.`);
        // Count as successful if a known scraper was called, even if it returned 0 items
        if (source.name === "Clarín" || source.name === "La Nación") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchArgentinaNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchArgentinaNews] Submitting ${allFetchedNews.length} total Argentinian articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchArgentinaNews] All fetched Argentinian news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchArgentinaNews] Error submitting Argentinian news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchArgentinaNews] No new Argentinian articles to submit to Firestore.`);
  }
  
  console.log(`[fetchArgentinaNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}

    