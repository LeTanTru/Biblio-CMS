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

    const sortedParams = new URLSearchParams();
    [...params.keys()].sort().forEach((k) => {
      const v = params.get(k);
      if (v !== null) sortedParams.set(k, v);
    });

    router.push(`${pathname}?${sortedParams.toString()}`);
  };

  const setQueryParams = (newParams: Partial<T>) => {
    const params = new URLSearchParams();

    Object.entries(newParams).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.set(key, String(value));
      }
    });

    const sortedParams = new URLSearchParams();
    [...params.keys()].sort().forEach((k) => {
      const v = params.get(k);
      if (v !== null) sortedParams.set(k, v);
    });

    const queryString = sortedParams.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname);
  };

  const serializeParams = (obj: Record<string, any>) => {
    return Object.entries(obj)
      .filter(([_, v]) => v !== null && v !== undefined && v !== '')
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
  };

  const deserializeParams = (str: string) => {
    return str.split('&').reduce(
      (acc, part) => {
        const [key, value] = part.split('=');
        if (key) {
          acc[decodeURIComponent(key)] = decodeURIComponent(value || '');
        }
        return acc;
      },
      {} as Record<string, string>
    );
  };

  const paramsObject = Object.fromEntries(searchParams.entries()) as Partial<T>;
  const queryString = serializeParams(paramsObject);

  return {
    deserializeParams,
    getQueryParam,
    queryString,
    searchParams: paramsObject,
    serializeParams,
    setQueryParam,
    setQueryParams
  };
};

export default useQueryParams;
