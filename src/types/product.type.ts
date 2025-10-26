import { productSchema, productSearchSchema } from '@/schemaValidations';
import { AuthorResType } from '@/types/author.type';
import { CategoryAutoResType, CategoryResType } from '@/types/category.type';
import { ProductImageResType } from '@/types/product-image.type';
import { PublisherResType } from '@/types/publisher.type';
import { BaseSearchType } from '@/types/search.type';
import { TranslatorResType } from '@/types/translator.type';
import z from 'zod';

export type ProductBodyType = z.infer<typeof productSchema>;
export type ProductSearchType = z.infer<typeof productSearchSchema> &
  BaseSearchType;

export type ProductResType = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  releaseDate: string;
  ageRating: number;
  language: string;
  isFeatured: boolean;
  metaData: string;
  discount: number;
  category: CategoryResType;
  images: ProductImageResType[];
  publisher: PublisherResType;
  contributors: AuthorResType[] | TranslatorResType[];
  totalViews: number;
  totalReviews: number;
  averageReview: number;
  totalSold: number;
  createdDate: string;
  modifiedDate: string;
  status: number;
};

export type ProductAutoType = {
  id: string;
  name: string;
  image: ProductImageAutoType;
  category: CategoryAutoResType;
  price: number;
  slug: string;
  isFeatured: boolean;
  discount: number;
  totalViews: number;
  status: number;
  totalReviews: number;
  averageReview: number;
  totalSold: number;
};

export type ProductImageAutoType = {
  id: string;
  url: string;
  ordering: number;
  isDefault: boolean;
  status: number;
};
