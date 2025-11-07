'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { generateAiSummary, GenerateAiSummaryInput } from '@/ai/flows/generate-ai-summary';
import { useToast } from '@/hooks/use-toast';

interface SummaryGeneratorProps extends GenerateAiSummaryInput {
  currentSummary: string;
  onSummaryGenerated: (summary: string) => void;
}

export default function SummaryGenerator({
  currentSummary,
  onSummaryGenerated,
  jobTitle,
  yearsOfExperience,
  keySkills,
}: SummaryGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [generatedSummary, setGeneratedSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    setIsLoading(true);
    setGeneratedSummary('');
    try {
      const result = await generateAiSummary({
        jobTitle,
        yearsOfExperience,
        keySkills,
      });
      if (result.summary) {
        setGeneratedSummary(result.summary);
      } else {
        throw new Error('AI did not return a summary.');
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate AI summary. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSummary = () => {
    onSummaryGenerated(generatedSummary);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full justify-center">
          <Sparkles className="mr-2 h-4 w-4 text-accent" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>AI Summary Generator</DialogTitle>
          <DialogDescription>
            Let AI craft a professional summary for you. Click generate to start.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="p-4 bg-muted rounded-md min-h-[100px] text-sm">
              {generatedSummary || 'Your generated summary will appear here.'}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? 'Generating...' : 'Generate'}
          </Button>
          <Button
            type="submit"
            onClick={handleUseSummary}
            disabled={!generatedSummary || isLoading}
            className='bg-accent hover:bg-accent/90'
          >
            Use this Summary
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
