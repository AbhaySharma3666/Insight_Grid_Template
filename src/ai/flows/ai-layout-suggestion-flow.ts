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
  }).optional().describe('Optional header row definition spanning the full top of the canvas.'),
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
  prompt: `You are an expert Power BI designer. Suggest a professional dashboard layout for: "{{{dashboardPurpose}}}".
  
Layout Hierarchy:
1. Canvas: Overall background and ratio.
2. Header: An optional row at the very top (full width).
3. Body: A container below the header containing:
   a. Side Panel: Optional (left/right) for filters.
   b. Main Grid: The primary content area containing one or more rows. Each row has its own column definition for complex "Bento" layouts.

Ensure heightFractions for mainGrid.rows sum to approximately 1.0 (relative to the body area).
Ensure widthFractions for columns within any row sum to 1.0.

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
