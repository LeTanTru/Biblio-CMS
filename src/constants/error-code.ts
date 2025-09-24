import {
  CategoryBodyType,
  ErrorMaps,
  GroupBodyType,
  PermissionBodyType
} from '@/types';
import { CouponBodyType } from '@/types/coupon.type';
import { GroupPermissionBodyType } from '@/types/group-permission.type';

export const ErrorCode = {
  // Auth
  AUTH_ERROR_UNAUTHORIZED: 'ERROR-AUTH-0002',

  // Category
  CATEGORY_ERROR_NOT_FOUND: 'ERROR-CATEGORY-0000',
  CATEGORY_ERROR_NAME_EXISTED: 'ERROR-CATEGORY-0001',
  CATEGORY_ERROR_INVALID_REQUEST: 'ERROR_CATEGORY_0002',
  CATEGORY_ERROR_IN_USE: 'ERROR_CATEGORY_0003',

  // Permission
  PERMISSION_ERROR_NOT_FOUND: 'ERROR-PERMISSION-0000',
  PERMISSION_ERROR_NAME_EXISTS: 'ERROR-PERMISSION-0001',
  PERMISSION_ERROR_CODE_EXISTS: 'ERROR-PERMISSION-0002',

  // Group
  GROUP_ERROR_NOT_FOUND: 'ERROR-GROUP-0000',
  GROUP_ERROR_NAME_EXISTS: 'ERROR-GROUP-0001',
  GROUP_ERROR_IN_USED: 'ERROR-GROUP-0002',

  // Category
  CATEGORY_ERROR_NAME_EXISTS: 'ERROR-CATEGORY-0001',

  // Permission Group
  PERMISSION_GROUP_ERROR_NOT_FOUND: 'ERROR-PERMISSION-GROUP-0000',
  PERMISSION_GROUP_ERROR_NAME_EXISTS: 'ERROR-PERMISSION-GROUP-0001',

  // Product variant
  PRODUCT_VARIANT_ERROR_EXISTED: 'ERROR-PRODUCT-VARIANT-0001',

  // Coupon
  COUPON_ERROR_NOT_FOUND: 'ERROR-COUPON-0000',
  COUPON_ERROR_CODE_EXISTED: 'ERROR-COUPON-0001',
  COUPON_ERROR_INVALID: 'ERROR-COUPON-0002'
} as const;

export const groupErrorMaps: ErrorMaps<GroupBodyType> = {
  [ErrorCode.GROUP_ERROR_NAME_EXISTS]: [
    ['name', { type: 'manual', message: 'Tên nhóm đã tồn tại' }]
  ]
};

export const categoryErrorMaps: ErrorMaps<CategoryBodyType> = {
  [ErrorCode.CATEGORY_ERROR_NAME_EXISTS]: [
    ['name', { type: 'manual', message: 'Tên danh mục tồn tại' }]
  ]
};

export const groupPermissionErrorMaps: ErrorMaps<GroupPermissionBodyType> = {
  [ErrorCode.PERMISSION_GROUP_ERROR_NAME_EXISTS]: [
    ['name', { type: 'manual', message: 'Tên nhóm quyền đã tồn tại' }]
  ]
};

export const permissionErrorMaps: ErrorMaps<PermissionBodyType> = {
  [ErrorCode.PERMISSION_ERROR_NAME_EXISTS]: [
    ['name', { type: 'manual', message: 'Tên quyền đã tồn tại' }]
  ],
  [ErrorCode.PERMISSION_ERROR_CODE_EXISTS]: [
    ['pCode', { type: 'manual', message: 'Mã quyền đã tồn tại' }]
  ]
};

export const couponErrorMaps: ErrorMaps<CouponBodyType> = {
  [ErrorCode.COUPON_ERROR_CODE_EXISTED]: [
    ['code', { type: 'manual', message: 'Mã khuyến mãi đã tồn tại' }]
  ]
};
