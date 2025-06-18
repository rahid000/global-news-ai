
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Armenian sources
import { fetchArmenpressFetcher } from "./armenpressFetcher";
import { fetchPanARMENIANNetFetcher } from "./panARMENIANNetFetcher";

export async function fetchArmeniaNews(): Promise<void> {
  const countryCode = "AM";
  console.log(`📰🇦🇲 Starting to fetch news for ${countryCode}...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchArmeniaNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchArmeniaNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Armenpress") {
        newsItems = await fetchArmenpressFetcher();
      } else if (source.name === "PanARMENIAN.Net") {
        newsItems = await fetchPanARMENIANNetFetcher();
      } else {
        console.warn(`[fetchArmeniaNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchArmeniaNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchArmeniaNews] No articles fetched from ${source.name}.`);
        if (source.name === "Armenpress" || source.name === "PanARMENIAN.Net") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchArmeniaNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchArmeniaNews] Submitting ${allFetchedNews.length} total Armenian articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchArmeniaNews] All fetched Armenian news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchArmeniaNews] Error submitting Armenian news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchArmeniaNews] No new Armenian articles to submit to Firestore.`);
  }
  
  console.log(`[fetchArmeniaNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}

    