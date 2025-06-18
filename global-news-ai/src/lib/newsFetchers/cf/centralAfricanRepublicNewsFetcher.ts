
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
import { fetchRadioNdekeLukaFetcher } from "./radioNdekeLukaFetcher";
import { fetchJournalDeBanguiFetcher } from "./journalDeBanguiFetcher";

export async function fetchCentralAfricanRepublicNews(): Promise<void> {
  const countryCode = "CF";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchCentralAfricanRepublicNews] Configuration for ${countryCode} not found.`);
    return;
  }
  console.log(`📰🇨🇫 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchCentralAfricanRepublicNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Radio Ndeke Luka") {
        newsItems = await fetchRadioNdekeLukaFetcher();
      } else if (source.name === "Journal de Bangui") {
        newsItems = await fetchJournalDeBanguiFetcher();
      } else {
        console.warn(`[fetchCentralAfricanRepublicNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchCentralAfricanRepublicNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchCentralAfricanRepublicNews] No articles fetched from ${source.name}.`);
        if (["Radio Ndeke Luka", "Journal de Bangui"].includes(source.name)) {
            successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchCentralAfricanRepublicNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchCentralAfricanRepublicNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchCentralAfricanRepublicNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchCentralAfricanRepublicNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchCentralAfricanRepublicNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }

  console.log(`[fetchCentralAfricanRepublicNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
