export const swrFetcher = (url: string) =>
  fetch(url)
    .then(async (res) => {
      const data = await res.json();
      if (process.env.NODE_ENV !== "production") {
        console.log("[SWR_FETCHER] Response data: ", data);
      }
      return data;
    })
    .catch((err: unknown) => {
      if (process.env.NODE_ENV !== "production") {
        console.error(`[SWR_ERROR] Error fetching ${url}: `, err);
      }
      throw err;
    });
