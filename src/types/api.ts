export type ApiResponse<T> = {
  data: T;
  message?: string;
  requestId?: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasNextPage: boolean;
};