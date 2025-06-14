import { NextResponse } from 'next/server';
import { submitMultipleNewsItems } from '@/lib/firebase/submitNews';
import type { NewsItem } from '@/lib/types/NewsItem';
import { fetchTOLONews } from '@/lib/newsFetchers/af/toloNews';
// Import other country-specific fetchers here as you add them
// e.g., import { fetchBBCNews } from '@/lib/newsFetchers/gb/bbcNews';

interface FetcherConfig {
  countryCode: string;
  fetchFunction: () => Promise<NewsItem[]>;
  categories?: NewsItem['category'][]; // Optional: if a fetcher gets multiple categories
}

// Define your fetcher map here
// For TOLO News, it primarily fetches 'Politics' or general Afghanistan news
// The fetchTOLONews itself can be adapted if it needs to target specific categories by URL path
const countryFetchMap: Record<string, FetcherConfig> = {
  AF: {
    countryCode: 'AF',
    fetchFunction: async () => {
      // TOLO News scraper fetches general Afghanistan news, often political.
      // You can call it multiple times if it could fetch different categories
      // by changing its internal URL or parameters. For now, one call.
      return await fetchTOLONews("Politics");
    },
  },
  // Example for another country (hypothetical)
  // GB: {
  //   countryCode: 'GB',
  //   fetchFunction: async () => {
  //     const techNews = await fetchBBCNews("Technology");
  //     const sportsNews = await fetchBBCNews("Sports");
  //     return [...techNews, ...sportsNews];
  //   }
  // },
};

export async function GET() {
  console.log('Cron job starting: fetch-all-news');
  const allFetchedNews: NewsItem[] = [];
  let successCount = 0;
  let errorCount = 0;

  for (const countryCode in countryFetchMap) {
    try {
      console.log(`Fetching news for ${countryCode}...`);
      const config = countryFetchMap[countryCode];
      const newsItems = await config.fetchFunction();
      
      if (newsItems.length > 0) {
        allFetchedNews.push(...newsItems);
        console.log(`Successfully fetched ${newsItems.length} articles for ${countryCode}.`);
      } else {
        console.log(`No articles fetched for ${countryCode}.`);
      }
      successCount++;
    } catch (error) {
      console.error(`Error fetching news for ${countryCode}:`, error);
      errorCount++;
    }
  }

  if (allFetchedNews.length > 0) {
    console.log(`Submitting ${allFetchedNews.length} articles to Firestore...`);
    try {
      await submitMultipleNewsItems(allFetchedNews);
      console.log('All fetched news items submitted to Firestore.');
    } catch (error) {
      console.error('Error submitting news items to Firestore:', error);
      // Decide if this should count as a general errorCount++
    }
  } else {
    console.log('No new articles to submit to Firestore.');
  }

  const message = `Cron job finished. Countries processed: ${successCount + errorCount}. Successful fetches: ${successCount}. Failed fetches: ${errorCount}. Total articles fetched: ${allFetchedNews.length}.`;
  console.log(message);
  return NextResponse.json({ message });
}
