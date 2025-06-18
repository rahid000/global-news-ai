
import { NextResponse } from 'next/server';

// This cron job for fetching ONLY Bangladesh news has been deactivated.
// Its functionality is now part of the main /api/cron/fetch-all-news cron job,
// which calls the Bangladesh news orchestrator.

export async function GET() {
  const message = 'This specific cron job (/api/cron/fetch-bd-news) has been deactivated. Bangladesh news is fetched via /api/cron/fetch-all-news.';
  console.log(message);
  return NextResponse.json({ message });
}

    