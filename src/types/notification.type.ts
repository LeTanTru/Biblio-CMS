import { notificationSchema } from '@/schemaValidations';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type NotificationResType = {
  id: string;
  title: string;
  imageUrl: string;
  content: string;
  accountId: number;
  type: number;
  data: string;
  seen: boolean;
  lastTimeRead: string;
  createdDate: string;
};

export type NotificationSearchType = z.infer<typeof notificationSchema> &
  BaseSearchType;
