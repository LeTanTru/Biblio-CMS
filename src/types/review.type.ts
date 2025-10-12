import { AccountResType } from '@/types/account.type';
import { BaseSearchType } from '@/types/search.type';

export type ReviewBodyType = {
  productId: string;
  rate: number;
  content: string;
};

export type ReviewResType = {
  id: string;
  productId: number;
  account: AccountResType;
  rate: number;
  content: string;
  createdDate: string;
  modifiedDate: string;
  status: number;
};

export type ReviewSearchType = {
  productId?: string;
} & BaseSearchType;

export type ReviewSummaryResType = {
  rate: number;
  total: number;
};
