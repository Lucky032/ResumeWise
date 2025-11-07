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
  resumePdf: z
    .string()
    .describe(
      "A PDF of a resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
    ).optional(),
  resumeText: z.string().optional().describe("The text content of a resume."),
  jobDescription: z
    .string()
    .optional()
    .describe('The job description to compare the resume against.'),
}).refine(data => data.resumePdf || data.resumeText, {
  message: 'Either resumePdf or resumeText must be provided.',
});
export type AnalyzeResumeForATSInput = z.infer<typeof AnalyzeResumeForATSInputSchema>;

const SectionFeedbackSchema = z.object({
  section: z.string().describe('The name of the resume section (e.g., "Contact Information", "Work Experience").'),
  score: z.number().min(0).max(100).describe('The ATS score for this specific section.'),
  feedback: z.string().describe('Specific feedback and improvement suggestions for this section.'),
});

const AnalyzeResumeForATSOutputSchema = z.object({
  overallScore: z
    .number()
    .min(0)
    .max(100)
    .describe('The overall ATS compatibility score for the entire resume (0-100).'),
  sections: z.array(SectionFeedbackSchema).describe('An array of feedback for each major section of the resume.'),
  generalRecommendations: z.array(z.string()).describe('A list of general, high-level recommendations for improving the resume.'),
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
Analyze the following resume and provide a detailed ATS compatibility analysis.

{{#if resumePdf}}
Resume (PDF):
{{media url=resumePdf}}
{{/if}}

{{#if resumeText}}
Resume (Text):
{{{resumeText}}}
{{/if}}

Job Description (optional, if provided, compare the resume to the job description):
{{{jobDescription}}}

Your analysis must be thorough. Evaluate the resume based on keyword relevance (especially if a job description is provided), formatting, clarity, and the presence of essential sections.

Provide the following in your output:
1.  **overallScore**: A single score from 0 to 100 representing the overall ATS-friendliness of the resume.
2.  **sections**: An array of feedback for each major resume section you identify (e.g., "Contact Info", "Summary", "Work Experience", "Education", "Skills"). For each section, provide a 'section' name, a 'score' (0-100), and detailed 'feedback' on what is good and what can be improved.
3.  **generalRecommendations**: A list of high-level, actionable recommendations that apply to the resume as a whole.

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
