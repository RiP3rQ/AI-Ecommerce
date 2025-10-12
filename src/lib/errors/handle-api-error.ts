import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./api-error";

/**
 * Centralized error handler for API routes.
 * Processes caught exceptions and returns a standardized NextResponse.
 */
export function handleApiError(error: unknown): NextResponse<unknown> {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: "Input validation failed",
        errors: error.flatten().fieldErrors,
      },
      { status: 400 }
    );
  }

  // Fallback for unexpected errors
  console.error("Unexpected API error:", error);
  return NextResponse.json(
    { message: "An unexpected internal server error occurred." },
    { status: 500 }
  );
}
