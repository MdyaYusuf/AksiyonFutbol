export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode: number;
  errors?: string[];
}

export type NoData = null;

export interface PaginationRequest {
  pageNumber: number;
  pageSize: number;
}

export interface CursorPagedResponse<T> {
  items: T[];
  nextCursorValue?: number | null;
  nextCursorDate?: string | null;
  nextCursorId?: string | null;
  hasNextPage: boolean;
}

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
}