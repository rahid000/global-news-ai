
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Angolan sources
import { fetchJornalDeAngolaFetcher } from "./jornalDeAngolaFetcher";
import { fetchAngopFetcher } from "./angopFetcher";

export async function fetchAngolaNews(): Promise<void> {
  const countryCode = "AO";
  console.log(`📰🇦🇴 Starting to fetch news for ${countryCode}...`);
  const allFetchedAngolaNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const angolaConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!angolaConfig) {
    console.error(`[fetchAngolaNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of angolaConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchAngolaNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Jornal de Angola") {
        newsItems = await fetchJornalDeAngolaFetcher();
      } else if (source.name === "ANGOP") {
        newsItems = await fetchAngopFetcher();
      } else {
        console.warn(`[fetchAngolaNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedAngolaNews.push(...newsItems);
        console.log(`[fetchAngolaNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchAngolaNews] No articles fetched from ${source.name}.`);
        if (source.name === "Jornal de Angola" || source.name === "ANGOP") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchAngolaNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedAngolaNews.length > 0) {
    console.log(`[fetchAngolaNews] Submitting ${allFetchedAngolaNews.length} total Angolan articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedAngolaNews);
      console.log(`[fetchAngolaNews] All fetched Angolan news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchAngolaNews] Error submitting Angolan news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchAngolaNews] No new Angolan articles to submit to Firestore.`);
  }
  
  console.log(`[fetchAngolaNews] Finished fetching for ${countryCode}. Sources processed: ${angolaConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedAngolaNews.length}.`);
}
