'use server';
/**
 * @fileOverview An AI agent that suggests optimal Power BI dashboard layouts based on the dashboard's purpose.
 *
 * - suggestLayout - A function that handles the layout suggestion process.
 * - AiLayoutSuggestionInput - The input type for the suggestLayout function.
 * - AiLayoutSuggestionOutput - The return type for the suggestLayout function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiLayoutSuggestionInputSchema = z.object({
  dashboardPurpose: z
    .string()
    .describe(
      'The primary purpose of the Power BI dashboard, e.g., "sales overview", "executive summary", "operational dashboard".'
    ),
});
export type AiLayoutSuggestionInput = z.infer<
  typeof AiLayoutSuggestionInputSchema
>;

const AiLayoutSuggestionOutputSchema = z.object({
  canvas: z
    .object({
      aspectRatio: z
        .string()
        .describe('The aspect ratio of the Power BI canvas, e.g., "16:9", "4:3".'),
      backgroundColor: z
        .string()
        .describe(
          'A suggested background color for the canvas in hex format, e.g., "#ECF0F7".'
        ),
      hasBackgroundImage: z
        .boolean()
        .describe('Whether the layout suggests including a background image.'),
    })
    .describe('Overall canvas properties.'),
  mainGrid: z
    .object({
      rows: z
        .array(
          z.object({
            heightFraction: z
              .number()
              .min(0)
              .max(1)
              .describe('Fractional height of this row.'),
            columns: z
              .array(
                z.object({
                  widthFraction: z
                    .number()
                    .min(0)
                    .max(1)
                    .describe('Fractional width of this column within this specific row.'),
                })
              )
              .describe('Array of columns for this specific row. Sum of widthFractions must be 1.'),
          })
        )
        .describe('Array of main grid row definitions. Sum of heightFractions must be 1.'),
      columnGap: z
        .number()
        .min(0)
        .describe('Gap between columns in pixels.'),
      rowGap: z.number().min(0).describe('Gap between rows in pixels.'),
      hasShadow: z
        .boolean()
        .describe('Whether elements in the main grid should have shadows.'),
      hasBorder: z
        .boolean()
        .describe('Whether elements in the main grid should have borders.'),
      borderColor: z
        .string()
        .optional()
        .describe('Border color in hex format, if borders are enabled.'),
    })
    .describe('Properties for the main content grid.'),
  sidePanel: z
    .object({
      position: z
        .enum(['left', 'right', 'none'])
        .describe(
          'Position of the side panel: "left", "right", or "none" if not present.'
        ),
      widthPercentage: z
        .number()
        .min(0)
        .max(100)
        .optional()
        .describe(
          'Width of the side panel as a percentage of total canvas width, if present.'
        ),
      panelGap: z
        .number()
        .optional()
        .describe('Gap between the side panel and the main grid in pixels.'),
      internalGrid: z
        .object({
          columns: z
            .array(
              z.object({
                widthFraction: z
                  .number()
                  .min(0)
                  .max(1)
                  .describe(
                    'The fractional width of the column within the side panel.'
                  ),
              })
            )
            .describe('Array of internal grid column definitions for the side panel.'),
          rows: z
            .array(
              z.object({
                heightFraction: z
                  .number()
                  .min(0)
                  .max(1)
                  .describe(
                    'The fractional height of the row within the side panel.'
                  ),
              })
            )
            .describe('Array of internal grid row definitions for the side panel.'),
          columnGap: z
            .number()
            .min(0)
            .describe('Gap between columns in pixels within the side panel.'),
          rowGap: z
            .number()
            .min(0)
            .describe('Gap between rows in pixels within the side panel.'),
          hasShadow: z
            .boolean()
            .describe('Whether elements in the side panel grid should have shadows.'),
          hasBorder: z
            .boolean()
            .describe('Whether elements in the side panel grid should have borders.'),
          borderColor: z
            .string()
            .optional()
            .describe(
              'Border color in hex format, if borders are enabled in the side panel.'
            ),
        })
        .optional()
        .describe('Internal grid properties for the side panel, if present.'),
    })
    .describe('Properties for an optional side panel.'),
  description: z
    .string()
    .describe(
      'A brief explanation of the suggested layout and why it is suitable for the given purpose.'
    ),
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
  prompt: `You are an expert Power BI dashboard layout designer. Suggest an optimal layout for: "{{{dashboardPurpose}}}".

Important: Use a nested row and column structure for the main grid. Each row can have its own unique set of columns.

Example Structure:
{
  "canvas": { "aspectRatio": "16:9", "backgroundColor": "#F0F2F5", "hasBackgroundImage": false },
  "mainGrid": {
    "rows": [
      {
        "heightFraction": 0.2,
        "columns": [
          { "widthFraction": 0.25 }, { "widthFraction": 0.25 }, { "widthFraction": 0.25 }, { "widthFraction": 0.25 }
        ]
      },
      {
        "heightFraction": 0.8,
        "columns": [
          { "widthFraction": 0.7 }, { "widthFraction": 0.3 }
        ]
      }
    ],
    "columnGap": 20,
    "rowGap": 20,
    "hasShadow": true,
    "hasBorder": false
  },
  "sidePanel": {
    "position": "left",
    "widthPercentage": 20,
    "panelGap": 24
  },
  "description": "Layout with top KPI row and a large left visual area."
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
