import { apiConfig } from '@/constants';

const defineRoute = <T extends Record<string, any>>(routes: T): T => routes;

const route = defineRoute({
  home: {
    path: '/'
  },
  account: {
    getList: {
      path: '/account',
      auth: true,
      permissionCode: [apiConfig.account.getList.permissionCode]
    }
  },
  employee: {
    path: '/employee'
  },
  group: {
    getList: {
      path: '/group-permission',
      auth: true,
      permissionCode: [apiConfig.group.getList.permissionCode]
    },
    savePage: {
      path: '/group-permission/:id',
      auth: true,
      permissionCode: [
        apiConfig.group.create.permissionCode,
        apiConfig.group.update.permissionCode
      ]
    }
  },
  login: {
    path: '/login',
    auth: false
  },
  profile: {
    savePage: {
      path: '/profile',
      auth: true
    }
  },
  category: {
    getList: {
      path: '/category',
      auth: true,
      permissionCode: [apiConfig.category.getList.permissionCode]
    },
    savePage: {
      path: '/category/:id',
      auth: true,
      permissionCode: [
        apiConfig.category.create.permissionCode,
        apiConfig.category.update.permissionCode
      ]
    }
  },
  product: {
    getList: {
      path: '/product',
      auth: true,
      permissionCode: [apiConfig.product.getList.permissionCode]
    },
    savePage: {
      path: '/product/:id',
      auth: true,
      permissionCode: [
        apiConfig.product.create.permissionCode,
        apiConfig.product.update.permissionCode
      ]
    }
  },
  productVariant: {
    getList: {
      path: '/product/:id/product-variant',
      auth: true,
      permissionCode: [apiConfig.productVariant.getList.permissionCode]
    },
    savePage: {
      path: '/product/:id/product-variant/:id',
      auth: true,
      permissionCode: [
        apiConfig.productVariant.create.permissionCode,
        apiConfig.productImage.update.permissionCode
      ]
    }
  },
  publisher: {
    getList: {
      path: '/publisher',
      auth: true,
      permissionCode: [apiConfig.publisher.getList.permissionCode]
    },
    savePage: {
      path: '/publisher/:id',
      auth: true,
      permissionCode: [
        apiConfig.publisher.create.permissionCode,
        apiConfig.publisher.update.permissionCode
      ]
    }
  },
  author: {
    getList: {
      path: '/author',
      auth: true,
      permissionCode: [apiConfig.author.getList.permissionCode]
    },
    savePage: {
      path: '/author/:id',
      auth: true,
      permissionCode: [
        apiConfig.author.create.permissionCode,
        apiConfig.author.update.permissionCode
      ]
    }
  },
  translator: {
    getList: {
      path: '/translator',
      auth: true,
      permissionCode: [apiConfig.translator.getList.permissionCode]
    },
    savePage: {
      path: '/translator/:id',
      auth: true,
      permissionCode: [
        apiConfig.translator.create.permissionCode,
        apiConfig.translator.update.permissionCode
      ]
    }
  },
  coupon: {
    getList: {
      path: '/coupon',
      auth: true,
      permissionCode: [apiConfig.coupon.getList.permissionCode]
    },
    savePage: {
      path: '/coupon/:id',
      auth: true,
      permissionCode: [
        apiConfig.coupon.create.permissionCode,
        apiConfig.coupon.update.permissionCode
      ]
    }
  },
  order: {
    getList: {
      path: '/order',
      auth: true,
      permissionCode: [apiConfig.order.getList.permissionCode]
    },
    savePage: {
      path: '/order/:id',
      auth: true,
      permissionCode: [apiConfig.order.updateStatus.permissionCode]
    }
  },
  notification: {
    getList: {
      path: '/notification',
      auth: true
    }
  }
});

export default route;
