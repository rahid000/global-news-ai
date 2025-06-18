
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Azerbaijani sources
import { fetchAZERTACFetcher } from "./aZERTACFetcher";
import { fetchTrendNewsAgencyFetcher } from "./trendNewsAgencyFetcher";

export async function fetchAzerbaijanNews(): Promise<void> {
  const countryCode = "AZ";
  console.log(`📰🇦🇿 Starting to fetch news for ${countryCode}...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchAzerbaijanNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchAzerbaijanNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "AZERTAC") {
        newsItems = await fetchAZERTACFetcher();
      } else if (source.name === "Trend News Agency") {
        newsItems = await fetchTrendNewsAgencyFetcher();
      } else {
        console.warn(`[fetchAzerbaijanNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchAzerbaijanNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchAzerbaijanNews] No articles fetched from ${source.name}.`);
        if (source.name === "AZERTAC" || source.name === "Trend News Agency") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchAzerbaijanNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchAzerbaijanNews] Submitting ${allFetchedNews.length} total Azerbaijani articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchAzerbaijanNews] All fetched Azerbaijani news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchAzerbaijanNews] Error submitting Azerbaijani news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchAzerbaijanNews] No new Azerbaijani articles to submit to Firestore.`);
  }
  
  console.log(`[fetchAzerbaijanNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}

    