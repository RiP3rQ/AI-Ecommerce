import { env } from "@/env";

export const swrFetcher = (url: string) =>
  fetch(url)
    .then((res) => {
      if (env.NODE_ENV !== "production") {
        console.log("[SWR_FETCHER] Response: ", res);
      }
      return res.json();
    })
    .catch((err: unknown) => {
      if (env.NODE_ENV !== "production") {
        console.error(`[SWR_ERROR] Error fetching ${url}: `, err);
      }
      throw err;
    });
