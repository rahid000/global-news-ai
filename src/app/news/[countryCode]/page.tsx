"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
import { useToast } from "@/hooks/use-toast";
import { isSameDay, parseISO } from 'date-fns';

export default function CountryNewsPage() {
  const params = useParams();
  const router = useRouter();
  const countryCode = params.countryCode as string;
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

  const country = useMemo(() => 
    allCountries.find(c => c.code.toLowerCase() === countryCode?.toLowerCase())
  , [countryCode]);

  useEffect(() => {
    if (countryCode) {
      const articlesForCountry = initialArticles.filter(article => article.countryCode.toLowerCase() === countryCode?.toLowerCase());
      setArticles(articlesForCountry);
      setIsLoading(false);
    }
  }, [countryCode]);

  const handleAddArticle = (newArticle: Article) => {
    setArticles(prevArticles => [newArticle, ...prevArticles]);
  };

  const handleArticleImageGenerated = useCallback((articleId: string, imageDataUri: string) => {
    setArticles(prevArticles =>
      prevArticles.map(art =>
        art.id === articleId ? { ...art, originalImageUrl: imageDataUri } : art
      )
    );
  }, []);

  const handleRequestDelete = (articleId: string, articleHeadline: string) => {
    setArticleToDelete({ id: articleId, headline: articleHeadline });
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteArticle = () => {
    if (articleToDelete) {
      setArticles(prevArticles => prevArticles.filter(art => art.id !== articleToDelete.id));
      toast({
        title: "Article Deleted",
        description: `"${articleToDelete.headline}" has been removed.`,
      });
    }
    setArticleToDelete(null);
    setIsDeleteDialogOpen(false);
  };

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const dateMatch = selectedDate ? isSameDay(parseISO(article.publishedDate), selectedDate) : true;
      const categoryMatch = selectedCategory ? article.category === selectedCategory : true;
      return dateMatch && categoryMatch;
    }).sort((a, b) => parseISO(b.publishedDate).getTime() - parseISO(a.publishedDate).getTime());
  }, [articles, selectedDate, selectedCategory]);

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
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                {isAdmin && (
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

          {/* Filters Section */}
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

          {/* Articles Section */}
          <section>
            {filteredArticles.length > 0 ? (
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
