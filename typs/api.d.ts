// types/api.d.ts
export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message?: string;
}