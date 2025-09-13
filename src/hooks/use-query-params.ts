'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const useQueryParams = <T extends Record<string, any>>() => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getQueryParam = (key: keyof T) => {
    return searchParams.get(String(key));
  };

  const setQueryParam = (key: keyof T, value: T[keyof T] | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === null || value === '') {
      params.delete(String(key));
    } else {
      params.set(String(key), String(value));
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const setQueryParams = (newParams: Partial<T>) => {
    let params: URLSearchParams;

    if (Object.keys(newParams).length === 0) {
      params = new URLSearchParams();
    } else {
      params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
    }

    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  return { getQueryParam, setQueryParam, setQueryParams, searchParams };
};

export default useQueryParams;
