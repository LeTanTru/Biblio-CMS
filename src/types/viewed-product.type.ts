import { CategoryAutoResType } from '@/types/category.type';

export type TopViewedProductResType = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  discount: number;
  category: CategoryAutoResType;
  averageRating: number;
  totalReviews: number;
  totalFavorites: number;
  totalViews: number;
};
