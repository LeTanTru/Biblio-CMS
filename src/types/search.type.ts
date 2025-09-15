import { FieldValues, UseFormReturn } from 'react-hook-form';
import { ZodObject } from 'zod';

export type BaseSearchParamType = {
  page?: number;
  size?: number;
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
  }[];
  initialValues: Record<string, any>;
  schema: ZodObject;
  handleSearchSubmit: (values: any) => void;
  handleSearchReset: (form: UseFormReturn<any>) => void;
};
