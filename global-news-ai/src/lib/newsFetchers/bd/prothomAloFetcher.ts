
import axios from "axios";
import * as cheerio from "cheerio";
import { DateTime } from "luxon";
import type { NewsItem } from "@/lib/types/NewsItem";
import { newsSourcesConfig } from "@/lib/newsSourcesConfig";

export async function fetchProthomAloFetcher(): Promise<Omit<NewsItem, 'id' | 'countryCode'>[]> {
  const bangladeshConfig = newsSourcesConfig.find(c => c.countryCode === 'BD');
  const prothomAloSource = bangladeshConfig?.sources.find(s => s.name === 'Prothom Alo');

  if (!prothomAloSource) {
    console.error("[fetchProthomAloFetcher] Prothom Alo source configuration not found.");
    return [];
  }

  const sourceUrl = prothomAloSource.url;
  const articles: Omit<NewsItem, 'id' | 'countryCode'>[] = [];
  console.log(`[fetchProthomAloFetcher] Attempting to fetch news from: ${sourceUrl}`);

  try {
    const { data, status } = await axios.get(sourceUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      timeout: 20000,
    });

    console.log(`[fetchProthomAloFetcher] Successfully fetched page. Status: ${status}`);
    const $ = cheerio.load(data);

    $(".listing .card-with-image").each((_, el) => {
      const titleElement = $(el).find("h2 a");
      const title = titleElement.text().trim();
      const relativeLink = titleElement.attr("href");
      
      let summary = $(el).find("p").first().text().trim(); 
      if (!summary) {
        summary = $(el).find(".card-summary").text().trim();
      }
      if (!summary) {
         summary = title; 
      }

      if (title && relativeLink) {
        const fullUrl = relativeLink.startsWith("http") ? relativeLink : `${sourceUrl}${relativeLink}`;
        
        let publishedAt: string;
        try {
          publishedAt = DateTime.now().setZone("Asia/Dhaka").toISO()!;
        } catch (e) {
            console.warn("[fetchProthomAloFetcher] Luxon DateTime failed, using simple ISO string for publish date", e);
            publishedAt = new Date().toISOString();
        }

        articles.push({
          title,
          summary: summary || "সংক্ষিপ্ত বিবরণ পাওয়া যায়নি।",
          url: fullUrl,
          source: "Prothom Alo",
          category: "General",
          publishedAt,
          verified: true,
        });
        console.log(`[fetchProthomAloFetcher] ✅ Successfully extracted: Title='${title}', URL='${fullUrl}'`);
      } else {
        console.warn(`[fetchProthomAloFetcher] ⚠️ Skipped an item due to missing title or link.`);
      }
    });

    if (articles.length === 0) {
        console.warn("[fetchProthomAloFetcher] No articles extracted. Website structure might have changed or selectors are incorrect.");
    } else {
        console.log(`[fetchProthomAloFetcher] Successfully processed. Extracted ${articles.length} articles from Prothom Alo.`);
    }

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`[fetchProthomAloFetcher] Axios error fetching Prothom Alo: ${error.message}`);
    } else {
      console.error(`[fetchProthomAloFetcher] Generic error fetching Prothom Alo:`, error);
    }
  }
  return articles;
}
