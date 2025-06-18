
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Andorran sources
import { fetchDiariDAndorraFetcher } from "./diariDAndorraFetcher";
import { fetchAltaveuFetcher } from "./altaveuFetcher";

export async function fetchAndorraNews(): Promise<void> {
  const countryCode = "AD";
  console.log(`📰🇦🇩 Starting to fetch news for ${countryCode}...`);
  const allFetchedAndorraNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const andorraConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!andorraConfig) {
    console.error(`[fetchAndorraNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of andorraConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchAndorraNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Diari d'Andorra") {
        newsItems = await fetchDiariDAndorraFetcher();
      } else if (source.name === "Altaveu") {
        newsItems = await fetchAltaveuFetcher();
      } else {
        console.warn(`[fetchAndorraNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedAndorraNews.push(...newsItems);
        console.log(`[fetchAndorraNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchAndorraNews] No articles fetched from ${source.name}.`);
        if (source.name === "Diari d'Andorra" || source.name === "Altaveu") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchAndorraNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedAndorraNews.length > 0) {
    console.log(`[fetchAndorraNews] Submitting ${allFetchedAndorraNews.length} total Andorran articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedAndorraNews);
      console.log(`[fetchAndorraNews] All fetched Andorran news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchAndorraNews] Error submitting Andorran news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchAndorraNews] No new Andorran articles to submit to Firestore.`);
  }
  
  console.log(`[fetchAndorraNews] Finished fetching for ${countryCode}. Sources processed: ${andorraConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedAndorraNews.length}.`);
}
