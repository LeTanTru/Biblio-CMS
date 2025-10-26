export const DEFAULT_TABLE_PAGE_SIZE = 10;
export const DEFAULT_TABLE_PAGE_START = 0;
export const MAX_PAGE_SIZE = 1_000_000;

export const UPLOAD_SYSTEM = 1;
export const UPLOAD_AVATAR = 2;

export const KIND_ADMIN = 1;
export const KIND_EMPLOYEE = 2;
export const KIND_USER = 3;

export const STATUS_PENDING = 0;
export const STATUS_ACTIVE = 1;
export const STATUS_LOCK = -1;
export const STATUS_DELETED = -2;

export const DEFAULT_COL_SPAN = 6;

export const GENDER_MALE = 1;
export const GENDER_FEMALE = 2;
export const GENDER_OTHER = 3;

export const PRODUCT_VARIANT_CONDITION_NEW = 1;
export const PRODUCT_VARIANT_CONDITION_OLD = 2;
export const PRODUCT_VARIANT_FORMAT_HARD_COVER = 1;
export const PRODUCT_VARIANT_FORMAT_PAPER_BACK = 2;

export const COUPON_KIND_DISCOUNT = 1;
export const COUPON_KIND_FREESHIP = 2;

export const COUPON_TYPE_FIXED = 1;
export const COUPON_TYPE_PERCENTAGE = 2;

export const DEFAULT_DATE_FORMAT = 'dd/MM/yyyy';
export const DATE_TIME_FORMAT = 'HH:mm:ss, dd/MM/yyyy ';
export const DATE_DAY_TIME_FORMAT = 'EEEE, HH:mm:ss, dd/MM/yyyy';

export const CONTRIBUTOR_AUTHOR = 1;
export const CONTRIBUTOR_TRANSLATOR = 2;

export const AGE_RATING_0_2 = 1;
export const AGE_RATING_3_5 = 2;
export const AGE_RATING_6_11 = 3;
export const AGE_RATING_12_15 = 4;
export const AGE_RATING_16_18 = 5;
export const AGE_RATING_18_OVER = 6;
export const AGE_RATING_ALL = 7;

export const FEATURED_PRODUCT = 1;

export const ORDER_STATUS_WAITING = 0;
export const ORDER_STATUS_WAITING_CONFIRMATION = 1;
export const ORDER_STATUS_CONFIRMED = 2;
export const ORDER_STATUS_PACKING = 3;
export const ORDER_STATUS_SHIPPING = 4;
export const ORDER_STATUS_COMPLETE = 5;
export const ORDER_STATUS_RECEIVED = 6;
export const ORDER_STATUS_CANCELED = 7;
export const ORDER_STATUS_REQUEST_REFUND = 8;
export const ORDER_STATUS_REFUNDED = 9;

export const ORDER_DETAIL_STATUS_PLACED = 0;
export const ORDER_DETAIL_STATUS_PAID = 1;
export const ORDER_DETAIL_STATUS_WAITING_CONFIRM = 2;
export const ORDER_DETAIL_STATUS_PACKAGING = 3;
export const ORDER_DETAIL_STATUS_SHIPPING = 4;
export const ORDER_DETAIL_STATUS_DELIVERED = 5;
export const ORDER_DETAIL_STATUS_RECEIVED = 6;
export const ORDER_DETAIL_STATUS_CANCELLED = 7;
export const ORDER_DETAIL_STATUS_REQUEST_REFUND = 8;
export const ORDER_DETAIL_STATUS_REFUNDED = 9;
export const ORDER_STATUS_REJECT_ORDER = 10;
export const ORDER_STATUS_REJECT_REFUND = 11;

export const PAYMENT_COD = 1;
export const PAYMENT_VNPAY = 2;

export const CMD_CONFIRM_ORDER = 'CMD_CONFIRM_ORDER';
export const CMD_START_PACKING = 'CMD_START_PACKING';
export const CMD_START_SHIPPING = 'CMD_START_SHIPPING';
export const CMD_DELIVERED = 'CMD_DELIVERED';
export const CMD_CONFIRM_REFUNDED = 'CMD_CONFIRM_REFUNDED';
export const CMD_REJECT_ORDER = 'CMD_REJECT_ORDER';
export const CMD_REJECT_REFUNDED = 'CMD_REJECT_REFUNDED';

export const REVIEW_HIDDEN = 0;
export const REVIEW_VISIBLE = 1;

export const NOTIFICATION_TYPE_ORDER = 1;
