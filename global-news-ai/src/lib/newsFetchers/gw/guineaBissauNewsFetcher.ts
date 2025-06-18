
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
import { fetchODemocrataGBFetcher } from "./oDemocrataGBFetcher";
import { fetchGBissauFetcher } from "./gbissauFetcher";

export async function fetchGuineaBissauNews(): Promise<void> {
  const countryCode = "GW";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchGuineaBissauNews] Configuration for ${countryCode} not found.`);
    return;
  }
  console.log(`📰🇬🇼 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    let specificScraperCalled = false;
    try {
      console.log(`[fetchGuineaBissauNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "O Democrata") {
        newsItems = await fetchODemocrataGBFetcher();
        specificScraperCalled = true;
      } else if (source.name === "GBissau") {
        newsItems = await fetchGBissauFetcher();
        specificScraperCalled = true;
      } else {
        console.warn(`[fetchGuineaBissauNews] No specific scraper implemented in orchestrator for ${source.name}. Skipping.`);
      }

      if (specificScraperCalled) {
        successfulSourceFetches++;
        if (newsItems.length > 0) {
          allFetchedNews.push(...newsItems);
          console.log(`[fetchGuineaBissauNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        } else {
          console.log(`[fetchGuineaBissauNews] No articles fetched from ${source.name} (scraper called).`);
        }
      }
    } catch (error) {
      console.error(`[fetchGuineaBissauNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchGuineaBissauNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchGuineaBissauNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchGuineaBissauNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchGuineaBissauNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }
  
  console.log(`[fetchGuineaBissauNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
