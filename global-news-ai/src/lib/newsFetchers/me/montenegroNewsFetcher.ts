
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
import { fetchVijestiFetcher } from "./vijestiFetcher";
import { fetchCDMFetcher } from "./cDMFetcher";

export async function fetchMontenegroNews(): Promise<void> {
  const countryCode = "ME";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);

  if (!countryConfig) {
    console.error(`[fetchMontenegroNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }
  console.log(`📰🇲🇪 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    let specificScraperCalled = false;
    try {
      console.log(`[fetchMontenegroNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Vijesti") {
        newsItems = await fetchVijestiFetcher();
        specificScraperCalled = true;
      } else if (source.name === "CDM") {
        newsItems = await fetchCDMFetcher();
        specificScraperCalled = true;
      } else {
        console.warn(`[fetchMontenegroNews] No specific scraper implemented in orchestrator for ${source.name}. Skipping.`);
      }

      if (specificScraperCalled) {
          successfulSourceFetches++;
          if (newsItems.length > 0) {
            allFetchedNews.push(...newsItems);
            console.log(`[fetchMontenegroNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
          } else {
            console.log(`[fetchMontenegroNews] No articles fetched from ${source.name} (scraper called).`);
          }
      }
    } catch (error) {
      console.error(`[fetchMontenegroNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchMontenegroNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchMontenegroNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchMontenegroNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchMontenegroNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }

  console.log(`[fetchMontenegroNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
    