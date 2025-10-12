import { PaginationMeta } from "@/app/api/shop/types";

export interface SWRResponse<TData> {
  success: boolean;
  data: TData;
}
