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
    | "Entertainment"
    | "General"; // Added General category
  publishedAt: string; // ISO 8601 string
  countryCode: string;
  verified: boolean;
  videoUrl?: string; // Optional field for video URLs
  // id should be added by Firestore or when creating the object before saving
  id?: string; 
}
