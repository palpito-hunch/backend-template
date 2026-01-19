export * from './errors.js';

// Common response types
export interface SuccessResponse<T> {
  status: 'success';
  data: T;
}

export interface PaginatedResponse<T> {
  status: 'success';
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Common query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}
