'use server';

/**
 * @fileOverview AI-powered resume summary generator flow.
 *
 * - generateAiSummary - A function that generates a professional resume summary.
 * - GenerateAiSummaryInput - The input type for the generateAiSummary function.
 * - GenerateAiSummaryOutput - The return type for the generateAiSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAiSummaryInputSchema = z.object({
  jobTitle: z.string().describe('Your job title.'),
  yearsOfExperience: z.number().describe('Your years of experience.'),
  keySkills: z.string().describe('Your key skills, separated by commas.'),
});
export type GenerateAiSummaryInput = z.infer<typeof GenerateAiSummaryInputSchema>;

const GenerateAiSummaryOutputSchema = z.object({
  summary: z.string().describe('A professional resume summary.'),
});
export type GenerateAiSummaryOutput = z.infer<typeof GenerateAiSummaryOutputSchema>;

export async function generateAiSummary(input: GenerateAiSummaryInput): Promise<GenerateAiSummaryOutput> {
  return generateAiSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiSummaryPrompt',
  input: {schema: GenerateAiSummaryInputSchema},
  output: {schema: GenerateAiSummaryOutputSchema},
  prompt: `You are a professional resume writer. Generate a compelling resume summary based on the following information:

Job Title: {{{jobTitle}}}
Years of Experience: {{{yearsOfExperience}}}
Key Skills: {{{keySkills}}}

Write a 2-4 sentence summary that highlights the candidate's strengths and experience.`,
});

const generateAiSummaryFlow = ai.defineFlow(
  {
    name: 'generateAiSummaryFlow',
    inputSchema: GenerateAiSummaryInputSchema,
    outputSchema: GenerateAiSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
