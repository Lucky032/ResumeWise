'use server';

/**
 * @fileOverview A flow to analyze a resume for ATS compatibility and provide suggestions for improvements.
 *
 * - analyzeResumeForATS - A function that analyzes the resume for ATS compatibility.
 * - AnalyzeResumeForATSInput - The input type for the analyzeResumeForATS function.
 * - AnalyzeResumeForATSOutput - The return type for the analyzeResumeForATS function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeResumeForATSInputSchema = z.object({
  resumeText: z
    .string()
    .describe('The text content of the resume to be analyzed for ATS compatibility.'),
  jobDescription: z
    .string()
    .optional()
    .describe('The job description to compare the resume against.'),
});
export type AnalyzeResumeForATSInput = z.infer<typeof AnalyzeResumeForATSInputSchema>;

const AnalyzeResumeForATSOutputSchema = z.object({
  atsCompatibilityScore: z
    .number()
    .describe('A score indicating the resume ATS compatibility (0-100).'),
  suggestions: z.array(z.string()).describe('Suggestions for improving ATS compatibility.'),
});
export type AnalyzeResumeForATSOutput = z.infer<typeof AnalyzeResumeForATSOutputSchema>;

export async function analyzeResumeForATS(input: AnalyzeResumeForATSInput): Promise<AnalyzeResumeForATSOutput> {
  return analyzeResumeForATSFlow(input);
}

const atsPrompt = ai.definePrompt({
  name: 'atsPrompt',
  input: {schema: AnalyzeResumeForATSInputSchema},
  output: {schema: AnalyzeResumeForATSOutputSchema},
  prompt: `You are an expert in Applicant Tracking Systems (ATS) and resume optimization.
Analyze the following resume text and provide an ATS compatibility score (0-100) and suggestions for improvement.

Resume Text: {{{resumeText}}}

Job Description (optional, if provided, compare the resume to the job description):
{{{jobDescription}}}

Consider factors such as keyword density, formatting issues (tables, images), section headings, and overall structure.
Provide specific and actionable suggestions.

Output should be in JSON format.
`,
});

const analyzeResumeForATSFlow = ai.defineFlow(
  {
    name: 'analyzeResumeForATSFlow',
    inputSchema: AnalyzeResumeForATSInputSchema,
    outputSchema: AnalyzeResumeForATSOutputSchema,
  },
  async input => {
    const {output} = await atsPrompt(input);
    return output!;
  }
);
