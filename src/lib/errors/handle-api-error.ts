import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ApiError } from "./api-error";

/**
 * Centralized error handler for API routes.
 * Processes caught exceptions and returns a standardized NextResponse.
 */
export function handleApiError(error: unknown): NextResponse<unknown> {
  if (error instanceof ApiError) {
    console.error("[ERROR HANDLER] API Error:", error);
    displayTrace(error);
    return NextResponse.json(
      { message: error.message },
      { status: error.statusCode },
    );
  }

  if (error instanceof ZodError) {
    console.error("[ERROR HANDLER] Zod Error:", error);
    displayTrace(error);
    return NextResponse.json(
      {
        message: "Input validation failed",
        errors: error.flatten().fieldErrors,
      },
      { status: 403 },
    );
  }

  if (error instanceof SyntaxError) {
    console.error("[ERROR HANDLER] JSON Parse Error:", error);
    displayTrace(error);
    return NextResponse.json(
      { message: "Invalid JSON in request body." },
      { status: 400 },
    );
  }

  // Fallback for unexpected errors
  console.error("[ERROR HANDLER] Unexpected API error:", error);
  displayTrace(error);
  return NextResponse.json(
    { message: "An unexpected internal server error occurred." },
    { status: 500 },
  );
}

function displayTrace(error: unknown) {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  if (error instanceof Error) {
    console.log("[ERROR TRACE] ", error.stack);
  }
}
