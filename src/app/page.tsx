'use client';

import { useState } from 'react';
import { analyzeResumeForATS, AnalyzeResumeForATSOutput } from '@/ai/flows/optimize-for-ats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ShieldCheck, Github, FileText, Bot } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import { Progress } from '@/components/ui/progress';

export default function LandingPage() {
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalyzeResumeForATSOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please paste your resume text before analyzing.',
      });
      return;
    }
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
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center gap-2">
          <Logo className="h-6 w-6 text-primary" />
          <span className="font-semibold font-headline">ResumeWise</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
          >
            Login
          </Link>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Build Your Perfect Resume with AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our AI-powered tools help you create a standout resume, optimize it for ATS, and land your dream job faster.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
                     <Link href="/dashboard">Get Started Free</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#ats-checker">Check ATS Score</Link>
                  </Button>
                </div>
              </div>
              <img
                src="https://picsum.photos/seed/promo/600/400"
                data-ai-hint="resume builder illustration"
                width="550"
                height="550"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              />
            </div>
          </div>
        </section>
        
        <section id="ats-checker" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">ATS Checker</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Optimize Your Resume for Robots</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Paste your resume and an optional job description to see how well you match up. Our AI will give you a score and actionable feedback.
                </p>
              </div>
            </div>
            <div className="mx-auto max-w-4xl mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="grid gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="resume-text" className="font-medium">Your Resume</label>
                        <Textarea
                          id="resume-text"
                          placeholder="Paste the full text of your resume here."
                          value={resumeText}
                          onChange={(e) => setResumeText(e.target.value)}
                          rows={12}
                          className="resize-y"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="job-description" className="font-medium">Job Description (Optional)</label>
                        <Textarea
                          id="job-description"
                          placeholder="Paste the job description for a tailored analysis."
                          value={jobDescription}
                          onChange={(e) => setJobDescription(e.target.value)}
                          rows={12}
                          className="resize-y"
                        />
                      </div>
                    </div>
                    <Button onClick={handleAnalyze} disabled={isLoading} size="lg" className="w-full bg-accent hover:bg-accent/90">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="mr-2 h-5 w-5" />
                          Analyze My Resume
                        </>
                      )}
                    </Button>

                    {analysisResult && (
                      <div className="space-y-4 pt-4 border-t">
                         <div className="flex flex-col items-center space-y-2">
                            <h3 className="text-2xl font-bold font-headline">Your ATS Score</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-bold text-primary">{analysisResult.atsCompatibilityScore}</span>
                                <span className="text-2xl text-muted-foreground">/ 100</span>
                            </div>
                            <Progress value={analysisResult.atsCompatibilityScore} className="w-full max-w-sm h-3" />
                         </div>

                        <div className="space-y-2">
                          <h4 className="font-semibold text-lg text-center">Suggestions for Improvement</h4>
                          <ul className="list-disc list-inside space-y-2 text-sm bg-muted p-4 rounded-md">
                            {analysisResult.suggestions.map((suggestion, index) => (
                              <li key={index}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/20">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">Ready to build your professional future?</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Sign up now to save your resumes, access more templates, and unlock all AI-powered features.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90">
                  <Link href="/signup">Create Your Account</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 ResumeWise. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

    