import {
  translatorSchema,
  translatorSchemaParamSchema
} from '@/schemaValidations';
import { BaseSearchParamType } from '@/types/search.type';
import z from 'zod';

export type TranslatorResType = {
  id: string;
  name: string;
  bio: string;
  avatarPath: string;
  kind: number;
  gender: number;
  dateOfBirth: Date;
  country: string;
  createdDate: Date;
  modifiedDate: Date;
  status: number;
};

export type TranslatorBodyType = z.infer<typeof translatorSchema>;

export type TranslatorSearchParamType = z.infer<
  typeof translatorSchemaParamSchema
> &
  BaseSearchParamType;
