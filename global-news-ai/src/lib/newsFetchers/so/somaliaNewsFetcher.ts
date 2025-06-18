
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Note: Somalia sources are not explicitly listed in the provided JSON snippet for "newsSourcesConfig".
// Assuming "Radio Mogadishu" and "Garowe Online" as common examples for placeholder generation.
// You will need to add the actual sources to newsSourcesConfig.ts for Somalia
// and then create scrapers for them. For now, this will log that no sources are configured if they are missing.

// Example if sources were "Radio Mogadishu" and "Garowe Online":
// import { fetchRadioMogadishuFetcher } from "./radioMogadishuFetcher";
// import { fetchGaroweOnlineFetcher } from "./garoweOnlineFetcher";

export async function fetchSomaliaNews(): Promise<void> {
  const countryCode = "SO";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);

  if (!countryConfig) {
    console.error(`[fetchSomaliaNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }
  console.log(`📰🇸🇴 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  if (countryConfig.sources.length === 0) {
    console.warn(`[fetchSomaliaNews] No news sources configured for ${countryConfig.countryName} (${countryCode}). Add sources to newsSourcesConfig.ts.`);
  }

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    let specificScraperCalled = false;
    try {
      console.log(`[fetchSomaliaNews] Fetching from ${source.name} (${source.url})...`);
      // Add if/else if blocks here for actual scrapers once defined
      // Example:
      // if (source.name === "Radio Mogadishu") {
      //   newsItems = await fetchRadioMogadishuFetcher();
      //   specificScraperCalled = true;
      // } else {
      //   console.warn(`[fetchSomaliaNews] No specific scraper implemented in orchestrator for ${source.name}. Skipping.`);
      // }
      console.warn(`[fetchSomaliaNews] Placeholder: Scraper for ${source.name} needs to be implemented and called.`);
      specificScraperCalled = true; // Assuming a placeholder call

      if (specificScraperCalled) {
          successfulSourceFetches++;
          if (newsItems.length > 0) {
            allFetchedNews.push(...newsItems);
            console.log(`[fetchSomaliaNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
          } else {
            console.log(`[fetchSomaliaNews] No articles fetched from ${source.name} (scraper called).`);
          }
      }
    } catch (error) {
      console.error(`[fetchSomaliaNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchSomaliaNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchSomaliaNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchSomaliaNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchSomaliaNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }

  console.log(`[fetchSomaliaNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
    