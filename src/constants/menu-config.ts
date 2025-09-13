import apiConfig from '@/constants/api-config';
import route from '@/routes';
import { MenuItem } from '@/types';
import { BookOpen, Settings, User, UsersRound } from 'lucide-react';

const menuConfig: MenuItem[] = [
  {
    key: 'account-management',
    label: 'Quản lý tài khoản',
    icon: User,
    permissionCode: [apiConfig.account.getList.permissionCode],
    children: [
      {
        key: 'account-list',
        label: 'Tài khoản',
        path: route.account.getList.path,
        permissionCode: [apiConfig.account.getList.permissionCode]
      }
      // {
      //   key: 'employee-list',
      //   label: 'Nhân viên',
      //   path: route.employee.path
      // }
    ]
  },
  {
    key: 'product-management',
    label: 'Quản lý sách',
    icon: BookOpen,
    permissionCode: [apiConfig.category.getList.permissionCode],
    children: [
      {
        key: 'category-list',
        label: 'Danh mục sách',
        path: route.category.getList.path,
        permissionCode: [apiConfig.category.getList.permissionCode]
      },
      {
        key: 'product-list',
        label: 'Sách',
        path: route.product.getList.path,
        permissionCode: [apiConfig.product.getList.permissionCode]
      }
    ]
  },
  {
    key: 'contributor-management',
    label: 'Quản lý nhà đóng góp',
    icon: UsersRound,
    permissionCode: [
      apiConfig.author.getList.permissionCode,
      apiConfig.translator.getList.permissionCode,
      apiConfig.translator.getList.permissionCode
    ],
    children: [
      {
        key: 'author-list',
        label: 'Tác giả',
        path: route.author.getList.path,
        permissionCode: [apiConfig.author.getList.permissionCode]
      },
      {
        key: 'translator-list',
        label: 'Dịch giả',
        path: route.translator.getList.path,
        permissionCode: [apiConfig.translator.getList.permissionCode]
      },
      {
        key: 'publisher-list',
        label: 'Nhà xuất bản',
        path: route.publisher.getList.path,
        permissionCode: [apiConfig.publisher.getList.permissionCode]
      }
    ]
  },
  {
    key: 'system-management',
    label: 'Quản lý hệ thống',
    icon: Settings,
    permissionCode: [
      apiConfig.group.getList.permissionCode,
      apiConfig.groupPermission.getList.permissionCode,
      apiConfig.permission.getList.permissionCode
    ],
    children: [
      {
        key: 'permission',
        label: 'Quyền',
        path: route.group.getList.path,
        permissionCode: [apiConfig.group.getList.permissionCode]
      }
    ]
  }
];

export default menuConfig;
