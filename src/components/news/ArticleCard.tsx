"use client";

import type { Article, Country } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArticleImage } from './ArticleImage';
import { PlausibilityDisplay } from './PlausibilityDisplay';
import { CalendarDays, Globe, Tags, Languages, Landmark, Trash2 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react'; // Added useCallback

interface ArticleCardProps {
  article: Article;
  country: Country;
  onImageGeneratedForArticle?: (articleId: string, imageDataUri: string) => void;
  isAdmin: boolean;
  onRequestDelete: (articleId: string, articleHeadline: string) => void;
}

export function ArticleCard({ article, country, onImageGeneratedForArticle, isAdmin, onRequestDelete }: ArticleCardProps) {
  const nativeLangCode = country.nativeLanguageCode;
  const nativeLangName = country.nativeLanguageName;

  const summaryTabs = [
    { value: "en", label: "English" },
    { value: "bn", label: "বাংলা (Bengali)" },
  ];

  if (nativeLangCode !== 'en' && nativeLangCode !== 'bn' && article.summaries[nativeLangCode]) {
    summaryTabs.push({ value: nativeLangCode, label: `${nativeLangName} (Native)` });
  }
  
  const publishedDateFormatted = article.publishedDate ? format(parseISO(article.publishedDate), "PPP") : "N/A";

  const handleImageGenerated = useCallback((imageDataUri: string) => {
    if (onImageGeneratedForArticle) {
      onImageGeneratedForArticle(article.id, imageDataUri);
    }
  }, [onImageGeneratedForArticle, article.id]); // Wrapped with useCallback and added dependencies

  const handleDeleteClick = () => {
    onRequestDelete(article.id, article.headline);
  };

  return (
    <Card className="group flex flex-col overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl">
      <div className="relative">
        <ArticleImage
          articleSummary={article.summaries.en} // Use English summary for image generation context
          articleHeadline={article.headline}
          initialImageUrl={article.originalImageUrl}
          dataAiHint={`${article.category} ${country.name}`}
          onImageGenerated={handleImageGenerated}
        />
      </div>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="font-headline text-xl lg:text-2xl leading-tight tracking-tight">
          {article.headline}
        </CardTitle>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Landmark className="h-3.5 w-3.5" />
            <span>{article.source}</span>
          </div>
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{publishedDateFormatted}</span>
          </div>
           <div className="flex items-center gap-1">
            <Tags className="h-3.5 w-3.5" />
            <Badge variant="secondary" className="text-xs">{article.category}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow p-4 sm:p-6 pt-0">
        <Tabs defaultValue="en" className="w-full">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
              <Languages className="h-4 w-4"/>
              Summaries
            </h3>
            <TabsList className="grid h-8 grid-cols-auto gap-1 p-0.5">
              {summaryTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value} className="h-6 px-2 py-1 text-xs">
                  {tab.label.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          {summaryTabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value} className="mt-0">
              <p className="text-sm leading-relaxed text-foreground/90">
                {article.summaries[tab.value] || "Summary not available in this language."}
              </p>
            </TabsContent>
          ))}
        </Tabs>
        
        <PlausibilityDisplay headline={article.headline} summary={article.summaries.en} />
      </CardContent>
      
      <CardFooter className="p-4 sm:p-6 pt-0 flex justify-between items-center">
         <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" />
            <span>News from {country.name}</span>
          </div>
          {isAdmin && (
            <Button
              variant="destructive"
              size="icon"
              onClick={handleDeleteClick}
              className="h-8 w-8"
              aria-label="Delete article"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
      </CardFooter>
    </Card>
  );
}
