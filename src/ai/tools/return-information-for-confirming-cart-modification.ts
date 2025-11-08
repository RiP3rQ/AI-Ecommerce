import { uuidSchema } from "@/app/api/product/[id]/dto";
import { tool, zodSchema } from "ai";
import z from "zod";

/**
 * Client-side tool that triggers the variant selection modal.
 * This tool has NO execute function, which means it runs on the frontend.
 *
 * Flow:
 * 1. AI calls addToCartProductInformations (Step 1) - product data is stored in frontend state
 * 2. AI calls this tool (Step 2) - frontend displays modal using the stored product data
 * 3. User selects variants and quantities in the modal
 * 4. Frontend calls addToolResult with the user's selections
 * 5. AI receives the output and proceeds to call saveTheFrontendSelectedProductToCart (Step 3)
 * 6. AI calls revalidateFrontendCart (Step 4) to update the cart on the frontend.
 *
 * The AI will WAIT at this step until the user completes their selection.
 */

// Input schema: simple trigger - the product data is already in frontend state from Step 1
const clientSideConfirmationInputSchema = z.object({
  readyToConfirm: z
    .boolean()
    .describe(
      "Always set to true. This triggers the modal using products from Step 1.",
    ),
});

// Output schema: what the frontend returns after user selection
export const clientSideConfirmationOutputSchema = z.object({
  userId: uuidSchema.describe("The authenticated user's ID"),
  selectedItems: z
    .array(
      z.object({
        productVariantId: uuidSchema.describe(
          "The ID of the selected product variant",
        ),
        quantity: z
          .number()
          .min(1)
          .max(10)
          .describe("The quantity selected by the user"),
      }),
    )
    .min(1, "At least one item must be selected"),
});

export const clientSideConfirmationForCartModificationTool = tool({
  description:
    "[STEP 2 OF 4: Add-to-Cart Flow] Shows an interactive modal to the user with the product variants from Step 1. The frontend will display options (sizes, colors, etc.) for the user to choose from. This tool PAUSES execution and WAITS for the user to select their preferred variants and quantities. The user's selections are returned as output containing userId and selectedItems array. You MUST pass this exact output to 'saveTheFrontendSelectedProductToCart' in Step 3. Always call this immediately after Step 1 completes.",
  inputSchema: zodSchema(clientSideConfirmationInputSchema),
  // NO execute function - this is handled on the client-side
  // The frontend will call addToolResult with output matching clientSideConfirmationOutputSchema
});
