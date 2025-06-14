export interface NewsItem {
  title: string;
  summary: string;
  fullText?: string;
  url: string;
  source: string;
  category:
    | "Technology"
    | "Sports"
    | "Politics"
    | "Business"
    | "World"
    | "Science"
    | "Health"
    | "Entertainment";
  publishedAt: string; // ISO 8601 string
  countryCode: string;
  verified: boolean;
}
