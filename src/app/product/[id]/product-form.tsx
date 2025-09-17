'use client';

import { apiConfig } from '@/constants';
import { useSaveBase } from '@/hooks';
import route from '@/routes';
import { ProductBodyType, ProductResType } from '@/types';

export default function ProductForm({ queryKey }: { queryKey: string }) {
  const { data, handleSubmit, loading, renderActions } = useSaveBase<
    ProductResType,
    ProductBodyType
  >({
    apiConfig: apiConfig.product,
    options: {
      queryKey,
      objectName: 'sách',
      listPageUrl: route.product.getList.path
    }
  });
  const defaultValues: ProductBodyType = {
    name: '',
    ageRating: 0,
    category: '',
    contributorsIds: [],
    description: '',
    discount: 0,
    isFeatured: false,
    language: '',
    metaData: '',
    price: 0,
    releaseDate: ''
  };

  const initialValues: ProductBodyType = {
    name: data?.name ?? '',
    ageRating: data?.ageRating ?? 0,
    category: data?.category?.id ?? '',
    contributorsIds: data?.contributors ?? [],
    description: data?.description ?? '',
    discount: data?.discount ?? 0,
    isFeatured: data?.isFeatured ?? false,
    language: data?.language ?? '',
    metaData: data?.metaData ?? '',
    price: data?.price ?? 0,
    releaseDate: data?.releaseDate ?? ''
  };

  return <div></div>;
}
