"use client";

import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback for completeness, though not directly used for defining functions here
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
  const [isLoading, setIsLoading] = useState<boolean>(true); // Default to true to show loader initially
  const [isErrorOrAiFailed, setIsErrorOrAiFailed] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState(false); // To track mount status

  useEffect(() => {
    setIsMounted(true);
    return () => { setIsMounted(false); };
  }, []);


  useEffect(() => {
    if (!isMounted) return;

    const setupImage = async () => {
      console.log(`[ArticleImage] Setup for "${articleHeadline}". Initial URL: ${initialImageUrl ? initialImageUrl.substring(0,50)+'...' : 'None'}. Summary: "${articleSummary ? articleSummary.substring(0,50) : 'EMPTY_SUMMARY'}..."`);
      setIsLoading(true); 
      setIsErrorOrAiFailed(false); 

      if (initialImageUrl) {
        setImageUrl(initialImageUrl);
        setIsLoading(false);
        console.log(`[ArticleImage] Using initial image for "${articleHeadline}"`);
        return;
      }

      console.log(`[ArticleImage] No initial image for "${articleHeadline}". Attempting AI generation.`);
      if (!articleSummary || articleSummary.trim() === "") {
        console.warn(`[ArticleImage] No valid summary provided for "${articleHeadline}". Using fallback placeholder.`);
        if (isMounted) { // Check isMounted before setting state
          setImageUrl(FALLBACK_PLACEHOLDER_URL);
          setIsErrorOrAiFailed(true);
          setIsLoading(false);
        }
        return;
      }

      try {
        const input: GenerateArticleImageInput = { articleSummary };
        console.log(`[ArticleImage] Calling generateArticleImage for "${articleHeadline}"`);
        const result = await generateArticleImage(input);
        if (isMounted) {
          if (result.imageDataUri) {
            console.log(`[ArticleImage] AI generation successful for "${articleHeadline}".`);
            setImageUrl(result.imageDataUri);
            if (onImageGenerated) {
              onImageGenerated(result.imageDataUri);
            }
          } else {
            console.log(`[ArticleImage] AI model did not return an image for "${articleHeadline}". Using fallback placeholder.`);
            setImageUrl(FALLBACK_PLACEHOLDER_URL);
            setIsErrorOrAiFailed(true);
          }
        }
      } catch (e) {
        console.error(`[ArticleImage] Failed to generate article image for "${articleHeadline}":`, e);
        if (isMounted) {
          setImageUrl(FALLBACK_PLACEHOLDER_URL);
          setIsErrorOrAiFailed(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          console.log(`[ArticleImage] Finished image setup for "${articleHeadline}". Loading: false.`);
        }
      }
    };

    setupImage();
  }, [initialImageUrl, articleSummary, articleHeadline, onImageGenerated, isMounted]); // Added onImageGenerated to dependency array and removed eslint-disable

  if (isLoading && !imageUrl) {
    console.log(`[ArticleImage] Rendering Skeleton for "${articleHeadline}" because isLoading is true and imageUrl is not yet set.`);
    return <Skeleton className="aspect-video w-full rounded-lg" />;
  }

  let hintValue: string | undefined;
  const currentEffectiveUrl = imageUrl || FALLBACK_PLACEHOLDER_URL;
  const isUsingPlaceholder = currentEffectiveUrl === FALLBACK_PLACEHOLDER_URL || (isErrorOrAiFailed && !initialImageUrl) ;


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
  
  console.log(`[ArticleImage] Rendering Image component for "${articleHeadline}". URL: ${currentEffectiveUrl.substring(0,70)}...`);
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
            console.warn(`[ArticleImage] Error loading image ${currentEffectiveUrl} for "${articleHeadline}". Falling back to placeholder.`);
            setImageUrl(FALLBACK_PLACEHOLDER_URL);
            setIsErrorOrAiFailed(true);
          }
        }}
        unoptimized={currentEffectiveUrl.startsWith('data:')}
      />
    </div>
  );
}
