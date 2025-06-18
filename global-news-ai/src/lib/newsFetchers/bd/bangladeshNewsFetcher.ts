
import type { NewsItem } from "@/lib/types/NewsItem";
import { saveMultipleNewsItemsToFirestore } from "@/lib/firestoreUtils"; 
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";
// Import specific scrapers for Bangladeshi sources
import { fetchProthomAloFetcher } from "./prothomAloFetcher";
import { fetchBdnews24Fetcher } from "./bdnews24Fetcher";
import { fetchTheDailyStarFetcher } from "./theDailyStarFetcher";
import { fetchJamunaTvFetcher } from "./jamunaTvFetcher";
import { fetchChanneliFetcher } from "./channeliFetcher";
import { fetchIttefaqFetcher } from "./ittefaqFetcher";

export async function fetchBangladeshNews(): Promise<void> {
  const countryCode = "BD";
  console.log(`📰🇧🇩 Starting to fetch news for ${countryCode}...`);
  const allFetchedBangladeshNews: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  let successfulSourceFetches = 0;
  let failedSourceFetches = 0;

  const bangladeshConfig = newsSourcesConfig.find(c => c.countryCode === countryCode);
  if (!bangladeshConfig) {
    console.error(`[fetchBangladeshNews] Configuration for ${countryCode} not found in newsSourcesConfig.`);
    return;
  }

  const fetcherMap: Record<string, () => Promise<Omit<NewsItem, 'id' | 'countryCode'>[]>> = {
    "Prothom Alo": fetchProthomAloFetcher,
    "bdnews24": fetchBdnews24Fetcher,
    "The Daily Star": fetchTheDailyStarFetcher,
    "Jamuna TV": fetchJamunaTvFetcher,
    "Channel i": fetchChanneliFetcher,
    "Ittefaq": fetchIttefaqFetcher,
  };

  for (const source of bangladeshConfig.sources) {
    let newsItems: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
    const fetcher = fetcherMap[source.name];

    if (fetcher) {
      try {
        console.log(`[fetchBangladeshNews] Fetching from ${source.name} (${source.url})...`);
        newsItems = await fetcher();
        if (newsItems.length > 0) {
          allFetchedBangladeshNews.push(...newsItems);
          console.log(`[fetchBangladeshNews] Successfully fetched ${newsItems.length} articles from ${source.name}.`);
        } else {
          console.log(`[fetchBangladeshNews] No articles fetched from ${source.name}.`);
        }
        successfulSourceFetches++;
      } catch (error) {
        console.error(`[fetchBangladeshNews] Error fetching news from ${source.name}:`, error);
        failedSourceFetches++;
      }
    } else {
      console.warn(`[fetchBangladeshNews] No specific scraper implemented or mapped for ${source.name} (${source.url}). Skipping.`);
    }
  }

  if (allFetchedBangladeshNews.length > 0) {
    console.log(`[fetchBangladeshNews] Submitting ${allFetchedBangladeshNews.length} total Bangladeshi articles to Firestore...`);
    try {
      await saveMultipleNewsItemsToFirestore(countryCode, allFetchedBangladeshNews);
      console.log(`[fetchBangladeshNews] All fetched Bangladeshi news items submitted to Firestore.`);
    } catch (error) {
      console.error(`[fetchBangladeshNews] Error submitting Bangladeshi news items to Firestore:`, error);
    }
  } else {
    console.log(`[fetchBangladeshNews] No new Bangladeshi articles to submit to Firestore.`);
  }
  
  console.log(`[fetchBangladeshNews] Finished fetching for ${countryCode}. Sources processed: ${bangladeshConfig.sources.length}. Successful source operations: ${successfulSourceFetches}. Failed source operations: ${failedSourceFetches}. Total articles for submission: ${allFetchedBangladeshNews.length}.`);
}

    