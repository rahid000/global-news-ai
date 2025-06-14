
"use client";

import type { Category } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryName: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="mb-6">
      <h3 className="mb-3 text-xl font-headline font-medium text-foreground text-center sm:text-left">Filter by Category</h3>
      <ScrollArea className="w-full whitespace-nowrap rounded-md">
        <div className="flex gap-2 pb-2">
          <Badge
            variant={selectedCategory === null ? 'default' : 'secondary'}
            onClick={() => onSelectCategory(null)}
            className={`cursor-pointer transition-all hover:opacity-80 text-sm ${selectedCategory === null ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'}`}
          >
            All Categories
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.name ? 'default' : 'secondary'}
              onClick={() => onSelectCategory(category.name)}
              className={`cursor-pointer transition-all hover:opacity-80 text-sm ${selectedCategory === category.name ? 'bg-primary text-primary-foreground shadow-md' : 'bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground'}`}
            >
              {category.name}
            </Badge>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

