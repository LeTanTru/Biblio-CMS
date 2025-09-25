import { ApiConfig } from '@/types/api.type';
import { FieldValues } from 'react-hook-form';
import { ZodObject } from 'zod';

export type BaseSearchParamType = {
  page?: number;
  size?: number;
};

export type AutoCompleteOption = {
  label: string;
  value: string | number;
  prefix?: React.ReactNode;
};

export type OptionType<V = string | number> = {
  label: string;
  value: V;
  color?: string;
};

export type SearchFormProps<S extends FieldValues> = {
  searchFields: {
    key: keyof S;
    type?: string;
    colSpan?: number;
    placeholder: string;
    options?: OptionType[];
    submitOnChanged?: boolean;
    apiConfig?: ApiConfig;
    mappingData?: (option: any) => AutoCompleteOption;
    searchParams?: string[];
    initialParams?: Record<string, any>;
  }[];
  initialValues: Partial<S>;
  schema: ZodObject;
  handleSearchSubmit: (values: any) => void;
  handleSearchReset: () => void;
};
