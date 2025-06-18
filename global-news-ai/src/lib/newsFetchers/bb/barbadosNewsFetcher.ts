
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Barbadian sources
import { fetchNationNewsFetcher } from "./nationNewsFetcher";
import { fetchBarbadosTodayFetcher } from "./barbadosTodayFetcher";

export async function fetchBarbadosNews(): Promise<void> {
  const countryCode = "BB";
  console.log(`📰🇧🇧 Starting to fetch news for ${countryCode}...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchBarbadosNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchBarbadosNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Nation News") {
        newsItems = await fetchNationNewsFetcher();
      } else if (source.name === "Barbados Today") {
        newsItems = await fetchBarbadosTodayFetcher();
      } else {
        console.warn(`[fetchBarbadosNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchBarbadosNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchBarbadosNews] No articles fetched from ${source.name}.`);
        if (source.name === "Nation News" || source.name === "Barbados Today") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchBarbadosNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchBarbadosNews] Submitting ${allFetchedNews.length} total Barbadian articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchBarbadosNews] All fetched Barbadian news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchBarbadosNews] Error submitting Barbadian news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchBarbadosNews] No new Barbadian articles to submit to Firestore.`);
  }
  
  console.log(`[fetchBarbadosNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}

    