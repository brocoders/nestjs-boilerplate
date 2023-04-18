export type InfinityPaginationResultType<T> = Readonly<{
  data: T[];
  hasNextPage: boolean;
}>;
