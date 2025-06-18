import axios from "axios";
import * as cheerio from "cheerio";
import type { NewsItem } from "@/lib/types/NewsItem";
import { DateTime } from "luxon"; // Standard import for luxon

export async function fetchTOLONews(
  category: NewsItem["category"] = "Politics"
): Promise<NewsItem[]> {
  const sourceUrl = "https://tolonews.com/";
  const baseUrl = "https://tolonews.com";
  const items: NewsItem[] = [];
  console.log(`[fetchTOLONews] Attempting to fetch news from: ${sourceUrl} for category: ${category}`);

  try {
    const { data, status } = await axios.get(sourceUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 20000, // Increased timeout
    });

    console.log(`[fetchTOLONews] Successfully fetched page. Status: ${status}`);
    const $ = cheerio.load(data);

    // Using the DOM structure provided: .view-content -> .views-row -> .title -> h2 -> a
    const articleRows = $(".view-content .views-row");
    console.log(`[fetchTOLONews] Found ${articleRows.length} potential article rows using selector ".view-content .views-row".`);

    if (articleRows.length === 0) {
      console.warn("[fetchTOLONews] No article rows found. The website structure might have changed or the selector is incorrect.");
      const bodySnippet = $('body').html()?.substring(0, 2000) || "No body HTML found.";
      console.log(`[fetchTOLONews] Body HTML snippet (first 2000 chars): ${bodySnippet}...`);
      return items;
    }

    articleRows.each((index, el) => {
      const articleElement = $(el);
      // Finding title and link specifically within the .title div and then h2 > a
      const titleElement = articleElement.find(".title h2 a");
      const title = titleElement.text().trim();
      const relativeLink = titleElement.attr("href");

      if (title && relativeLink) {
        const fullUrl = relativeLink.startsWith("http") ? relativeLink : `${baseUrl}${relativeLink}`;
        
        let publishedAt: string;
        try {
          // Attempt to parse a date from the page if available, otherwise use current time
          // This part is placeholder as TOLO News date parsing can be complex and site-specific
          // For now, using current Kabul time as per previous logic if no specific date is found
          publishedAt = DateTime.now().setZone("Asia/Kabul").toISO()!;
        } catch (e) {
          console.warn("[fetchTOLONews] Luxon DateTime failed for current time, using simple ISO string", e);
          publishedAt = new Date().toISOString();
        }
        
        // Summary: Using title as summary for now, as extracting full summary can be complex
        const summary = title; 

        items.push({
          title,
          summary,
          url: fullUrl,
          source: "TOLO News",
          category,
          publishedAt: publishedAt,
          countryCode: "AF",
          verified: true, // Assuming verified as it's directly from source; can be changed
        });
        console.log(`[fetchTOLONews] ✅ Successfully extracted: Title='${title}', URL='${fullUrl}'`);
      } else {
        console.warn(`[fetchTOLONews] ⚠️ Skipped row ${index + 1} due to missing title or link.`);
        const rowHtmlSnippet = articleElement.html()?.substring(0,500) || "Could not get HTML for this row.";
        console.log(`[fetchTOLONews] HTML for SKIPPED row ${index + 1} (first 500 chars):\n${rowHtmlSnippet}\n-------------------------`);
      }
    });

    if (items.length === 0 && articleRows.length > 0) {
        console.warn(`[fetchTOLONews] CRITICAL: Processed ${articleRows.length} article rows but extracted 0 items. This might indicate issues with inner selectors (.title h2 a) or empty content within found rows.`);
    } else if (items.length > 0) {
        console.log(`[fetchTOLONews] Successfully processed. Extracted ${items.length} items from TOLO News.`);
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[fetchTOLONews] Axios error fetching TOLO News: ${error.message}`);
      if (error.response) {
        console.error('[fetchTOLONews] Error Response Status:', error.response.status);
        console.error('[fetchTOLONews] Error Response Data (first 200 chars):', String(error.response.data)?.substring(0,200));
      } else if (error.request) {
        console.error('[fetchTOLONews] No response received for TOLO News:', error.request);
      }
    } else {
      console.error(`[fetchTOLONews] Generic error fetching TOLO News:`, error);
    }
  }
  return items;
}
