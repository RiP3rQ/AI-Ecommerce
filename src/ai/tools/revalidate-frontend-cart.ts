import { uuidSchema } from "@/app/api/product/[id]/dto";
import { tool, zodSchema } from "ai";
import z from "zod";

/**
 * Client-side automatically executed tool that revalidates the frontend cart items.
 * This tool has NO execute function, which means it runs on the frontend.
 * This is the final step in the add-to-cart flow.
 *
 * Flow:
 * 1. AI calls addToCartProductInformations (Step 1)
 * 2. AI calls clientSideConfirmationForCartModification (Step 2)
 * 3. User selects variants and quantities in the modal
 * 4. AI calls saveTheFrontendSelectedProductToCart (Step 3)
 * 5. AI calls this tool (Step 4) to revalidate the cart on the frontend.
 */

// Input schema: simple trigger - the product data is already in frontend state from Step 1
const revalidateFrontendCartInputSchema = z.object({
  readyToRevalidate: z
    .boolean()
    .describe("Always set to true. This revalidates the frontend cart items."),
});

export const revalidateFrontendCartTool = tool({
  description:
    "[STEP 4 OF 4: Add-to-Cart Flow] Revalidates the frontend cart items. This tool is automatically executed on the frontend.",
  inputSchema: zodSchema(revalidateFrontendCartInputSchema),
  // NO execute function - this is handled on the client-side
});
