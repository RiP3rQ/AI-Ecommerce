"use server";

import { drizzleDbClient } from "@/database";
import { createServerSupabaseClient } from "@/supabase-auth/server";
import { menuItems, SelectMenuItemType } from "@/database/schema";
import { asc } from "drizzle-orm";
import { getErrorMessage } from "@/lib/utils";

export async function getMenuData(): Promise<SelectMenuItemType[]> {
  try {
    // Step 0: Validate session
    const supabaseServer = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabaseServer.auth.getUser();

    if (!user) {
      throw new Error("User is not authenticated");
    }

    // Step 1: Get menu data
    const menu = await drizzleDbClient()
      .select()
      .from(menuItems)
      .orderBy(asc(menuItems.id));

    if (!menu) {
      throw new Error("Menu data not found");
    }

    return menu;
  } catch (error: unknown) {
    console.error(`[ERROR] Failed to get menu data:`, error);
    throw new Error(getErrorMessage(error));
  }
}
