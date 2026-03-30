'use server';
/**
 * @fileOverview An AI agent that suggests optimal Power BI dashboard layouts.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ColumnSchema = z.object({
  widthFraction: z.number(),
  borderRadius: z.number().optional().describe('Border radius for the individual cell in pixels.'),
});

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
  layoutType: z.enum(['grid', 'freeform', 'autofit']).optional().describe('The visual structure style.'),
  header: z.object({
    heightFraction: z.number().min(0).max(1),
    columns: z.array(ColumnSchema),
  }).optional().describe('Optional header row definition spanning the full top of the canvas.'),
  mainGrid: z.object({
    rows: z.array(
      z.object({
        heightFraction: z.number(),
        columns: z.array(ColumnSchema),
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
      columns: z.array(ColumnSchema),
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
1. Canvas: Overall background, ratio, and layoutType ('grid', 'freeform', or 'autofit').
2. Header: An optional row at the very top (full width).
3. Body: A container below the header containing:
   a. Side Panel: Optional (left/right) for filters.
   b. Main Grid: The primary content area containing one or more rows. Each row has its own column definition.

Styling:
- Provide individual 'borderRadius' for columns to create a modern 'Bento' or card-based look.
- Ensure heightFractions for mainGrid.rows sum to approximately 1.0.
- Ensure widthFractions for columns within any row sum to 1.0.

Example structure:
{
  "canvas": { "aspectRatio": "16:9", "backgroundColor": "#F0F2F5" },
  "layoutType": "grid",
  "mainGrid": {
    "rows": [
      { "heightFraction": 0.3, "columns": [{ "widthFraction": 1.0, "borderRadius": 12 }] }
    ],
    "columnGap": 20, "rowGap": 20, "hasShadow": true, "hasBorder": false
  },
  "sidePanel": { "position": "left", "widthPercentage": 20 },
  "description": "Clean executive summary..."
}`,
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
