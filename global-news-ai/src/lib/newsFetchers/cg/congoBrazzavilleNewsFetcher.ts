
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
import { fetchLesDepechesDeBrazzavilleFetcher } from "./lesDepechesDeBrazzavilleFetcher";
import { fetchCongoNewsBrazzavilleFetcher } from "./congoNewsBrazzavilleFetcher";

export async function fetchCongoBrazzavilleNews(): Promise<void> {
  const countryCode = "CG";
  const countryConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!countryConfig) {
    console.error(`[fetchCongoBrazzavilleNews] Configuration for ${countryCode} not found.`);
    return;
  }
  console.log(`📰🇨🇬 Starting to fetch news for ${countryCode} (${countryConfig.countryName})...`);
  const allFetchedNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  for (const source of countryConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    try {
      console.log(`[fetchCongoBrazzavilleNews] Fetching from ${source.name} (${source.url})...`);
      if (source.name === "Les Dépêches de Brazzaville") {
        newsItems = await fetchLesDepechesDeBrazzavilleFetcher();
      } else if (source.name === "Congo News") {
        newsItems = await fetchCongoNewsBrazzavilleFetcher();
      } else {
        console.warn(`[fetchCongoBrazzavilleNews] No specific scraper implemented for ${source.name}. Skipping.`);
      }

      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`[fetchCongoBrazzavilleNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        successfulSourceFetches++;
      } else {
        console.log(`[fetchCongoBrazzavilleNews] No articles fetched from ${source.name}.`);
        if (["Les Dépêches de Brazzaville", "Congo News"].includes(source.name)) {
            successfulSourceFetches++;
        }
      }
    } catch (error) {
      console.error(`[fetchCongoBrazzavilleNews] Error fetching news from ${source.name}:`, error);
      failedSourceFetches++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`[fetchCongoBrazzavilleNews] Submitting ${allFetchedNews.length} total articles for ${countryConfig.countryName} to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedNews);
      console.log(`[fetchCongoBrazzavilleNews] All fetched news items for ${countryConfig.countryName} submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchCongoBrazzavilleNews] Error submitting news items for ${countryConfig.countryName} to Firestore:`, error);
    }
  } else {
    console.log(`[fetchCongoBrazzavilleNews] No new articles for ${countryConfig.countryName} to submit to Firestore.`);
  }

  console.log(`[fetchCongoBrazzavilleNews] Finished fetching for ${countryCode}. Sources processed: ${countryConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedNews.length}.`);
}
