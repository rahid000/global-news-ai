
"use client";

import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface DateFilterProps {
  selectedDate: Date | undefined;
  onSelectDate: (date: Date | undefined) => void;
  onShowAllDates: () => void;
}

export function DateFilter({ selectedDate, onSelectDate, onShowAllDates }: DateFilterProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    onSelectDate(date);
    setIsOpen(false); // Close popover on date select
  }

  return (
    <div className="mb-6">
      <h3 className="mb-3 text-xl font-headline font-medium text-foreground text-center sm:text-left">Filter by Date</h3>
      <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-3">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full max-w-xs sm:w-[280px] justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              initialFocus
              disabled={(date) => date > new Date() || date < new Date("2000-01-01")}
            />
          </PopoverContent>
        </Popover>
        <Button onClick={onShowAllDates} variant="secondary" className="w-full max-w-xs sm:w-auto">
          Show All Dates
        </Button>
      </div>
    </div>
  );
}
