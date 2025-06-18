
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
import { fetchJutarnjiListFetcher } from "./jutarnjiListFetcher";
import { fetchVecernjiListFetcher } from "./vecernjiListFetcher";

export async function fetchCroatiaNews(): Promise<void> {
  const countryCode = "HR";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchCroatiaNews] Configuration for ${countryCode} not found.`);
    return;
  }
  console.log(`📰🇭🇷 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchCroatiaNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Jutarnji List") {
        newsItems = await fetchJutarnjiListFetcher();
      } else if (source.name === "Vecernji List") {
        newsItems = await fetchVecernjiListFetcher();
      } else {
        console.warn(`[fetchCroatiaNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchCroatiaNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchCroatiaNews] No articles fetched from ${source.name}.`);
        if (["Jutarnji List", "Vecernji List"].includes(source.name)) {
            successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchCroatiaNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchCroatiaNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchCroatiaNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchCroatiaNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchCroatiaNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }

  console.log(`[fetchCroatiaNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
