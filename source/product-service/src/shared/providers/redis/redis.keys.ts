import { ProductFilter } from '../product/product.types';

export const getRedisKey = {
  productDetail: (id: string) => `product:${id}`,
  productsList: (filter?: ProductFilter) => {
    if (!filter) return 'products:all';
    const filterKey = JSON.stringify({
      page: filter.page,
      limit: filter.limit,
      category: filter.category,
      minPrice: filter.minPrice,
      maxPrice: filter.maxPrice,
      search: filter.search,
    });
    return `products:${Buffer.from(filterKey).toString('base64')}`;
  },
};
