// src/lib/news-core.ts

import axios from "axios";
import * as cheerio from "cheerio";

/**
 * নির্দিষ্ট সোর্স URL থেকে খবর সংগ্রহ করে আনে
 */
export async function fetchNewsFromSources(sources: string[]): Promise<string[]> {
  const newsItems: string[] = [];

  for (const url of sources) {
    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      // Headline ও প্যারাগ্রাফ ধরার চেষ্টা
      const headlines = $("h1, h2").map((_, el) => $(el).text().trim()).get();
      const paragraphs = $("p").map((_, el) => $(el).text().trim()).get();

      // শীর্ষ ৩টা হেডলাইন ও প্যারা নিয়ে প্রাথমিক নিউজ তৈরি
      const content = [...headlines.slice(0, 3), ...paragraphs.slice(0, 3)].join("\n");

      if (content.length > 50) {
        newsItems.push(content);
      }

    } catch (error) {
      console.error(`❌ ${url} থেকে নিউজ আনতে সমস্যা:`, error);
    }
  }

  return newsItems;
}

/**
 * AI দিয়ে সত্যতা যাচাই করার ফাংশন
 * ভবিষ্যতে: AI বা fact-check API একীভূত করা হবে
 */
export async function verifyNews(news: string[]): Promise<string[]> {
  // ❗ এখন শুধু দৈর্ঘ্যের ভিত্তিতে ফিল্টার করছে
  return news.filter((n) => n.length > 100);
}

/**
 * AI দিয়ে বিস্তারিত সারাংশ তৈরি
 * ভবিষ্যতে: OpenAI API বা নিজস্ব সারাংশ সিস্টেম যুক্ত করা যাবে
 */
export async function summarizeNews(news: string[]): Promise<string[]> {
  return news.map((n, i) => `📰 সংবাদ ${i + 1}: \n${n.slice(0, 300)}...`);
}
