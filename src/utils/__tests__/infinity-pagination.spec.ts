import { infinityPagination } from '../infinity-pagination';

describe('infinityPagination', () => {
  it('should set hasNextPage based on limit', () => {
    const result = infinityPagination([1, 2, 3], { page: 1, limit: 3 });
    expect(result).toEqual({ data: [1, 2, 3], hasNextPage: true });
  });

  it('should handle last page', () => {
    const result = infinityPagination([1], { page: 2, limit: 3 });
    expect(result).toEqual({ data: [1], hasNextPage: false });
  });
});
