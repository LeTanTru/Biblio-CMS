import AppConstants from '@/constants/app';
import { ApiConfigGroup } from '@/types';

const baseHeader = { 'Content-Type': 'application/json' };
const multipartHeader = { 'Content-Type': 'multipart/form-data' };

const defineApiConfig = <T extends ApiConfigGroup>(config: T) => config;

const apiConfig = defineApiConfig({
  account: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/account/list`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'ACC_L'
    },
    getProfile: {
      baseUrl: `${AppConstants.apiUrl}v1/account/profile`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'ACC_V'
    },
    updateProfile: {
      baseUrl: `${AppConstants.apiUrl}v1/account/update-profile`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'ACC_U'
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}v1/account/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      permissionCode: 'ACC_D'
    },
    countNewUser: {
      baseUrl: `${AppConstants.apiUrl}v1/account/statistics/new-customer`,
      method: 'GET',
      headers: baseHeader
    },
    getAccountStatistics: {
      baseUrl: `${AppConstants.apiUrl}v1/account/statistics/daily`,
      method: 'GET',
      headers: baseHeader
    }
  },
  auth: {
    login: {
      baseUrl: `${AppConstants.apiUrl}v1/auth/login`,
      method: 'POST',
      headers: baseHeader
    },
    api: {
      login: {
        baseUrl: '/api/auth/login',
        method: 'POST',
        headers: baseHeader
      },
      logout: {
        baseUrl: '/api/auth/logout',
        method: 'POST',
        headers: baseHeader
      }
    }
  },
  file: {
    upload: {
      baseUrl: `${AppConstants.mediaUrl}v1/file/upload`,
      method: 'POST',
      headers: multipartHeader,
      isUpload: true,
      permissionCode: 'FILE_U'
    }
  },
  group: {
    create: {
      baseUrl: `${AppConstants.apiUrl}v1/group/create`,
      method: 'POST',
      headers: baseHeader,
      permissionCode: 'GR_C'
    },
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/group/list`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'GR_L'
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/group/get/:id`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'GR_V'
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}v1/group/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      permissionCode: 'GR_D'
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}v1/group/update`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'GR_U'
    }
  },
  permission: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/permission/list`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'PER_L'
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}v1/permission/create`,
      method: 'POST',
      headers: baseHeader,
      permissionCode: 'PER_C'
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}v1/permission/update`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'PER_U'
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/permission/get/:id`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'PER_V'
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}v1/permission/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      permissionCode: 'PER_D'
    }
  },
  groupPermission: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/permission-group/list`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'PER_GR_L1'
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}v1/permission-group/create`,
      method: 'POST',
      headers: baseHeader,
      permissionCode: 'PER_GR_C'
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}v1/permission-group/update`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'PER_GR_U'
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/permission-group/get/:id`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'PER_GR_V'
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}v1/permission-group/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      permissionCode: 'PER_GR_D'
    }
  },
  category: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/category/private/list`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'CAT_L'
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}v1/category/create`,
      method: 'POST',
      headers: baseHeader,
      permissionCode: 'CAT_C'
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}v1/category/update`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'CAT_U'
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/category/private/get/:id`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'CAT_V'
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}v1/category/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      permissionCode: 'CAT_D'
    },
    autoComplete: {
      baseUrl: `${AppConstants.apiUrl}v1/category/auto-complete`,
      method: 'GET',
      headers: baseHeader
    },
    updateOrdering: {
      baseUrl: `${AppConstants.apiUrl}v1/category/update-ordering`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'CAT_U'
    },
    recover: {
      baseUrl: `${AppConstants.apiUrl}v1/category/recover/:id`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'CAT_U'
    }
  },
  product: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/product/private/list`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'PRD_L'
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}v1/product/create`,
      method: 'POST',
      headers: baseHeader,
      permissionCode: 'PRD_C'
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}v1/product/update`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'PRD_U'
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/product/private/get/:id`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'PRD_V'
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}v1/product/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      permissionCode: 'PRD_D'
    },
    recover: {
      baseUrl: `${AppConstants.apiUrl}v1/product/recover/:id`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'PRD_U'
    },
    getTopView: {
      baseUrl: `${AppConstants.apiUrl}v1/product/top-views`,
      method: 'GET',
      headers: baseHeader
    },
    getLatest: {
      baseUrl: `${AppConstants.apiUrl}v1/product/latest`,
      headers: baseHeader,
      method: 'GET'
    },
    getTopDiscount: {
      baseUrl: `${AppConstants.apiUrl}v1/product/top-discount`,
      headers: baseHeader,
      method: 'GET'
    },
    getBestSeller: {
      baseUrl: `${AppConstants.apiUrl}v1/product/best-seller`,
      headers: baseHeader,
      method: 'GET'
    }
  },
  productVariant: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/product-variant/private/list`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'PRD_V_L'
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}v1/product-variant/create`,
      method: 'POST',
      headers: baseHeader,
      permissionCode: 'PRD_V_C'
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}v1/product-variant/update`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'PRD_V_U'
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/product-variant/private/get/:id`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'PRD_V_V'
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}v1/product-variant/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      permissionCode: 'PRD_V_D'
    },
    recover: {
      baseUrl: `${AppConstants.apiUrl}v1/product-variant/recover/:id`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'PRD_V_U'
    }
  },
  productImage: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/product-image/list`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'PRD_IMG_L'
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}v1/product-image/create`,
      method: 'POST',
      headers: baseHeader,
      permissionCode: 'PRD_IMG_C'
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}v1/product-image/update`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'PRD_IMG_U'
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/product-image/get/:id`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'PRD_IMG_V'
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}v1/product-image/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      permissionCode: 'PRD_IMG_D'
    },
    updateOrdering: {
      baseUrl: `${AppConstants.apiUrl}v1/product-image/update-ordering`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'PRD_IMG_U'
    },
    setDefault: {
      baseUrl: `${AppConstants.apiUrl}v1/product-image/set-default`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'PRD_IMG_U'
    }
  },
  publisher: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/publisher/private/list`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'PUB_L'
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}v1/publisher/create`,
      method: 'POST',
      headers: baseHeader,
      permissionCode: 'PUB_C'
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}v1/publisher/update`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'PUB_U'
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/publisher/get/:id`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'PUB_V'
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}v1/publisher/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      permissionCode: 'PUB_D'
    },
    recover: {
      baseUrl: `${AppConstants.apiUrl}v1/publisher/recover/:id`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'PUB_U'
    },
    autoComplete: {
      baseUrl: `${AppConstants.apiUrl}v1/publisher/auto-complete`,
      method: 'GET',
      headers: baseHeader
    }
  },
  author: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/author/private/list`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'AUTH_L'
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}v1/author/create`,
      method: 'POST',
      headers: baseHeader,
      permissionCode: 'AUTH_C'
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}v1/author/update`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'AUTH_U'
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/author/private/get/:id`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'AUTH_V'
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}v1/author/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      permissionCode: 'AUTH_D'
    },
    recover: {
      baseUrl: `${AppConstants.apiUrl}v1/author/recover/:id`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'AUTH_U'
    },
    autoComplete: {
      baseUrl: `${AppConstants.apiUrl}v1/author/auto-complete`,
      method: 'GET',
      headers: baseHeader
    }
  },
  translator: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/translator/private/list`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'TRANS_L'
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}v1/translator/create`,
      method: 'POST',
      headers: baseHeader,
      permissionCode: 'TRANS_C'
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}v1/translator/update`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'TRANS_U'
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/translator/private/get/:id`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'TRANS_V'
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}v1/translator/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      permissionCode: 'TRANS_D'
    },
    recover: {
      baseUrl: `${AppConstants.apiUrl}v1/translator/recover/:id`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'AUTH_U'
    },
    autoComplete: {
      baseUrl: `${AppConstants.apiUrl}v1/translator/auto-complete`,
      method: 'GET',
      headers: baseHeader
    }
  },
  coupon: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/coupon/private/list`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'CP_L'
    },
    create: {
      baseUrl: `${AppConstants.apiUrl}v1/coupon/create`,
      method: 'POST',
      headers: baseHeader,
      permissionCode: 'CP_C'
    },
    update: {
      baseUrl: `${AppConstants.apiUrl}v1/coupon/update`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'CP_U'
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/coupon/private/get/:id`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'CP_V'
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}v1/coupon/delete/:id`,
      method: 'DELETE',
      headers: baseHeader,
      permissionCode: 'CP_D'
    },
    recover: {
      baseUrl: `${AppConstants.apiUrl}v1/coupon/recover/:id`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'CP_U'
    }
  },
  order: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/order/private/list`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'ORD_L'
    },
    getById: {
      baseUrl: `${AppConstants.apiUrl}v1/order/private/get/:id`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'ORD_V'
    },
    updateStatus: {
      baseUrl: `${AppConstants.apiUrl}v1/order/update-status`,
      method: 'PUT',
      headers: baseHeader,
      permissionCode: 'ORD_U'
    },
    revenue: {
      baseUrl: `${AppConstants.apiUrl}v1/order/revenue`,
      method: 'GET',
      headers: baseHeader
    },
    getStatusRatio: {
      baseUrl: `${AppConstants.apiUrl}v1/order/statistics/order-status`,
      method: 'GET',
      headers: baseHeader
    },
    getRevenueStatistics: {
      baseUrl: `${AppConstants.apiUrl}v1/order/statistics/revenue`,
      method: 'GET',
      headers: baseHeader
    }
  },
  review: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/review/private/list`,
      method: 'GET',
      headers: baseHeader,
      permissionCode: 'REV_L'
    },
    summary: {
      baseUrl: `${AppConstants.apiUrl}v1/review/summary/:productId`,
      method: 'GET',
      headers: baseHeader
    },
    getTopReviewList: {
      baseUrl: `${AppConstants.apiUrl}v1/review/top-review`,
      method: 'GET',
      headers: baseHeader
    }
  },
  notification: {
    getList: {
      baseUrl: `${AppConstants.apiUrl}v1/notification/list`,
      method: 'GET',
      headers: baseHeader
    },
    countUnread: {
      baseUrl: `${AppConstants.apiUrl}v1/notification/count-unread`,
      method: 'GET',
      headers: baseHeader
    },
    markRead: {
      baseUrl: `${AppConstants.apiUrl}v1/notification/mark-read/:id`,
      method: 'PUT',
      headers: baseHeader
    },
    readAll: {
      baseUrl: `${AppConstants.apiUrl}v1/notification/read-all`,
      method: 'PUT',
      headers: baseHeader
    },
    deleteAll: {
      baseUrl: `${AppConstants.apiUrl}v1/notification/delete-all`,
      method: 'DELETE',
      headers: baseHeader
    },
    delete: {
      baseUrl: `${AppConstants.apiUrl}v1/notification/delete/:id`,
      method: 'DELETE',
      headers: baseHeader
    }
  },
  favorite: {
    getTopFavoriteList: {
      baseUrl: `${AppConstants.apiUrl}v1/favorite-product/top-favorite`,
      headers: baseHeader,
      method: 'GET'
    }
  },
  viewedProduct: {
    getTopViewedList: {
      baseUrl: `${AppConstants.apiUrl}v1/viewed-product/top-viewed`,
      headers: baseHeader,
      method: 'GET'
    }
  }
});

export default apiConfig;
