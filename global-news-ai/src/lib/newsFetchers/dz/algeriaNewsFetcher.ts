
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import placeholder scrapers for Algerian sources
import { fetchAlgeriePresseServiceFetcher } from "./algeriePresseServiceFetcher";
import { fetchElMoudjahidFetcher } from "./elMoudjahidFetcher";

export async function fetchAlgeriaNews(): Promise<void> {
  const countryCode = "DZ";
  console.log(`📰🇩🇿 Starting to fetch news for ${countryCode}...`);
  const allFetchedAlgeriaNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const algeriaConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!algeriaConfig) {
    console.error(`[fetchAlgeriaNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  for (const source of algeriaConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchAlgeriaNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Algerie Presse Service") {
        newsItems = await fetchAlgeriePresseServiceFetcher();
      } else if (source.name === "El Moudjahid") {
        newsItems = await fetchElMoudjahidFetcher();
      } else {
        console.warn(`[fetchAlgeriaNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedAlgeriaNews.push(...newsItems);
        console.log(`[fetchAlgeriaNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchAlgeriaNews] No articles fetched from ${source.name}.`);
        if (source.name === "Algerie Presse Service" || source.name === "El Moudjahid") {
             successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchAlgeriaNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedAlgeriaNews.length > 0) {
    console.log(`[fetchAlgeriaNews] Submitting ${allFetchedAlgeriaNews.length} total Algerian articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedAlgeriaNews);
      console.log(`[fetchAlgeriaNews] All fetched Algerian news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchAlgeriaNews] Error submitting Algerian news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchAlgeriaNews] No new Algerian articles to submit to Firestore.`);
  }
  
  console.log(`[fetchAlgeriaNews] Finished fetching for ${countryCode}. Sources processed: ${algeriaConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedAlgeriaNews.length}.`);
}
