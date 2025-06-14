
import { config } from 'dotenv';
config();

import '@/ai/flows/assess-article-plausibility.ts';
import '@/ai/flows/generate-article-image.ts';
import '@/ai/flows/verify-news-submission.ts';
