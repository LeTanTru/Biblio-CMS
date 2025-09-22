import { productSchema, productSearchParamSchema } from '@/schemaValidations';
import { AuthorResType } from '@/types/author.type';
import { CategoryResType } from '@/types/category.type';
import { ProductImageResType } from '@/types/product-image.type';
import { PublisherResType } from '@/types/publisher.type';
import { BaseSearchParamType } from '@/types/search.type';
import { TranslatorResType } from '@/types/translator.type';
import z from 'zod';

export type ProductBodyType = z.infer<typeof productSchema>;
export type ProductSearchParamType = z.infer<typeof productSearchParamSchema> &
  BaseSearchParamType;

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
  createdDate: string;
  modifiedDate: string;
  status: number;
};
