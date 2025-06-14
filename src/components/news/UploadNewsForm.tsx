
"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { categories as allCategories } from '@/lib/mock-data';
import type { Article, Category } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  headline: z.string().min(10, { message: "Headline must be at least 10 characters." }),
  summaryEn: z.string().min(20, { message: "English summary must be at least 20 characters." }),
  summaryBn: z.string().optional(),
  source: z.string().min(3, { message: "Source must be at least 3 characters." }),
  category: z.string().min(1, { message: "Please select a category." }),
  image: z.any().superRefine((val, ctx) => {
    if (typeof FileList !== 'undefined' && typeof File !== 'undefined') { // Checks if running in a browser-like environment
      if (!(val instanceof FileList)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid input: Expected a FileList." });
        return z.NEVER; // Prevents further validation if not a FileList
      }
      if (val.length !== 1) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Image is required. Please select one file." });
      } else {
        const file = val[0];
        if (!(file instanceof File)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid file item. Expected a File object." });
        } else {
            if (!file.type.startsWith("image/")) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Only image files are allowed." });
            }
            if (file.size > 5 * 1024 * 1024) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Image size must be less than 5MB." });
            }
        }
      }
    } else {
      // Running in a non-browser environment (e.g., server-side during SSR/build)
      // If val is present here, it's an issue, but typically file inputs aren't pre-filled server-side.
      // For schema definition, this branch allows it to pass without erroring on `FileList`.
      // Actual validation will occur client-side.
      if (val !== undefined && val !== null && !(val instanceof Object && val.length === 0 && Object.keys(val).length === 0)) { // check if val is not an empty FileList like object
        // This case should ideally not happen for file inputs during SSR if they are not pre-filled.
        // If it does, it means data is being passed in a context where FileList cannot be validated.
      }
    }
  }),
});

type UploadNewsFormValues = z.infer<typeof formSchema>;

interface UploadNewsFormProps {
  countryCode: string;
  onArticleAdd: (newArticle: Article) => void;
  closeDialog: () => void;
}

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function UploadNewsForm({ countryCode, onArticleAdd, closeDialog }: UploadNewsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<UploadNewsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      headline: "",
      summaryEn: "",
      summaryBn: "",
      source: "",
      category: "",
      image: undefined,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue("image", event.target.files); // Pass the FileList
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
      form.setValue("image", undefined);
    }
  };

  const onSubmit = async (data: UploadNewsFormValues) => {
    setIsSubmitting(true);
    try {
      let imageDataUri = "";
      // data.image is now validated by superRefine to be a FileList with one file on the client
      const imageFileList = data.image as FileList | undefined; 
      if (imageFileList && imageFileList.length > 0) {
        imageDataUri = await fileToDataUri(imageFileList[0]);
      }

      const newArticle: Article = {
        id: `user-uploaded-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        countryCode: countryCode,
        headline: data.headline,
        summaries: {
          en: data.summaryEn,
          bn: data.summaryBn || "",
          // No native summary here as it's user uploaded and we don't know the country's native lang easily here
        },
        source: data.source,
        category: data.category,
        publishedDate: new Date().toISOString(),
        originalImageUrl: imageDataUri,
      };
      
      onArticleAdd(newArticle);
      toast({ title: "Article Uploaded", description: "The new article has been added." });
      form.reset();
      setImagePreview(null);
      closeDialog();
    } catch (error) {
      console.error("Error uploading article:", error);
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not upload the article." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
      <div>
        <Label htmlFor="headline">Headline</Label>
        <Input id="headline" {...form.register("headline")} />
        {form.formState.errors.headline && <p className="text-sm text-destructive mt-1">{form.formState.errors.headline.message}</p>}
      </div>
      <div>
        <Label htmlFor="summaryEn">English Summary</Label>
        <Textarea id="summaryEn" {...form.register("summaryEn")} />
        {form.formState.errors.summaryEn && <p className="text-sm text-destructive mt-1">{form.formState.errors.summaryEn.message}</p>}
      </div>
      <div>
        <Label htmlFor="summaryBn">Bengali Summary (Optional)</Label>
        <Textarea id="summaryBn" {...form.register("summaryBn")} />
      </div>
      <div>
        <Label htmlFor="source">Source</Label>
        <Input id="source" {...form.register("source")} />
        {form.formState.errors.source && <p className="text-sm text-destructive mt-1">{form.formState.errors.source.message}</p>}
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Controller
          name="category"
          control={form.control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((cat: Category) => (
                  <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {form.formState.errors.category && <p className="text-sm text-destructive mt-1">{form.formState.errors.category.message}</p>}
      </div>
      <div>
        <Label htmlFor="image">Article Image</Label>
        <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="file:text-primary file:font-medium" />
        {imagePreview && (
          <div className="mt-2">
            <Image src={imagePreview} alt="Image preview" width={150} height={90} className="rounded-md object-cover" />
          </div>
        )}
        {form.formState.errors.image && <p className="text-sm text-destructive mt-1">{form.formState.errors.image.message}</p>}
      </div>
      <Button type="submit" className="w-full !mt-6" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Upload Article
      </Button>
    </form>
  );
}

    