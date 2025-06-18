
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Beninese sources
import { fetchLaNouvelleTribuneFetcher } from "./laNouvelleTribuneFetcher";
import { fetchMatinLibreFetcher } from "./matinLibreFetcher";

export async function fetchBeninNews(): Promise<void> {
  const countryCode = "BJ";
  console.log(`📰🇧🇯 Starting to fetch news for ${countryCode}...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchBeninNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchBeninNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "La Nouvelle Tribune") {
        newsItems = await fetchLaNouvelleTribuneFetcher();
      } else if (source.name === "Matin Libre") {
        newsItems = await fetchMatinLibreFetcher();
      } else {
        console.warn(`[fetchBeninNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchBeninNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchBeninNews] No articles fetched from ${source.name}.`);
        if (source.name === "La Nouvelle Tribune" || source.name === "Matin Libre") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchBeninNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchBeninNews] Submitting ${allFetchedNews.length} total Beninese articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchBeninNews] All fetched Beninese news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchBeninNews] Error submitting Beninese news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchBeninNews] No new Beninese articles to submit to Firestore.`);
  }
  
  console.log(`[fetchBeninNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}

    