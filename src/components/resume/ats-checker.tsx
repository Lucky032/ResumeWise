'use client';

import { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
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
import { analyzeResumeForATS, AnalyzeResumeForATSOutput } from '@/ai/flows/optimize-for-ats';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';

interface AtsCheckerProps {
  resumeText: string;
}

export default function AtsChecker({ resumeText }: AtsCheckerProps) {
  const [open, setOpen] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResumeForATSOutput | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await analyzeResumeForATS({
        resumeText,
        jobDescription,
      });
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing for ATS:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to run ATS analysis. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ShieldCheck className="h-4 w-4 mr-2" />
          ATS Check
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>ATS Optimization Tool</DialogTitle>
          <DialogDescription>
            Analyze your resume for Applicant Tracking System compatibility. Paste a job description (optional) for a more tailored analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea 
            placeholder="Paste job description here (optional)"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={5}
          />

          {isLoading && (
            <div className="flex items-center justify-center h-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {analysisResult && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <h4 className="font-semibold">ATS Compatibility Score</h4>
                  <span className='font-bold text-primary'>{analysisResult.atsCompatibilityScore}%</span>
                </div>
                <Progress value={analysisResult.atsCompatibilityScore} />
              </div>

              <div>
                <h4 className="font-semibold mb-2">Suggestions for Improvement</h4>
                <ul className="list-disc list-inside space-y-1 text-sm bg-muted p-4 rounded-md">
                  {analysisResult.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleAnalyze} disabled={isLoading}>
            {isLoading ? 'Analyzing...' : 'Run Analysis'}
          </Button>
           <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
