
import axios from "axios";
import * as cheerio from "cheerio";
import { DateTime } from "luxon";
import type { NewsItem } from "@/lib/types/NewsItem";

export async function fetchProthomAloNews(): Promise<Omit<NewsItem, 'id' | 'countryCode'>[]> {
  const sourceUrl = "https://www.prothomalo.com";
  const articles: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  console.log(`[fetchProthomAloNews] Attempting to fetch news from: ${sourceUrl}`);

  try {
    const { data, status } = await axios.get(sourceUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 20000,
    });

    console.log(`[fetchProthomAloNews] Successfully fetched page. Status: ${status}`);
    const $ = cheerio.load(data);

    $(".listing .card-with-image").each((_, el) => {
      const titleElement = $(el).find("h2 a");
      const title = titleElement.text().trim();
      const relativeLink = titleElement.attr("href");
      
      // Prothom Alo summaries are often in a <p> tag within the same card or a sibling div.
      // This selector might need adjustment if the structure is complex.
      // Sometimes the summary might be inside a div with class like 'bn-story-summary' or similar.
      let summary = $(el).find("p").first().text().trim(); 
      if (!summary) {
        summary = $(el).find(".card-summary").text().trim(); // Try another common class
      }
      if (!summary) {
         summary = title; // Fallback to title if no summary found
      }


      if (title && relativeLink) {
        const fullUrl = relativeLink.startsWith("http") ? relativeLink : `${sourceUrl}${relativeLink}`;
        
        let publishedAt: string;
        try {
          // Attempt to parse a date from the page if available
          // For Prothom Alo, date might be in a time tag or a span with a specific class
          // This is a placeholder, actual date scraping for Prothom Alo needs specific selectors
          // const dateString = $(el).find("time").attr("datetime") || $(el).find(".published-time").text();
          // if (dateString) {
          //   publishedAt = DateTime.fromISO(dateString, { zone: "Asia/Dhaka" }).toISO()!;
          // } else {
          //  publishedAt = DateTime.now().setZone("Asia/Dhaka").toISO()!;
          // }
          publishedAt = DateTime.now().setZone("Asia/Dhaka").toISO()!; // Default to current Dhaka time
        } catch (e) {
            console.warn("[fetchProthomAloNews] Luxon DateTime failed, using simple ISO string for publish date", e);
            publishedAt = new Date().toISOString();
        }

        articles.push({
          title,
          summary: summary || "সংক্ষিপ্ত বিবরণ পাওয়া যায়নি।",
          url: fullUrl,
          source: "Prothom Alo",
          // Category scraping needs specific selectors, defaulting for now
          category: "General", // Default category
          publishedAt,
          verified: true, // Assuming verified as it's directly from source
        });
        console.log(`[fetchProthomAloNews] ✅ Successfully extracted: Title='${title}', URL='${fullUrl}'`);
      } else {
        console.warn(`[fetchProthomAloNews] ⚠️ Skipped an item due to missing title or link.`);
      }
    });

    if (articles.length === 0) {
        console.warn("[fetchProthomAloNews] No articles extracted. Website structure might have changed or selectors are incorrect.");
    } else {
        console.log(`[fetchProthomAloNews] Successfully processed. Extracted ${articles.length} articles from Prothom Alo.`);
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[fetchProthomAloNews] Axios error fetching Prothom Alo: ${error.message}`);
    } else {
      console.error(`[fetchProthomAloNews] Generic error fetching Prothom Alo:`, error);
    }
  }
  return articles;
}
