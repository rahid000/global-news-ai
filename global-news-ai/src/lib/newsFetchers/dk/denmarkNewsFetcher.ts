
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
import { fetchDRFetcher } from "./drFetcher";
import { fetchTheCopenhagenPostFetcher } from "./theCopenhagenPostFetcher";

export async function fetchDenmarkNews(): Promise<void> {
  const countryCode = "DK";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchDenmarkNews] Configuration for ${countryCode} not found.`);
    return;
  }
  console.log(`📰🇩🇰 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchDenmarkNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "DR") {
        newsItems = await fetchDRFetcher();
      } else if (source.name === "The Copenhagen Post") {
        newsItems = await fetchTheCopenhagenPostFetcher();
      } else {
        console.warn(`[fetchDenmarkNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchDenmarkNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchDenmarkNews] No articles fetched from ${source.name}.`);
        if (["DR", "The Copenhagen Post"].includes(source.name)) {
            successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchDenmarkNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchDenmarkNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchDenmarkNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchDenmarkNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchDenmarkNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }

  console.log(`[fetchDenmarkNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
