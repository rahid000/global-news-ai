
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
import { fetchActuNigerFetcher } from "./actuNigerFetcher";
import { fetchLeSahelFetcher } from "./leSahelFetcher";

export async function fetchNigerNews(): Promise<void> {
  const countryCode = "NE";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);

  if (!countryConfig) {
    console.error(`[fetchNigerNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }
  console.log(`📰🇳🇪 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    let specificScraperCalled = false;
    try {
      console.log(`[fetchNigerNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "ActuNiger") {
        newsItems = await fetchActuNigerFetcher();
        specificScraperCalled = true;
      } else if (source.name === "Le Sahel") {
        newsItems = await fetchLeSahelFetcher();
        specificScraperCalled = true;
      } else {
        console.warn(`[fetchNigerNews] No specific scraper implemented in orchestrator for ${source.name}. Skipping.`);
      }

      if (specificScraperCalled) {
          successfulSourceFetches++;
          if (newsItems.length > 0) {
            allFetchedNews.push(...newsItems);
            console.log(`[fetchNigerNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
          } else {
            console.log(`[fetchNigerNews] No articles fetched from ${source.name} (scraper called).`);
          }
      }
    } catch (error) {
      console.error(`[fetchNigerNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchNigerNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchNigerNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchNigerNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchNigerNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }

  console.log(`[fetchNigerNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
    