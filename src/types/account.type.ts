import {
  accountSearchSchema,
  updateProfileSchema
} from '@/schemaValidations/account.schema';
import { BaseSearchType } from '@/types/search.type';
import z from 'zod';

export type Group = {
  id: number;
  name: string;
  kind: number;
  subKind: number;
  description: string;
  isSystemRole: boolean;
  status: number;
};

type GroupPermission = {
  id: number;
  name: string;
};

type Permission = {
  id: number;
  name: string;
  action: string;
  showMenu: boolean;
  groupPermission: GroupPermission;
  permissionCode?: string;
};

type GroupProfile = {
  id: number;
  status: number;
  modifiedDate: string;
  createdDate: string;
  name: string;
  description: string;
  kind: number;
  subKind: number;
  permissions: Permission[];
  isSystemRole: boolean;
};

export type ProfileResType = {
  id: string;
  kind: number;
  username: string;
  email: string;
  fullName: string;
  group: GroupProfile;
  lastLogin: string;
  isSuperAdmin: boolean;
  avatarPath: string;
  phone: string;
};

export type ProfileBodyType = z.infer<typeof updateProfileSchema>;

export type AccountSearchType = z.infer<typeof accountSearchSchema> &
  BaseSearchType;

export type AccountResType = {
  id: string;
  email: string;
  fullName: string;
  avatarPath: string;
  phone: string;
  kind: number;
  isSuperAdmin: boolean;
  group: Group;
  createdDate: string;
  modifiedDate: string;
  status: number;
};
