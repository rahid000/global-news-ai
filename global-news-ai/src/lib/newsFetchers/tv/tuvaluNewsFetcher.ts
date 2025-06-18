
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
import { fetchRadioTuvaluFetcher } from "./radioTuvaluFetcher";

export async function fetchTuvaluNews(): Promise<void> {
  const countryCode = "TV";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);

  if (!countryConfig) {
    console.error(`[fetchTuvaluNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }
  console.log(`📰🇹🇻 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    let specificScraperCalled = false;
    try {
      console.log(`[fetchTuvaluNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Radio Tuvalu") {
        newsItems = await fetchRadioTuvaluFetcher();
        specificScraperCalled = true;
      } else {
        console.warn(`[fetchTuvaluNews] No specific scraper implemented in orchestrator for ${source.name}. Skipping.`);
      }

      if (specificScraperCalled) {
          successfulSourceFetches++;
          if (newsItems.length > 0) {
            allFetchedNews.push(...newsItems);
            console.log(`[fetchTuvaluNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
          } else {
            console.log(`[fetchTuvaluNews] No articles fetched from ${source.name} (scraper called).`);
          }
      }
    } catch (error) {
      console.error(`[fetchTuvaluNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchTuvaluNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchTuvaluNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchTuvaluNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchTuvaluNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }

  console.log(`[fetchTuvaluNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
    