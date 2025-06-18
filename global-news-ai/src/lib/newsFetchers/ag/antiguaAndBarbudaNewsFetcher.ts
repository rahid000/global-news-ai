
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Antiguan and Barbudan sources
import { fetchAntiguaObserverFetcher } from "./antiguaObserverFetcher";

export async function fetchAntiguaAndBarbudaNews(): Promise<void> {
  const countryCode = "AG";
  console.log(`📰🇦🇬 Starting to fetch news for ${countryCode}...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchAntiguaAndBarbudaNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchAntiguaAndBarbudaNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Antigua Observer") {
        newsItems = await fetchAntiguaObserverFetcher();
      } else {
        console.warn(`[fetchAntiguaAndBarbudaNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchAntiguaAndBarbudaNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchAntiguaAndBarbudaNews] No articles fetched from ${source.name}.`);
        if (source.name === "Antigua Observer") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchAntiguaAndBarbudaNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchAntiguaAndBarbudaNews] Submitting ${allFetchedNews.length} total Antiguan and Barbudan articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchAntiguaAndBarbudaNews] All fetched Antiguan and Barbudan news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchAntiguaAndBarbudaNews] Error submitting Antiguan and Barbudan news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchAntiguaAndBarbudaNews] No new Antiguan and Barbudan articles to submit to Firestore.`);
  }
  
  console.log(`[fetchAntiguaAndBarbudaNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
