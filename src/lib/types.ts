
export interface Country {
  code: string;
  name: string;
  flagUrl: string;
  nativeLanguageName: string; // e.g., "日本語"
  nativeLanguageCode: string; // e.g., "ja"
}

export interface Category {
  id: string;
  name: string;
}

export type ArticleSummaryLang = 'en' | 'bn' | string; // string for nativeLanguageCode

export interface ArticleSummaries {
  en: string;
  bn: string;
  [key: ArticleSummaryLang]: string;
}

export interface Article {
  id: string;
  countryCode: string;
  headline: string;
  summaries: ArticleSummaries;
  source: string;
  category: string; // Corresponds to Category['name'] for simplicity in mock data
  publishedDate: string; // ISO 8601 string
  originalImageUrl?: string;
  videoUrl?: string; // Optional field for video URLs
}

export type PlausibilityStatus = "AI Verified" | "Potentially Misleading" | "Uncertain/Needs More Info";

export interface AIResponse {
  plausibility?: {
    status: PlausibilityStatus;
    reason: string;
  };
  imageUrl?: string;
}