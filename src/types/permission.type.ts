import { permissionSchema } from '@/schemaValidations';
import { GroupPermissionResType } from '@/types/group-permission.type';
import { BaseSearchParamType } from '@/types/search.type';
import z from 'zod';

export type PermissionResType = {
  id: string;
  name: string;
  description: string;
  pCode: string;
  permissionGroup: GroupPermissionResType;
  createdDate: string;
  modifiedDate: string;
  status: number;
};

export type PermissionBodyType = z.infer<typeof permissionSchema>;

export type PermissionSearchParamType = BaseSearchParamType;

export type PermissionAutoResType = {
  id: string;
  name: string;
  pCode: string;
};
