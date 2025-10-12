import z from "zod";

export const productUrlSchema = z.record(z.string(), z.string().optional());

export type ProductUrlSchema = z.infer<typeof productUrlSchema>;
