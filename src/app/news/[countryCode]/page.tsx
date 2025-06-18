"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArticleCard } from '@/components/news/ArticleCard';
import { CategoryFilter } from '@/components/news/CategoryFilter';
import { DateFilter } from '@/components/news/DateFilter';
import { countries as allCountries, categories as allCategories, articles as initialArticles } from '@/lib/mock-data';
import type { Article, Country, Category } from '@/lib/types';
import { ArrowLeft, AlertTriangle, Loader2, PlusCircle, UploadCloud, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import AuthGuard from '@/components/AuthGuard';
import { useAuth } from '@/contexts/AuthContext';
import { UploadNewsForm } from '@/components/news/UploadNewsForm';
import { VerifyNewsDialog } from '@/components/news/VerifyNewsDialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { isSameDay, parseISO } from 'date-fns';

export default function CountryNewsPage() {
  const params = useParams();
  const router = useRouter();
  const countryCodeParam = params.countryCode;
  const countryCode = Array.isArray(countryCodeParam) ? countryCodeParam[0] : countryCodeParam;

  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isVerifyDialogOpen, setIsVerifyDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState<{ id: string; headline: string } | null>(null);

  const PAJHWOK_AFGHAN_NEWS_URL = "https://pajhwok.com/";
  const KHAAMA_PRESS_URL = "https://www.khaama.com/";
  const BAKHTAR_NEWS_AGENCY_URL = "https://bakhtarnews.af/";
  const RTA_YOUTUBE_CHANNEL_URL = "https://www.youtube.com/embed?listType=user_uploads&list=UCf9n0gq_JvL8nJ0_XG0q7Xw"; // Example embed, might need specific live/playlist ID for better experience. Or just use the channel page. Let's try embedding the channel page as the user provided the @handle
  const ARIANA_NEWS_YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@ariananewsaf"; // Direct iframe to channel page
  const TOLONEWS_YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@Tolonews"; // Direct iframe to channel page

  const country = useMemo(() =>
    allCountries.find(c => c.code.toLowerCase() === countryCode?.toLowerCase())
  , [countryCode]);

  useEffect(() => {
    if (countryCode) {
      if (countryCode.toLowerCase() !== 'af') {
        const articlesForCountry = initialArticles.filter(article => article.countryCode.toLowerCase() === countryCode?.toLowerCase());
        setArticles(articlesForCountry);
      } else {
        setArticles([]); // Explicitly set to empty for 'af' as content will be from iframes
      }
      setIsLoading(false);
    }
  }, [countryCode]);

  const handleAddArticle = useCallback((newArticle: Article) => {
    setArticles(prevArticles => [newArticle, ...prevArticles]);
  }, []);

  const handleArticleImageGenerated = useCallback((articleId: string, imageDataUri: string) => {
    setArticles(prevArticles =>
      prevArticles.map(art =>
        art.id === articleId ? { ...art, originalImageUrl: imageDataUri } : art
      )
    );
  }, []);

  const handleRequestDelete = useCallback((articleId: string, articleHeadline: string) => {
    setArticleToDelete({ id: articleId, headline: articleHeadline });
    setIsDeleteDialogOpen(true);
  }, []);

  const confirmDeleteArticle = useCallback(() => {
    if (articleToDelete) {
      setArticles(prevArticles => prevArticles.filter(art => art.id !== articleToDelete.id));
      toast({
        title: "Article Deleted",
        description: `"${articleToDelete.headline}" has been removed.`,
      });
    }
    setArticleToDelete(null);
    setIsDeleteDialogOpen(false);
  }, [articleToDelete, toast]);

  const filteredArticles = useMemo(() => {
    if (countryCode?.toLowerCase() === 'af') return [];
    return articles.filter(article => {
      const dateMatch = selectedDate ? isSameDay(parseISO(article.publishedDate), selectedDate) : true;
      const categoryMatch = selectedCategory ? article.category === selectedCategory : true;
      return dateMatch && categoryMatch;
    }).sort((a, b) => parseISO(b.publishedDate).getTime() - parseISO(a.publishedDate).getTime());
  }, [articles, selectedDate, selectedCategory, countryCode]);


  if (isLoading) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8 text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mt-20" />
            <p className="mt-4 text-muted-foreground">Loading news...</p>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  if (!country) {
    return (
      <AuthGuard>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8 text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mx-auto mt-20" />
            <h1 className="mt-4 font-headline text-3xl font-semibold">Country Not Found</h1>
            <p className="mt-2 text-muted-foreground">The country code '{countryCode}' is invalid or not supported.</p>
            <Button onClick={() => router.push('/')} className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back to Countries
            </Button>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <section className="mb-10 p-6 rounded-xl bg-card shadow-lg">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                 <Image
                    src={country.flagUrl}
                    alt={`${country.name} flag`}
                    width={120}
                    height={80}
                    className="rounded-md object-cover shadow-md border-2 border-border"
                    unoptimized
                  />
                <div>
                  <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">
                    {country.name} News
                  </h1>
                  <p className="mt-1 text-lg text-muted-foreground">
                    Latest articles from {country.name}, with AI-powered summaries and insights.
                    {countryCode?.toLowerCase() === 'af' && (
                      <span className="block text-sm mt-1">(Live feeds from major news sources are available in tabs below. <a href="https://www.khaama.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Khaama Press</a> also available.)</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                {isAdmin && countryCode?.toLowerCase() !== 'af' && (
                  <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add News
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px]">
                      <DialogHeader>
                         <DialogTitle className="flex items-center gap-2">
                          <UploadCloud className="h-6 w-6 text-primary" />
                          Upload News Article for {country.name}
                        </DialogTitle>
                        <DialogDescription>
                          Fill in the details below to add a new article. The AI will use the English summary to assess plausibility.
                        </DialogDescription>
                      </DialogHeader>
                      <UploadNewsForm
                        countryCode={country.code}
                        onArticleAdd={handleAddArticle}
                        closeDialog={() => setIsUploadDialogOpen(false)}
                      />
                    </DialogContent>
                  </Dialog>
                )}
                <Button variant="outline" onClick={() => setIsVerifyDialogOpen(true)}>
                  <Share2 className="mr-2 h-4 w-4" /> Verify News
                </Button>
              </div>
            </div>
             <Button onClick={() => router.push('/')} variant="outline" size="sm" className="mt-6">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Countries
            </Button>
          </section>

          <VerifyNewsDialog
            isOpen={isVerifyDialogOpen}
            onOpenChange={setIsVerifyDialogOpen}
            countryName={country.name}
          />

          {countryCode?.toLowerCase() !== 'af' && (
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-card rounded-lg shadow">
                <DateFilter
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  onShowAllDates={() => setSelectedDate(undefined)}
                />
              </div>
              <div className="p-4 bg-card rounded-lg shadow">
                <CategoryFilter
                  categories={allCategories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                />
              </div>
            </div>
          )}

          <section>
            {countryCode?.toLowerCase() === 'af' ? (
              <Tabs defaultValue="pajhwok" className="w-full mt-6">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-1 mb-4">
                  <TabsTrigger value="pajhwok">Pajhwok</TabsTrigger>
                  <TabsTrigger value="khaama">Khaama</TabsTrigger>
                  <TabsTrigger value="bakhtar">Bakhtar</TabsTrigger>
                  <TabsTrigger value="rta_yt">RTA (YT)</TabsTrigger>
                  <TabsTrigger value="ariana_yt">Ariana (YT)</TabsTrigger>
                  <TabsTrigger value="tolonews_yt">TOLO (YT)</TabsTrigger>
                </TabsList>
                <TabsContent value="pajhwok">
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold text-primary text-center sm:text-left mb-4">
                      Live from Pajhwok Afghan News
                  </h2>
                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-2xl border-2 border-primary bg-muted">
                    <iframe
                      src={PAJHWOK_AFGHAN_NEWS_URL}
                      title="Pajhwok Afghan News Live Feed"
                      className="w-full h-full"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    />
                  </div>
                  <p className="mt-4 text-sm text-center text-muted-foreground">
                    Displaying live content from Pajhwok Afghan News. Some functionalities might be limited due to embedding restrictions.
                  </p>
                </TabsContent>
                <TabsContent value="khaama">
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold text-primary text-center sm:text-left mb-4">
                      Live from Khaama Press
                  </h2>
                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-2xl border-2 border-primary bg-muted">
                    <iframe
                      src={KHAAMA_PRESS_URL}
                      title="Khaama Press Live Feed"
                      className="w-full h-full"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    />
                  </div>
                  <p className="mt-4 text-sm text-center text-muted-foreground">
                    Displaying live content from Khaama Press. Some functionalities might be limited.
                  </p>
                </TabsContent>
                <TabsContent value="bakhtar">
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold text-primary text-center sm:text-left mb-4">
                      Live from Bakhtar News Agency
                  </h2>
                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-2xl border-2 border-primary bg-muted">
                    <iframe
                      src={BAKHTAR_NEWS_AGENCY_URL}
                      title="Bakhtar News Agency Live Feed"
                      className="w-full h-full"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    />
                  </div>
                  <p className="mt-4 text-sm text-center text-muted-foreground">
                    Displaying live content from Bakhtar News Agency. Embedding may have limitations.
                  </p>
                </TabsContent>
                <TabsContent value="rta_yt">
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold text-primary text-center sm:text-left mb-4">
                      RTA (YouTube Channel)
                  </h2>
                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-2xl border-2 border-primary bg-muted">
                    <iframe
                      src={RTA_YOUTUBE_CHANNEL_URL}
                      title="RTA YouTube Channel"
                      className="w-full h-full"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    />
                  </div>
                   <p className="mt-4 text-sm text-center text-muted-foreground">
                    Displaying content from RTA's YouTube channel.
                  </p>
                </TabsContent>
                 <TabsContent value="ariana_yt">
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold text-primary text-center sm:text-left mb-4">
                      Ariana News (YouTube Channel)
                  </h2>
                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-2xl border-2 border-primary bg-muted">
                    <iframe
                      src={ARIANA_NEWS_YOUTUBE_CHANNEL_URL}
                      title="Ariana News YouTube Channel"
                      className="w-full h-full"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    />
                  </div>
                   <p className="mt-4 text-sm text-center text-muted-foreground">
                    Displaying content from Ariana News' YouTube channel.
                  </p>
                </TabsContent>
                 <TabsContent value="tolonews_yt">
                  <h2 className="font-headline text-2xl sm:text-3xl font-bold text-primary text-center sm:text-left mb-4">
                      TOLOnews (YouTube Channel)
                  </h2>
                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-2xl border-2 border-primary bg-muted">
                    <iframe
                      src={TOLONEWS_YOUTUBE_CHANNEL_URL}
                      title="TOLOnews YouTube Channel"
                      className="w-full h-full"
                      allowFullScreen
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                    />
                  </div>
                   <p className="mt-4 text-sm text-center text-muted-foreground">
                    Displaying content from TOLOnews' YouTube channel.
                  </p>
                </TabsContent>
              </Tabs>
            ) : filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:grid-cols-2">
                {filteredArticles.map(article => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    country={country}
                    onImageGeneratedForArticle={handleArticleImageGenerated}
                    isAdmin={isAdmin}
                    onRequestDelete={handleRequestDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg shadow">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
                <h2 className="mt-4 font-headline text-2xl font-semibold">No Articles Found</h2>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters, check back later for new updates, or add a new article if you're an admin.
                </p>
              </div>
            )}
          </section>
        </main>
        <Footer />

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                Confirm Deletion
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the article: <br />
                <strong className="mt-1 block">"{articleToDelete?.headline}"</strong>?
                <br /> This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setArticleToDelete(null)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteArticle} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </AuthGuard>
  );
}
