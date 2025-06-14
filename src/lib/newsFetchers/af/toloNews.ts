import axios from "axios";
import * as cheerio from "cheerio";
import type { NewsItem } from "@/lib/types/NewsItem";

export async function fetchTOLONews(
  category: NewsItem["category"] = "Politics" // Default category if not specified
): Promise<NewsItem[]> {
  const url = "https://tolonews.com/afghanistan"; // Main Afghanistan news page
  const items: NewsItem[] = [];

  try {
    const { data } = await axios.get(url, { timeout: 15000 });
    const $ = cheerio.load(data);

    $("div.view-content .views-row").each((_, el) => {
      const articleElement = $(el);
      const titleElement = articleElement.find(".post-title a");
      const title = titleElement.text().trim();
      const href = titleElement.attr("href");

      // Attempt to get a summary; TOLO News structure might vary
      let summary = articleElement.find(".post-summary p, .views-field-field-summary .field-content").first().text().trim();
      if (!summary) {
        summary = title; // Fallback to title if no distinct summary found
      }
      
      // Attempt to get published date
      // TOLO News has dates in various formats, this is a basic attempt.
      // Example: <span class="extra-date">1 Hour Ago</span> or <span class="post-created">08/07/2024 - 15:38</span>
      // This part might need more robust date parsing if specific dates are required.
      // For now, we'll use current date as fallback.
      const publishedAt = new Date().toISOString();


      if (title && href) {
        const fullUrl = href.startsWith("http") ? href : "https://tolonews.com" + href;
        items.push({
          title,
          summary: summary,
          url: fullUrl,
          source: "TOLO News",
          category, // Category is passed in, as TOLO main page covers various topics
          publishedAt: publishedAt,
          countryCode: "AF",
          verified: true, // Assuming news from TOLO is generally verified, can be adjusted
        });
      }
    });
    console.log(`Fetched ${items.length} items from TOLO News`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Axios error fetching TOLO News for category ${category}: ${error.message}`);
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
      }
    } else {
      console.error(`Error fetching TOLO News for category ${category}:`, error);
    }
  }
  return items;
}
