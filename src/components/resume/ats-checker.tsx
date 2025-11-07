'use client';

import { useState } from 'react';
import { ShieldCheck, Loader2, CheckCircle } from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';

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
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>ATS Optimization Tool</DialogTitle>
          <DialogDescription>
            Analyze your resume for Applicant Tracking System compatibility. Paste a job description (optional) for a more tailored analysis.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div>
            <label htmlFor="job-description" className="font-medium text-sm mb-2 block">Job Description (Optional)</label>
            <Textarea 
              id="job-description"
              placeholder="Paste job description here for a keyword-based analysis."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={10}
              className='resize-none'
            />
             <Button onClick={handleAnalyze} disabled={isLoading} className="w-full mt-4">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : 'Run Analysis'}
            </Button>
          </div>

          <ScrollArea className="h-[350px] pr-4">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {analysisResult && (
              <div className="space-y-6">
                <div className="flex flex-col items-center space-y-2">
                  <h3 className="text-lg font-bold font-headline">Your Overall ATS Score</h3>
                  <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold text-primary">{analysisResult.overallScore}</span>
                      <span className="text-xl text-muted-foreground">/ 100</span>
                  </div>
                  <Progress value={analysisResult.overallScore} className="w-full max-w-sm h-3" />
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-md text-center font-headline">Section-by-Section Analysis</h4>
                  <div className='grid grid-cols-1 gap-2'>
                    {analysisResult.sections.map((section, index) => (
                      <Card key={index} className="text-xs">
                        <CardHeader className='p-2 pb-1'>
                          <CardTitle className="text-sm flex justify-between items-center">
                            <span>{section.section}</span>
                            <span className='text-primary font-bold'>{section.score}/100</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-2 pt-0">
                            <p className="text-muted-foreground">{section.feedback}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-md text-center font-headline">General Recommendations</h4>
                  <ul className="list-none space-y-2 text-sm bg-muted/50 p-3 rounded-md">
                    {analysisResult.generalRecommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0"/>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            {!analysisResult && !isLoading && (
                <div className="flex flex-col items-center justify-center h-full text-center p-4 bg-muted/50 rounded-md">
                    <ShieldCheck className="h-12 w-12 text-muted-foreground mb-4"/>
                    <h3 className="font-semibold">Analysis Results</h3>
                    <p className="text-sm text-muted-foreground">Your resume analysis will appear here after you run the tool.</p>
                </div>
            )}
          </ScrollArea>
        </div>
        <DialogFooter>
           <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
