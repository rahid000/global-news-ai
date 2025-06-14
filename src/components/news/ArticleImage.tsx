
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { generateArticleImage, type GenerateArticleImageInput } from '@/ai/flows/generate-article-image';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticleImageProps {
  articleSummary: string;
  articleHeadline: string;
  initialImageUrl?: string;
  dataAiHint?: string; // For placeholder.co image hints, typically 1-2 words
  onImageGenerated?: (imageDataUri: string) => void;
}

const FALLBACK_PLACEHOLDER_URL = 'https://placehold.co/600x400.png';

export function ArticleImage({ articleSummary, articleHeadline, initialImageUrl, dataAiHint, onImageGenerated }: ArticleImageProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isErrorOrAiFailed, setIsErrorOrAiFailed] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const setupImage = async () => {
      setIsLoading(true);
      setIsErrorOrAiFailed(false); // Reset error state on each setup

      if (initialImageUrl) {
        setImageUrl(initialImageUrl);
        setIsLoading(false);
        return;
      }

      // No initial image, attempt AI generation
      try {
        const input: GenerateArticleImageInput = { articleSummary };
        const result = await generateArticleImage(input);
        if (isMounted) {
          if (result.imageDataUri) {
            setImageUrl(result.imageDataUri);
            if (onImageGenerated) {
              onImageGenerated(result.imageDataUri);
            }
          } else {
            // AI returned null or no image
            setImageUrl(FALLBACK_PLACEHOLDER_URL);
            setIsErrorOrAiFailed(true);
          }
        }
      } catch (e) {
        console.error("Failed to generate article image:", e);
        if (isMounted) {
          setImageUrl(FALLBACK_PLACEHOLDER_URL);
          setIsErrorOrAiFailed(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    setupImage();
    return () => { isMounted = false; };
  }, [initialImageUrl, articleSummary, onImageGenerated]); // Added onImageGenerated to dependencies, though it should be stable

  if (isLoading && !imageUrl) { // Show skeleton only if imageUrl is not yet set (e.g. from initialImageUrl)
    return <Skeleton className="aspect-video w-full rounded-lg" />;
  }

  // Determine the hint for placeholders
  let hintValue: string | undefined;
  const currentEffectiveUrl = imageUrl || FALLBACK_PLACEHOLDER_URL;
  const isUsingPlaceholder = currentEffectiveUrl === FALLBACK_PLACEHOLDER_URL || isErrorOrAiFailed;

  if (isUsingPlaceholder) {
    if (dataAiHint) {
      hintValue = dataAiHint.split(' ').slice(0, 2).join(' ');
    } else if (articleHeadline) {
      hintValue = articleHeadline.split(' ').slice(0, 2).join(' ');
    } else {
      hintValue = 'news image';
    }
    hintValue = hintValue.toLowerCase();
  }
  
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-muted">
      <Image
        src={currentEffectiveUrl}
        alt={`Image for article: ${articleHeadline}`}
        width={600}
        height={400}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        data-ai-hint={isUsingPlaceholder ? hintValue : undefined}
        onError={() => {
          if (isMounted && currentEffectiveUrl !== FALLBACK_PLACEHOLDER_URL) {
            setImageUrl(FALLBACK_PLACEHOLDER_URL);
            setIsErrorOrAiFailed(true);
          }
        }}
        unoptimized={currentEffectiveUrl.startsWith('data:')} // Added for data URIs
      />
    </div>
  );
}

