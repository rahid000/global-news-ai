
import axios from "axios";
import * as cheerio from "cheerio";
import type { NewsItem } from "@/lib/types/NewsItem";
import { DateTime } from "luxon";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";

export async function fetchToloNewsFetcher(): Promise<Omit<NewsItem, 'id' | 'countryCode'>[]> {
  const afghanistanConfig = newsSourcesConfig.find(c => c.countryCode === 'AF');
  const toloNewsSource = afghanistanConfig?.sources.find(s => s.name === 'TOLOnews');

  if (!toloNewsSource) {
    console.error("[fetchToloNewsFetcher] TOLOnews source configuration not found.");
    return [];
  }

  const sourceUrl = toloNewsSource.url;
  const baseUrl = new URL(sourceUrl).origin;
  const items: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  console.log(`[fetchToloNewsFetcher] Attempting to fetch news from: ${sourceUrl} for category: General using new selectors.`);

  try {
    const { data, status } = await axios.get(sourceUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 20000,
    });

    console.log(`[fetchToloNewsFetcher] Successfully fetched page. Status: ${status}`);
    const $ = cheerio.load(data);

    // Using new selectors suggested: .view-frontpage .views-row for article blocks, and h3 a for title/link
    const articleRows = $(".view-frontpage .views-row");
    console.log(`[fetchToloNewsFetcher] Found ${articleRows.length} potential article rows using selector ".view-frontpage .views-row".`);

    if (articleRows.length === 0) {
      console.warn("[fetchToloNewsFetcher] No article rows found with the new selector. The website structure might have changed again or the selector is incorrect.");
      const bodySnippet = $('body').html()?.substring(0, 2000) || "No body HTML found.";
      console.log(`[fetchToloNewsFetcher] Body HTML snippet (first 2000 chars): ${bodySnippet}...`);
      return items;
    }

    articleRows.each((index, el) => {
      const articleElement = $(el);
      const titleElement = articleElement.find("h3 a");
      const title = titleElement.text().trim();
      const relativeLink = titleElement.attr("href");

      if (title && relativeLink) {
        const fullUrl = relativeLink.startsWith("http") ? relativeLink : `${baseUrl}${relativeLink}`;
        
        let publishedAt: string;
        try {
          publishedAt = DateTime.now().setZone("Asia/Kabul").toISO()!;
        } catch (e) {
          console.warn("[fetchToloNewsFetcher] Luxon DateTime failed for current time, using simple ISO string", e);
          publishedAt = new Date().toISOString();
        }
        
        const summary = articleElement.find("p").text().trim() || title; // Attempt to find a p tag for summary, fallback to title

        items.push({
          title,
          summary,
          url: fullUrl,
          source: "TOLOnews", // Source name from config
          category: "General", // Default category
          publishedAt: publishedAt,
          verified: true, 
        });
        console.log(`[fetchToloNewsFetcher] ✅ Successfully extracted: Title='${title}', URL='${fullUrl}'`);
      } else {
        console.warn(`[fetchToloNewsFetcher] ⚠️ Skipped row ${index + 1} due to missing title or link. Selector used for title/link: "h3 a"`);
        const rowHtmlSnippet = articleElement.html()?.substring(0,500) || "Could not get HTML for this row.";
        console.log(`[fetchToloNewsFetcher] HTML for SKIPPED row ${index + 1} (first 500 chars):\n${rowHtmlSnippet}\n-------------------------`);
      }
    });

    if (items.length === 0 && articleRows.length > 0) {
        console.warn(`[fetchToloNewsFetcher] CRITICAL: Processed ${articleRows.length} article rows but extracted 0 items. This might indicate issues with inner selectors ("h3 a") or empty content within found rows.`);
    } else if (items.length > 0) {
        console.log(`[fetchToloNewsFetcher] Successfully processed. Extracted ${items.length} items from TOLOnews.`);
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[fetchToloNewsFetcher] Axios error fetching TOLOnews: ${error.message}`);
      if (error.response) {
        console.error('[fetchToloNewsFetcher] Error Response Status:', error.response.status);
        console.error('[fetchToloNewsFetcher] Error Response Data (first 200 chars):', String(error.response.data)?.substring(0,200));
      } else if (error.request) {
        console.error('[fetchToloNewsFetcher] No response received for TOLOnews:', error.request);
      }
    } else {
      console.error(`[fetchToloNewsFetcher] Generic error fetching TOLOnews:`, error);
    }
  }
  return items;
}
