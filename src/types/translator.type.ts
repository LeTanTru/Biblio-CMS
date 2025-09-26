import { translatorSchema, translatorSearchSchema } from '@/schemaValidations';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type TranslatorResType = {
  id: string;
  name: string;
  bio: string;
  avatarPath: string;
  kind: number;
  gender: number;
  dateOfBirth: string;
  country: string;
  createdDate: Date;
  modifiedDate: Date;
  status: number;
};

export type TranslatorBodyType = z.infer<typeof translatorSchema>;

export type TranslatorSearchType = z.infer<typeof translatorSearchSchema> &
  BaseSearchType;
