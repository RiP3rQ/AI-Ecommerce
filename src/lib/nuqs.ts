import { Options } from "nuqs";

export const CLIENT_SIDE_URL_UPDATE_OPTIONS: Options = {
  history: "push", // 'push' for allowing to go back to the previous page | 'replace' for keeping the current history point and only replacing the query string
  scroll: false, // We don't want to scroll to the top of the page when the url changes
  shallow: true, // 'shallow' for keeping the query states update client-side only, meaning there won't be calls to the server
  clearOnDefault: true, // 'clearOnDefault' for clearing the query string when the default value is set
};
