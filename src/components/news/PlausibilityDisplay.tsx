"use client";

import React, { useState, useEffect } from 'react';
import { assessArticlePlausibility, type AssessArticlePlausibilityInput, type AssessArticlePlausibilityOutput } from '@/ai/flows/assess-article-plausibility';
import { Skeleton } from '@/components/ui/skeleton';
import { PlausibilityBadge } from './PlausibilityBadge';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '../ui/separator';

interface PlausibilityDisplayProps {
  headline: string;
  summary: string;
}

export function PlausibilityDisplay({ headline, summary }: PlausibilityDisplayProps) {
  const [assessment, setAssessment] = useState<AssessArticlePlausibilityOutput | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchAssessment = async () => {
      setLoading(true);
      setError(null);
      try {
        const input: AssessArticlePlausibilityInput = { headline, summary };
        const result = await assessArticlePlausibility(input);
        if (isMounted) {
          setAssessment(result);
        }
      } catch (e) {
        console.error("Failed to assess article plausibility:", e);
        if (isMounted) {
          setError("Could not retrieve AI assessment.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchAssessment();
    return () => { isMounted = false; };
  }, [headline, summary]);

  if (loading) {
    return (
      <div className="mt-3 space-y-2">
        <Skeleton className="h-5 w-32 rounded-md" />
        <Skeleton className="h-3 w-full rounded-md" />
        <Skeleton className="h-3 w-4/5 rounded-md" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-3 flex items-center text-sm text-destructive">
        <AlertCircle className="mr-2 h-4 w-4" />
        {error}
      </div>
    );
  }

  if (!assessment) {
    return null; // Or some other fallback UI
  }

  return (
    <div className="mt-3 pt-3 border-t">
      <PlausibilityBadge status={assessment.status} reason={assessment.reason} isDetailed={true} />
      <p className="mt-1 text-xs text-muted-foreground italic">
        AI-powered plausibility assessment. This is an automated evaluation and not a definitive judgment.
      </p>
    </div>
  );
}
