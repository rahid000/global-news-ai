// src/newsFetchers/afghanistan.ts

import { fetchNewsFromSources, verifyNews, summarizeNews } from "@/lib/news-core";
import { DateTime } from "luxon";

export async function fetchAfghanistanNews(): Promise<string[]> {
  const afghanistanTime = DateTime.now().setZone("Asia/Kabul");

  // টাইম যাচাই – ভোর ৫ থেকে সকাল ৭টার মধ্যে চালানো যাবে
  if (afghanistanTime.hour < 5 || afghanistanTime.hour >= 7) {
    console.log("⏳ এখন আফগানিস্তানে খবর আনার সময় হয়নি:", afghanistanTime.toFormat("HH:mm"));
    return [];
  }

  const sources = [
    "https://tolonews.com",              // TOLOnews – Leading Afghan news source
    "https://www.ariananews.af",         // Ariana News
    "https://pajhwok.com/en/",           // Pajhwok Afghan News
  ];

  // ধাপ ১: খবর আনা
  const rawNews = await fetchNewsFromSources(sources);

  // ধাপ ২: যাচাই করা খবর ফিল্টার
  const verifiedNews = await verifyNews(rawNews);

  // ধাপ ৩: বিস্তারিত বিশ্লেষণ
  const summaries = await summarizeNews(verifiedNews);

  return summaries;
}
