"use client";

import React, { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CountryCard } from '@/components/news/CountryCard';
import { countries as allCountries } from '@/lib/mock-data';
import AuthGuard from '@/components/AuthGuard';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCountries = useMemo(() => {
    if (!searchQuery) {
      return allCountries;
    }
    return allCountries.filter(country =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <section className="text-center mb-10">
            <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary mb-4">
              Explore Global News
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Select a country or search below to dive into its latest headlines, enhanced with AI-powered insights and summaries.
            </p>
          </section>

          <section className="mb-10">
            <div className="relative mx-auto max-w-xl">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <Input
                type="text"
                placeholder="Search for a country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border-2 border-border bg-card p-4 pl-10 text-base shadow-lg focus:border-primary focus:ring-primary"
              />
            </div>
          </section>

          <section>
            {filteredCountries.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCountries.map((country) => (
                  <CountryCard key={country.code} country={country} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-card rounded-lg shadow">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
                <h2 className="mt-4 font-headline text-2xl font-semibold">No Countries Found</h2>
                <p className="mt-2 text-muted-foreground">
                  Your search for "{searchQuery}" did not match any countries. Try a different search.
                </p>
              </div>
            )}
          </section>
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
