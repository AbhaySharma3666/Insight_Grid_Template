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
      columns: z
        .array(
          z.object({
            widthFraction: z
              .number()
              .min(0)
              .max(1)
              .describe(
                'The fractional width of the column, sums to 1 for all columns.'
              ),
          })
        )
        .describe('Array of main grid column definitions.'),
      rows: z
        .array(
          z.object({
            heightFraction: z
              .number()
              .min(0)
              .max(1)
              .describe(
                'The fractional height of the row, sums to 1 for all rows.'
              ),
          })
        )
        .describe('Array of main grid row definitions.'),
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
                    'The fractional width of the column within the side panel, sums to 1 for all columns.'
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
                    'The fractional height of the row within the side panel, sums to 1 for all rows.'
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
  prompt: `You are an expert Power BI dashboard layout designer. Your task is to suggest an optimal grid and panel layout structure for a Power BI dashboard based on its purpose.
Consider the following dashboard purpose: "{{{dashboardPurpose}}}".

Provide a detailed JSON output according to the specified schema.

When defining column and row widthFraction or heightFraction arrays, make sure their values sum to 1.

Example of expected output structure for a dashboard with a side panel:
{
  "canvas": {
    "aspectRatio": "16:9",
    "backgroundColor": "#F0F2F5",
    "hasBackgroundImage": false
  },
  "mainGrid": {
    "columns": [{"widthFraction": 0.5}, {"widthFraction": 0.5}],
    "rows": [{"heightFraction": 0.2}, {"heightFraction": 0.8}],
    "columnGap": 20,
    "rowGap": 20,
    "hasShadow": true,
    "hasBorder": false
  },
  "sidePanel": {
    "position": "left",
    "widthPercentage": 20,
    "internalGrid": {
      "columns": [{"widthFraction": 1.0}],
      "rows": [{"heightFraction": 0.2}, {"heightFraction": 0.2}, {"heightFraction": 0.2}, {"heightFraction": 0.2}, {"heightFraction": 0.2}],
      "columnGap": 10,
      "rowGap": 10,
      "hasShadow": false,
      "hasBorder": true
    }
  },
  "description": "This layout provides a clear overview..."
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
