
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
import { fetchPragueMorningFetcher } from "./pragueMorningFetcher";
import { fetchCzechNewsAgencyFetcher } from "./czechNewsAgencyFetcher";

export async function fetchCzechRepublicNews(): Promise<void> {
  const countryCode = "CZ";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchCzechRepublicNews] Configuration for ${countryCode} not found.`);
    return;
  }
  console.log(`📰🇨🇿 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchCzechRepublicNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Prague Morning") {
        newsItems = await fetchPragueMorningFetcher();
      } else if (source.name === "Czech News Agency") {
        newsItems = await fetchCzechNewsAgencyFetcher();
      } else {
        console.warn(`[fetchCzechRepublicNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchCzechRepublicNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchCzechRepublicNews] No articles fetched from ${source.name}.`);
        if (["Prague Morning", "Czech News Agency"].includes(source.name)) {
            successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchCzechRepublicNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchCzechRepublicNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchCzechRepublicNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchCzechRepublicNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchCzechRepublicNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }

  console.log(`[fetchCzechRepublicNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
