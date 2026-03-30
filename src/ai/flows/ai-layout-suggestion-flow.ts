'use server';
/**
 * @fileOverview An AI agent that suggests optimal Power BI dashboard layouts.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiLayoutSuggestionInputSchema = z.object({
  dashboardPurpose: z
    .string()
    .describe(
      'The primary purpose of the Power BI dashboard, e.g., "sales overview", "executive summary".'
    ),
});
export type AiLayoutSuggestionInput = z.infer<
  typeof AiLayoutSuggestionInputSchema
>;

const AiLayoutSuggestionOutputSchema = z.object({
  canvas: z.object({
    aspectRatio: z.string(),
    backgroundColor: z.string(),
  }),
  header: z.object({
    heightFraction: z.number().min(0).max(1),
    columns: z.array(z.object({ widthFraction: z.number() })),
  }).optional().describe('Optional header row definition.'),
  mainGrid: z.object({
    rows: z.array(
      z.object({
        heightFraction: z.number(),
        columns: z.array(z.object({ widthFraction: z.number() })),
      })
    ),
    columnGap: z.number(),
    rowGap: z.number(),
    hasShadow: z.boolean(),
    hasBorder: z.boolean(),
    borderColor: z.string().optional(),
  }),
  sidePanel: z.object({
    position: z.enum(['left', 'right', 'none']),
    widthPercentage: z.number().optional(),
    panelGap: z.number().optional(),
    internalGrid: z.object({
      columns: z.array(z.object({ widthFraction: z.number() })),
      rows: z.array(z.object({ heightFraction: z.number() })),
      columnGap: z.number(),
      rowGap: z.number(),
      hasShadow: z.boolean(),
      hasBorder: z.boolean(),
    }).optional(),
  }),
  description: z.string(),
});
export type AiLayoutSuggestionOutput = z.infer<
  typeof AiLayoutSuggestionOutputSchema
>;

export async function suggestLayout(
  input: AiLayoutSuggestionInput
): Promise<AiLayoutSuggestionOutput> {
  return aiLayoutSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiLayoutSuggestionPrompt',
  input: {schema: AiLayoutSuggestionInputSchema},
  output: {schema: AiLayoutSuggestionOutputSchema},
  prompt: `You are an expert Power BI designer. Suggest a professional layout for: "{{{dashboardPurpose}}}".
  
You can optionally include a 'header' row at the top (usually for title and logo).
The 'mainGrid' contains rows, and each row has its own 'columns'.
The 'sidePanel' is for filters/navigation.

Return a JSON object matching the schema.`,
});

const aiLayoutSuggestionFlow = ai.defineFlow(
  {
    name: 'aiLayoutSuggestionFlow',
    inputSchema: AiLayoutSuggestionInputSchema,
    outputSchema: AiLayoutSuggestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);