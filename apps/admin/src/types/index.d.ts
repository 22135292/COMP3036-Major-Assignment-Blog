// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Any = any;

export interface PaginatedResponse<T> {
  page: number;
  limit: number;
  total: number;
  count: number;
  data: T[];
}

export interface LikeState {
  likes: number;
  liked: boolean;
}
