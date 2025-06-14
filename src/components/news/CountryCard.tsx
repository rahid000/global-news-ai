import Link from 'next/link';
import Image from 'next/image';
import type { Country } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';

interface CountryCardProps {
  country: Country;
}

export function CountryCard({ country }: CountryCardProps) {
  return (
    <Link href={`/news/${country.code.toLowerCase()}`} className="group block">
      <Card className="h-full transform transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-headline text-2xl font-medium">
            {country.name}
          </CardTitle>
          <Image
            src={country.flagUrl}
            alt={`${country.name} flag`}
            width={48}
            height={32} 
            className="rounded-sm object-cover shadow-md"
            unoptimized // For external URLs if not configured in next.config.js
          />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            View latest news from {country.name}
          </p>
          <div className="mt-4 flex items-center text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span>Read More</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
