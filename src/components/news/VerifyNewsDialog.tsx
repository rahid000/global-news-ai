
"use client";

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Loader2, AlertTriangle, Share2, CheckCircle, HelpCircle, ShieldAlert, XCircle, Info } from 'lucide-react';
import { verifyNewsSubmission, type VerifyNewsInput, type VerifyNewsOutput } from '@/ai/flows/verify-news-submission';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  articleText: z.string().optional(),
  image: z.any().optional(), // Simplified for initial setup, refined client-side
}).refine(data => !!data.url || !!data.articleText || !!data.image, {
  message: "Please provide at least one input: URL, article text, or an image.",
  path: ["url"], // Arbitrary path, error shown globally
});

type VerifyNewsFormValues = z.infer<typeof formSchema>;

interface VerifyNewsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  countryName?: string;
}

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export function VerifyNewsDialog({ isOpen, onOpenChange, countryName }: VerifyNewsDialogProps) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerifyNewsOutput | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<VerifyNewsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
      articleText: "",
      image: undefined,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        form.setError("image", { type: "manual", message: "Image size must be less than 5MB." });
        setImagePreview(null);
        form.setValue("image", undefined);
        return;
      }
      if (!file.type.startsWith("image/")) {
        form.setError("image", { type: "manual", message: "Only image files are allowed." });
        setImagePreview(null);
        form.setValue("image", undefined);
        return;
      }
      form.clearErrors("image");
      form.setValue("image", event.target.files);
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

  const onSubmit = async (data: VerifyNewsFormValues) => {
    setIsVerifying(true);
    setVerificationResult(null);
    form.clearErrors(); // Clear previous global error

    let imageDataUri: string | undefined = undefined;
    if (data.image && data.image instanceof FileList && data.image.length > 0) {
      imageDataUri = await fileToDataUri(data.image[0]);
    }

    const submissionInput: VerifyNewsInput = {
      url: data.url || undefined,
      articleText: data.articleText || undefined,
      imageDataUri: imageDataUri,
    };

     if (!submissionInput.url && !submissionInput.articleText && !submissionInput.imageDataUri) {
      form.setError("url", { type: "manual", message: "Please provide at least one input: URL, article text, or an image." });
      setIsVerifying(false);
      return;
    }


    try {
      const result = await verifyNewsSubmission(submissionInput);
      setVerificationResult(result);
    } catch (error) {
      console.error("Error verifying news submission:", error);
      toast({ variant: "destructive", title: "Verification Failed", description: "Could not process the verification request." });
      setVerificationResult({
        status: "Unable to Verify",
        reasoning: "An unexpected error occurred while trying to verify the submission. Please try again later.",
        summary: "Verification process encountered an error."
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  const renderResultIcon = (status: VerifyNewsOutput['status']) => {
    switch (status) {
      case "Likely Authentic": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "Potentially Misleading": return <ShieldAlert className="h-5 w-5 text-yellow-500" />;
      case "Caution Advised": return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case "Insufficient Information": return <HelpCircle className="h-5 w-5 text-blue-500" />;
      case "Strong Indicators of Misinformation": return <XCircle className="h-5 w-5 text-red-600" />;
      case "Unable to Verify":
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) {
        form.reset();
        setVerificationResult(null);
        setImagePreview(null);
      }
    }}>
      <DialogContent className="sm:max-w-lg md:max-w-xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Share2 className="h-6 w-6 text-primary" />
            Verify News {countryName ? `for ${countryName}` : ''}
          </DialogTitle>
          <DialogDescription>
            Submit a URL, article text, or an image for AI-powered analysis. The AI will assess its likely authenticity.
            This is an experimental feature and may not always be accurate.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-grow overflow-y-auto pr-2 space-y-4 py-2">
          {!verificationResult ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="url">News Article URL (Optional)</Label>
                <Input id="url" {...form.register("url")} placeholder="https://example.com/news-article" />
                {form.formState.errors.url && !form.formState.errors.articleText && !form.formState.errors.image && <p className="text-sm text-destructive mt-1">{form.formState.errors.url.message}</p>}
                <p className="text-xs text-muted-foreground mt-1">Note: AI analyzes URL structure, not live content. For content analysis, paste text below.</p>
              </div>

              <div>
                <Label htmlFor="articleText">Article Text (Optional)</Label>
                <Textarea id="articleText" {...form.register("articleText")} placeholder="Paste news article text here..." rows={5} />
                {form.formState.errors.articleText && <p className="text-sm text-destructive mt-1">{form.formState.errors.articleText.message}</p>}
              </div>

              <div>
                <Label htmlFor="image">Image (Optional)</Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="file:text-primary file:font-medium" />
                {imagePreview && (
                  <div className="mt-2 border rounded-md p-2 inline-block">
                    <Image src={imagePreview} alt="Image preview" width={100} height={60} className="rounded-md object-cover" />
                  </div>
                )}
                {form.formState.errors.image && <p className="text-sm text-destructive mt-1">{form.formState.errors.image.message as string}</p>}
              </div>
               {form.formState.errors.root && <p className="text-sm text-destructive mt-1">{form.formState.errors.root.message}</p>}
               {/* Global error for refine */}
                { form.formState.errors.url && form.formState.errors.url.type === 'manual' && (
                    <Alert variant="destructive" className="mt-2">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Input Required</AlertTitle>
                        <AlertDescription>{form.formState.errors.url.message}</AlertDescription>
                    </Alert>
                )}


              <Button type="submit" className="w-full" disabled={isVerifying}>
                {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Verify Submission"}
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Alert variant={
                verificationResult.status === "Likely Authentic" ? "default" : 
                verificationResult.status === "Strong Indicators of Misinformation" ? "destructive" : "default"
              } className={
                verificationResult.status === "Potentially Misleading" || verificationResult.status === "Caution Advised" ? "border-yellow-500" :
                verificationResult.status === "Insufficient Information" ? "border-blue-500" : ""
              }>
                <div className="flex items-center gap-2">
                 {renderResultIcon(verificationResult.status)}
                  <AlertTitle className="text-lg">{verificationResult.status}</AlertTitle>
                </div>
                <AlertDescription className="mt-2 space-y-2">
                  <p><strong>Summary of Analyzed Input:</strong> {verificationResult.summary}</p>
                  <p><strong>AI Reasoning:</strong> {verificationResult.reasoning}</p>
                </AlertDescription>
              </Alert>
               <Alert variant="default" className="mt-4 border-blue-500">
                    <Info className="h-4 w-4 text-blue-500" />
                    <AlertTitle>Important Disclaimer</AlertTitle>
                    <AlertDescription>
                        This AI-powered verification is experimental and provides an assessment based on its training data. It may not always be accurate and cannot access live internet content or perform real-time investigations. Always cross-reference with multiple reliable sources before making judgments.
                    </AlertDescription>
                </Alert>
              <Button onClick={() => { setVerificationResult(null); form.reset(); setImagePreview(null); }} className="w-full">
                Verify Another Submission
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter className="mt-auto pt-4 border-t">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
