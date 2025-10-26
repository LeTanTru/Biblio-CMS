import apiConfig from '@/constants/api-config';
import { STATUS_ACTIVE } from '@/constants/constant';
import route from '@/routes';
import { MenuItem } from '@/types';
import {
  Bell,
  BookOpen,
  ChartNoAxesCombined,
  Package,
  Settings,
  Tag,
  User,
  UsersRound
} from 'lucide-react';

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
    key: 'statistics-management',
    label: 'Quản lý thống kê',
    icon: ChartNoAxesCombined,
    children: [
      {
        key: 'statistics-list',
        label: 'Thống kê',
        path: route.statistics.getList.path
      }
    ]
  },
  {
    key: 'order-management',
    label: 'Quản lý đơn hàng',
    icon: Package,
    permissionCode: [apiConfig.order.getList.permissionCode],
    children: [
      {
        key: 'order-list',
        label: 'Đơn hàng',
        path: route.order.getList.path,
        permissionCode: [apiConfig.order.getList.permissionCode]
      }
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
        label: 'Danh mục',
        path: route.category.getList.path,
        permissionCode: [apiConfig.category.getList.permissionCode],
        query: { status: STATUS_ACTIVE }
      },
      {
        key: 'product-list',
        label: 'Sách',
        path: route.product.getList.path,
        permissionCode: [apiConfig.product.getList.permissionCode],
        query: { status: STATUS_ACTIVE }
      }
    ]
  },
  {
    key: 'coupon-management',
    label: 'Quản lý khuyến mãi',
    icon: Tag,
    permissionCode: [apiConfig.coupon.getList.permissionCode],
    children: [
      {
        key: 'coupon-list',
        label: 'Khuyến mãi',
        path: route.coupon.getList.path,
        permissionCode: [apiConfig.coupon.getList.permissionCode],
        query: { status: STATUS_ACTIVE }
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
        permissionCode: [apiConfig.author.getList.permissionCode],
        query: { status: STATUS_ACTIVE }
      },
      {
        key: 'translator-list',
        label: 'Dịch giả',
        path: route.translator.getList.path,
        permissionCode: [apiConfig.translator.getList.permissionCode],
        query: { status: STATUS_ACTIVE }
      },
      {
        key: 'publisher-list',
        label: 'Nhà xuất bản',
        path: route.publisher.getList.path,
        permissionCode: [apiConfig.publisher.getList.permissionCode],
        query: { status: STATUS_ACTIVE }
      }
    ]
  },
  {
    key: 'notification-management',
    label: 'Quản lý thông báo',
    icon: Bell,
    children: [
      {
        key: 'notification-list',
        label: 'Thông báo',
        path: route.notification.getList.path
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
