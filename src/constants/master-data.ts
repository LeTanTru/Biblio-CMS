import { cod, vnPAY } from '@/assets';
import {
  AGE_RATING_0_2,
  AGE_RATING_12_15,
  AGE_RATING_16_18,
  AGE_RATING_18_OVER,
  AGE_RATING_3_5,
  AGE_RATING_6_11,
  AGE_RATING_ALL,
  COUPON_KIND_DISCOUNT,
  COUPON_KIND_FREESHIP,
  COUPON_TYPE_FIXED,
  COUPON_TYPE_PERCENTAGE,
  FEATURED_PRODUCT,
  GENDER_FEMALE,
  GENDER_MALE,
  GENDER_OTHER,
  KIND_ADMIN,
  KIND_EMPLOYEE,
  KIND_USER,
  ORDER_DETAIL_STATUS_RECEIVED,
  ORDER_DETAIL_STATUS_DELIVERED,
  ORDER_DETAIL_STATUS_PACKAGING,
  ORDER_DETAIL_STATUS_PAID,
  ORDER_DETAIL_STATUS_PLACED,
  ORDER_DETAIL_STATUS_SHIPPING,
  ORDER_DETAIL_STATUS_WAITING_CONFIRM,
  ORDER_STATUS_CANCELED,
  ORDER_STATUS_COMPLETE,
  ORDER_STATUS_CONFIRMED,
  ORDER_STATUS_PACKING,
  ORDER_STATUS_RECEIVED,
  ORDER_STATUS_REFUNDED,
  ORDER_STATUS_REQUEST_REFUND,
  ORDER_STATUS_SHIPPING,
  ORDER_STATUS_WAITING,
  ORDER_STATUS_WAITING_CONFIRMATION,
  PAYMENT_COD,
  PAYMENT_VNPAY,
  PRODUCT_VARIANT_CONDITION_NEW,
  PRODUCT_VARIANT_CONDITION_OLD,
  PRODUCT_VARIANT_FORMAT_HARD_COVER,
  PRODUCT_VARIANT_FORMAT_PAPER_BACK,
  STATUS_ACTIVE,
  STATUS_DELETED,
  STATUS_LOCK,
  STATUS_PENDING,
  UPLOAD_AVATAR,
  UPLOAD_SYSTEM,
  ORDER_STATUS_REJECT_REFUND,
  ORDER_STATUS_REJECT_ORDER
} from '@/constants/constant';

import { PackageCheck } from 'lucide-react';
import { FaMoneyBill } from 'react-icons/fa';
import {
  RiCheckLine,
  RiPencilLine,
  RiStarLine,
  RiSurveyFill,
  RiTruckLine
} from 'react-icons/ri';

export const uploadOptions = {
  SYSTEM: UPLOAD_SYSTEM,
  AVATAR: UPLOAD_AVATAR
};

export const groupKinds = [
  {
    label: 'ADMIN',
    value: KIND_ADMIN,
    color: '#EF4444'
  },
  {
    label: 'EMPLOYEE',
    value: KIND_EMPLOYEE,
    color: '#3B82F6'
  },
  {
    label: 'USER',
    value: KIND_USER,
    color: '#10B981'
  }
];

export const statusOptions = [
  {
    value: STATUS_ACTIVE,
    label: 'Hoạt động',
    color: '#28a745'
  },
  {
    value: STATUS_PENDING,
    label: 'Đang chờ',
    color: '#ffc107'
  },
  {
    value: STATUS_LOCK,
    label: 'Khóa',
    color: '#fd7e14'
  },
  {
    value: STATUS_DELETED,
    label: 'Đã xóa',
    color: '#dc3545'
  }
];

export const countryOptions: { label: string; value: string }[] = [
  { label: 'Afghanistan', value: 'AF' },
  { label: 'Albania', value: 'AL' },
  { label: 'Algérie', value: 'DZ' },
  { label: 'Andorra', value: 'AD' },
  { label: 'Angola', value: 'AO' },
  { label: 'Antigua và Barbuda', value: 'AG' },
  { label: 'Argentina', value: 'AR' },
  { label: 'Armenia', value: 'AM' },
  { label: 'Úc', value: 'AU' },
  { label: 'Áo', value: 'AT' },
  { label: 'Azerbaijan', value: 'AZ' },
  { label: 'Bahamas', value: 'BS' },
  { label: 'Bahrain', value: 'BH' },
  { label: 'Bangladesh', value: 'BD' },
  { label: 'Barbados', value: 'BB' },
  { label: 'Belarus', value: 'BY' },
  { label: 'Bỉ', value: 'BE' },
  { label: 'Belize', value: 'BZ' },
  { label: 'Benin', value: 'BJ' },
  { label: 'Bhutan', value: 'BT' },
  { label: 'Bolivia', value: 'BO' },
  { label: 'Bosnia và Herzegovina', value: 'BA' },
  { label: 'Botswana', value: 'BW' },
  { label: 'Brasil', value: 'BR' },
  { label: 'Brunei', value: 'BN' },
  { label: 'Bulgaria', value: 'BG' },
  { label: 'Burkina Faso', value: 'BF' },
  { label: 'Burundi', value: 'BI' },
  { label: 'Cabo Verde', value: 'CV' },
  { label: 'Campuchia', value: 'KH' },
  { label: 'Cameroon', value: 'CM' },
  { label: 'Canada', value: 'CA' },
  { label: 'Cộng hòa Trung Phi', value: 'CF' },
  { label: 'Tchad', value: 'TD' },
  { label: 'Chile', value: 'CL' },
  { label: 'Trung Quốc', value: 'CN' },
  { label: 'Colombia', value: 'CO' },
  { label: 'Comoros', value: 'KM' },
  { label: 'Congo', value: 'CG' },
  { label: 'Cộng hòa Dân chủ Congo', value: 'CD' },
  { label: 'Costa Rica', value: 'CR' },
  { label: 'Croatia', value: 'HR' },
  { label: 'Cuba', value: 'CU' },
  { label: 'Síp', value: 'CY' },
  { label: 'Cộng hòa Séc', value: 'CZ' },
  { label: 'Đan Mạch', value: 'DK' },
  { label: 'Djibouti', value: 'DJ' },
  { label: 'Dominica', value: 'DM' },
  { label: 'Cộng hòa Dominica', value: 'DO' },
  { label: 'Ecuador', value: 'EC' },
  { label: 'Ai Cập', value: 'EG' },
  { label: 'El Salvador', value: 'SV' },
  { label: 'Guinea Xích đạo', value: 'GQ' },
  { label: 'Eritrea', value: 'ER' },
  { label: 'Estonia', value: 'EE' },
  { label: 'Eswatini', value: 'SZ' },
  { label: 'Ethiopia', value: 'ET' },
  { label: 'Fiji', value: 'FJ' },
  { label: 'Phần Lan', value: 'FI' },
  { label: 'Pháp', value: 'FR' },
  { label: 'Gabon', value: 'GA' },
  { label: 'Gambia', value: 'GM' },
  { label: 'Georgia', value: 'GE' },
  { label: 'Đức', value: 'DE' },
  { label: 'Ghana', value: 'GH' },
  { label: 'Hy Lạp', value: 'GR' },
  { label: 'Grenada', value: 'GD' },
  { label: 'Guatemala', value: 'GT' },
  { label: 'Guinea', value: 'GN' },
  { label: 'Guinea-Bissau', value: 'GW' },
  { label: 'Guyana', value: 'GY' },
  { label: 'Haiti', value: 'HT' },
  { label: 'Honduras', value: 'HN' },
  { label: 'Hungary', value: 'HU' },
  { label: 'Iceland', value: 'IS' },
  { label: 'Ấn Độ', value: 'IN' },
  { label: 'Indonesia', value: 'ID' },
  { label: 'Iran', value: 'IR' },
  { label: 'Iraq', value: 'IQ' },
  { label: 'Ireland', value: 'IE' },
  { label: 'Israel', value: 'IL' },
  { label: 'Ý', value: 'IT' },
  { label: 'Jamaica', value: 'JM' },
  { label: 'Nhật Bản', value: 'JP' },
  { label: 'Jordan', value: 'JO' },
  { label: 'Kazakhstan', value: 'KZ' },
  { label: 'Kenya', value: 'KE' },
  { label: 'Kiribati', value: 'KI' },
  { label: 'Triều Tiên', value: 'KP' },
  { label: 'Hàn Quốc', value: 'KR' },
  { label: 'Kuwait', value: 'KW' },
  { label: 'Kyrgyzstan', value: 'KG' },
  { label: 'Lào', value: 'LA' },
  { label: 'Latvia', value: 'LV' },
  { label: 'Liban', value: 'LB' },
  { label: 'Lesotho', value: 'LS' },
  { label: 'Liberia', value: 'LR' },
  { label: 'Libya', value: 'LY' },
  { label: 'Liechtenstein', value: 'LI' },
  { label: 'Litva', value: 'LT' },
  { label: 'Luxembourg', value: 'LU' },
  { label: 'Madagascar', value: 'MG' },
  { label: 'Malawi', value: 'MW' },
  { label: 'Malaysia', value: 'MY' },
  { label: 'Maldives', value: 'MV' },
  { label: 'Mali', value: 'ML' },
  { label: 'Malta', value: 'MT' },
  { label: 'Quần đảo Marshall', value: 'MH' },
  { label: 'Mauritania', value: 'MR' },
  { label: 'Mauritius', value: 'MU' },
  { label: 'Mexico', value: 'MX' },
  { label: 'Micronesia', value: 'FM' },
  { label: 'Moldova', value: 'MD' },
  { label: 'Monaco', value: 'MC' },
  { label: 'Mông Cổ', value: 'MN' },
  { label: 'Montenegro', value: 'ME' },
  { label: 'Morocco', value: 'MA' },
  { label: 'Mozambique', value: 'MZ' },
  { label: 'Myanmar', value: 'MM' },
  { label: 'Namibia', value: 'NA' },
  { label: 'Nauru', value: 'NR' },
  { label: 'Nepal', value: 'NP' },
  { label: 'Hà Lan', value: 'NL' },
  { label: 'New Zealand', value: 'NZ' },
  { label: 'Nicaragua', value: 'NI' },
  { label: 'Niger', value: 'NE' },
  { label: 'Nigeria', value: 'NG' },
  { label: 'Bắc Macedonia', value: 'MK' },
  { label: 'Na Uy', value: 'NO' },
  { label: 'Oman', value: 'OM' },
  { label: 'Pakistan', value: 'PK' },
  { label: 'Palau', value: 'PW' },
  { label: 'Palestine', value: 'PS' },
  { label: 'Panama', value: 'PA' },
  { label: 'Papua New Guinea', value: 'PG' },
  { label: 'Paraguay', value: 'PY' },
  { label: 'Peru', value: 'PE' },
  { label: 'Philippines', value: 'PH' },
  { label: 'Ba Lan', value: 'PL' },
  { label: 'Bồ Đào Nha', value: 'PT' },
  { label: 'Qatar', value: 'QA' },
  { label: 'Rumani', value: 'RO' },
  { label: 'Nga', value: 'RU' },
  { label: 'Rwanda', value: 'RW' },
  { label: 'Saint Kitts và Nevis', value: 'KN' },
  { label: 'Saint Lucia', value: 'LC' },
  { label: 'Saint Vincent và Grenadines', value: 'VC' },
  { label: 'Samoa', value: 'WS' },
  { label: 'San Marino', value: 'SM' },
  { label: 'São Tomé và Príncipe', value: 'ST' },
  { label: 'Ả Rập Saudi', value: 'SA' },
  { label: 'Senegal', value: 'SN' },
  { label: 'Serbia', value: 'RS' },
  { label: 'Seychelles', value: 'SC' },
  { label: 'Sierra Leone', value: 'SL' },
  { label: 'Singapore', value: 'SG' },
  { label: 'Slovakia', value: 'SK' },
  { label: 'Slovenia', value: 'SI' },
  { label: 'Quần đảo Solomon', value: 'SB' },
  { label: 'Somalia', value: 'SO' },
  { label: 'Nam Phi', value: 'ZA' },
  { label: 'Nam Sudan', value: 'SS' },
  { label: 'Tây Ban Nha', value: 'ES' },
  { label: 'Sri Lanka', value: 'LK' },
  { label: 'Sudan', value: 'SD' },
  { label: 'Suriname', value: 'SR' },
  { label: 'Thụy Điển', value: 'SE' },
  { label: 'Thụy Sĩ', value: 'CH' },
  { label: 'Syria', value: 'SY' },
  { label: 'Đài Loan', value: 'TW' },
  { label: 'Tajikistan', value: 'TJ' },
  { label: 'Tanzania', value: 'TZ' },
  { label: 'Thái Lan', value: 'TH' },
  { label: 'Timor-Leste', value: 'TL' },
  { label: 'Togo', value: 'TG' },
  { label: 'Tonga', value: 'TO' },
  { label: 'Trinidad và Tobago', value: 'TT' },
  { label: 'Tunisia', value: 'TN' },
  { label: 'Thổ Nhĩ Kỳ', value: 'TR' },
  { label: 'Turkmenistan', value: 'TM' },
  { label: 'Tuvalu', value: 'TV' },
  { label: 'Uganda', value: 'UG' },
  { label: 'Ukraina', value: 'UA' },
  { label: 'Các Tiểu vương quốc Ả Rập Thống nhất', value: 'AE' },
  { label: 'Vương quốc Anh', value: 'GB' },
  { label: 'Mỹ', value: 'US' },
  { label: 'Uruguay', value: 'UY' },
  { label: 'Uzbekistan', value: 'UZ' },
  { label: 'Vanuatu', value: 'VU' },
  { label: 'Vatican', value: 'VA' },
  { label: 'Venezuela', value: 'VE' },
  { label: 'Việt Nam', value: 'VN' },
  { label: 'Yemen', value: 'YE' },
  { label: 'Zambia', value: 'ZM' },
  { label: 'Zimbabwe', value: 'ZW' }
];

export const languageOptions: { label: string; value: string }[] = [
  { label: 'Tiếng Ả Rập', value: 'ar' },
  { label: 'Tiếng Albania', value: 'sq' },
  { label: 'Tiếng Amharic', value: 'am' },
  { label: 'Tiếng Armenia', value: 'hy' },
  { label: 'Tiếng Azerbaijan', value: 'az' },
  { label: 'Tiếng Ba Lan', value: 'pl' },
  { label: 'Tiếng Basque', value: 'eu' },
  { label: 'Tiếng Belarus', value: 'be' },
  { label: 'Tiếng Bengal', value: 'bn' },
  { label: 'Tiếng Bồ Đào Nha', value: 'pt' },
  { label: 'Tiếng Bosnia', value: 'bs' },
  { label: 'Tiếng Bulgaria', value: 'bg' },
  { label: 'Tiếng Catalan', value: 'ca' },
  { label: 'Tiếng Cebuano', value: 'ceb' },
  { label: 'Tiếng Croatia', value: 'hr' },
  { label: 'Tiếng Czech', value: 'cs' },
  { label: 'Tiếng Do Thái', value: 'he' },
  { label: 'Tiếng Đức', value: 'de' },
  { label: 'Tiếng Dzongkha', value: 'dz' },
  { label: 'Tiếng Estonia', value: 'et' },
  { label: 'Tiếng Filipino', value: 'fil' },
  { label: 'Tiếng Phần Lan', value: 'fi' },
  { label: 'Tiếng Pháp', value: 'fr' },
  { label: 'Tiếng Georgia', value: 'ka' },
  { label: 'Tiếng Gujarati', value: 'gu' },
  { label: 'Tiếng Hà Lan', value: 'nl' },
  { label: 'Tiếng Hán (Giản thể)', value: 'zh' },
  { label: 'Tiếng Hán (Phồn thể)', value: 'zh-TW' },
  { label: 'Tiếng Hàn', value: 'ko' },
  { label: 'Tiếng Hausa', value: 'ha' },
  { label: 'Tiếng Hindi', value: 'hi' },
  { label: 'Tiếng Hungary', value: 'hu' },
  { label: 'Tiếng Hy Lạp', value: 'el' },
  { label: 'Tiếng Iceland', value: 'is' },
  { label: 'Tiếng Indonesia', value: 'id' },
  { label: 'Tiếng Ireland', value: 'ga' },
  { label: 'Tiếng Italy', value: 'it' },
  { label: 'Tiếng Nhật', value: 'ja' },
  { label: 'Tiếng Java', value: 'jv' },
  { label: 'Tiếng Kannada', value: 'kn' },
  { label: 'Tiếng Kazakh', value: 'kk' },
  { label: 'Tiếng Khmer', value: 'km' },
  { label: 'Tiếng Kinyarwanda', value: 'rw' },
  { label: 'Tiếng Kirghiz', value: 'ky' },
  { label: 'Tiếng Kurd', value: 'ku' },
  { label: 'Tiếng Lào', value: 'lo' },
  { label: 'Tiếng Latvia', value: 'lv' },
  { label: 'Tiếng Lithuania', value: 'lt' },
  { label: 'Tiếng Luxembourg', value: 'lb' },
  { label: 'Tiếng Macedonia', value: 'mk' },
  { label: 'Tiếng Malagasy', value: 'mg' },
  { label: 'Tiếng Malay', value: 'ms' },
  { label: 'Tiếng Malayalam', value: 'ml' },
  { label: 'Tiếng Maori', value: 'mi' },
  { label: 'Tiếng Marathi', value: 'mr' },
  { label: 'Tiếng Mông Cổ', value: 'mn' },
  { label: 'Tiếng Myanmar (Miến Điện)', value: 'my' },
  { label: 'Tiếng Na Uy', value: 'no' },
  { label: 'Tiếng Nepal', value: 'ne' },
  { label: 'Tiếng Pashto', value: 'ps' },
  { label: 'Tiếng Persia (Farsi)', value: 'fa' },
  { label: 'Tiếng Punjabi', value: 'pa' },
  { label: 'Tiếng Quechua', value: 'qu' },
  { label: 'Tiếng Romania', value: 'ro' },
  { label: 'Tiếng Nga', value: 'ru' },
  { label: 'Tiếng Serbia', value: 'sr' },
  { label: 'Tiếng Shona', value: 'sn' },
  { label: 'Tiếng Sindhi', value: 'sd' },
  { label: 'Tiếng Sinhala', value: 'si' },
  { label: 'Tiếng Slovakia', value: 'sk' },
  { label: 'Tiếng Slovenia', value: 'sl' },
  { label: 'Tiếng Somali', value: 'so' },
  { label: 'Tiếng Swahili', value: 'sw' },
  { label: 'Tiếng Sunda', value: 'su' },
  { label: 'Tiếng Tajik', value: 'tg' },
  { label: 'Tiếng Tamil', value: 'ta' },
  { label: 'Tiếng Tatar', value: 'tt' },
  { label: 'Tiếng Telugu', value: 'te' },
  { label: 'Tiếng Thái', value: 'th' },
  { label: 'Tiếng Thổ Nhĩ Kỳ', value: 'tr' },
  { label: 'Tiếng Turkmen', value: 'tk' },
  { label: 'Tiếng Ukraina', value: 'uk' },
  { label: 'Tiếng Urdu', value: 'ur' },
  { label: 'Tiếng Uzbek', value: 'uz' },
  { label: 'Tiếng Việt', value: 'vi' },
  { label: 'Tiếng Wales', value: 'cy' },
  { label: 'Tiếng Xhosa', value: 'xh' },
  { label: 'Tiếng Yoruba', value: 'yo' },
  { label: 'Tiếng Zulu', value: 'zu' }
];

export const FieldTypes = {
  STRING: 'STRING_TYPE',
  NUMBER: 'NUMBER_TYPE',
  SELECT: 'SELECT',
  AUTOCOMPLETE: 'AUTOCOMPLETE',
  DATE: 'DATE',
  DATE_RANGE: 'DATE_RANGE'
} as const;

export type FieldType = keyof typeof FieldTypes;

export type OptionType = {
  value: string | number;
  label: string;
  [key: string]: string | number;
};

export const genderOptions: OptionType[] = [
  { value: GENDER_MALE, label: 'Nam' },
  { value: GENDER_FEMALE, label: 'Nữ' },
  { value: GENDER_OTHER, label: 'Khác' }
];

export const contributorStatuses = [
  {
    value: STATUS_ACTIVE,
    label: 'Hoạt động',
    color: '#28a745'
  },
  {
    value: STATUS_DELETED,
    label: 'Đã xóa',
    color: '#dc3545'
  }
];

export const categoryStatuses = [
  {
    value: STATUS_ACTIVE,
    label: 'Hoạt động',
    color: '#28a745'
  },
  {
    value: STATUS_DELETED,
    label: 'Đã xóa',
    color: '#dc3545'
  }
];

export const productVariantStatuses = [
  {
    value: STATUS_ACTIVE,
    label: 'Hoạt động',
    color: '#28a745'
  },
  {
    value: STATUS_DELETED,
    label: 'Đã xóa',
    color: '#dc3545'
  }
];

export const productStatuses = [
  {
    value: STATUS_ACTIVE,
    label: 'Đang bán',
    color: '#28a745'
  },
  {
    value: STATUS_DELETED,
    label: 'Đã xóa',
    color: '#dc3545'
  }
];

export const ageRatings = [
  { label: 'Mọi lứa tuổi', value: AGE_RATING_ALL },
  { label: '0 - 2 tuổi', value: AGE_RATING_0_2 },
  { label: '3 - 5 tuổi', value: AGE_RATING_3_5 },
  { label: '6 - 11 tuổi', value: AGE_RATING_6_11 },
  { label: '12 - 15 tuổi', value: AGE_RATING_12_15 },
  { label: '16 - 18 tuổi', value: AGE_RATING_16_18 },
  { label: '18+', value: AGE_RATING_18_OVER }
];

export const queryKeys = {
  ACCOUNT: 'account',
  AUTHOR: 'author',
  CATEGORY: 'category',
  GROUP: 'group',
  GROUP_PERMISSION: 'group-permission',
  PRODUCT: 'product',
  PRODUCT_VARIANT: 'product-variant',
  PUBLISHER: 'publisher',
  TRANSLATOR: 'translator',
  COUPON: 'coupon',
  ORDER: 'order',
  REVIEW: 'review',
  NOTIFICATION: 'notification',
  STATISTICS: 'statistics',
  FAVORITE_PRODUCT: 'favorite_product',
  VIEWED_PRODUCT: 'viewed_product'
};

export const productVariantConditions = [
  {
    label: 'Mới',
    value: PRODUCT_VARIANT_CONDITION_NEW
  },
  {
    label: 'Cũ',
    value: PRODUCT_VARIANT_CONDITION_OLD
  }
];

export const productVariantFormats = [
  {
    label: 'Bìa cứng',
    value: PRODUCT_VARIANT_FORMAT_HARD_COVER
  },
  {
    label: 'Bìa mềm',
    value: PRODUCT_VARIANT_FORMAT_PAPER_BACK
  }
];

export const couponKinds = [
  {
    label: 'Giảm giá',
    value: COUPON_KIND_DISCOUNT
  },
  {
    label: 'Miễn phí ship',
    value: COUPON_KIND_FREESHIP
  }
];

export const couponTypes = [
  {
    label: 'Cố định',
    value: COUPON_TYPE_FIXED
  },
  { label: 'Theo phần trăm', value: COUPON_TYPE_PERCENTAGE }
];

export const couponStatuses = [
  {
    label: 'Còn hạn',
    value: STATUS_ACTIVE
  },
  {
    label: 'Đã xóa',
    value: STATUS_DELETED
  }
];

export const featureTypes = [
  {
    label: 'Nổi bật',
    value: FEATURED_PRODUCT
  }
];

export const orderStatuses = [
  {
    label: 'Đơn hàng đã đặt',
    value: ORDER_STATUS_WAITING,
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    label: 'Chờ xác nhận',
    value: ORDER_STATUS_WAITING_CONFIRMATION,
    color: 'bg-amber-100 text-amber-800'
  },
  {
    label: 'Đã xác nhận',
    value: ORDER_STATUS_CONFIRMED,
    color: 'bg-blue-100 text-blue-800'
  },
  {
    label: 'Đang đóng gói',
    value: ORDER_STATUS_PACKING,
    color: 'bg-indigo-100 text-indigo-800'
  },
  {
    label: 'Đang giao hàng',
    value: ORDER_STATUS_SHIPPING,
    color: 'bg-cyan-100 text-cyan-800'
  },
  {
    label: 'Giao hàng thành công',
    value: ORDER_STATUS_COMPLETE,
    color: 'bg-green-100 text-green-800'
  },
  {
    label: 'Đã nhận được hàng',
    value: ORDER_STATUS_RECEIVED,
    color: 'bg-green-100 text-green-800'
  },
  {
    label: 'Đã hủy',
    value: ORDER_STATUS_CANCELED,
    color: 'bg-red-100 text-red-800'
  },
  {
    label: 'Yêu cầu trả hàng',
    value: ORDER_STATUS_REQUEST_REFUND,
    color: 'bg-orange-100 text-orange-800'
  },
  {
    label: 'Đã hoàn tiền',
    value: ORDER_STATUS_REFUNDED,
    color: 'bg-emerald-100 text-emerald-800'
  },
  {
    label: 'Đơn hàng bị từ chối',
    value: ORDER_STATUS_REJECT_ORDER,
    color: 'bg-red-100 text-red-800'
  },
  {
    label: 'Đơn hàng bị từ chối hoàn trả',
    value: ORDER_STATUS_REJECT_REFUND,
    color: 'bg-orange-100 text-orange-800'
  }
];

export const orderDetailStatuses = [
  {
    label: 'Đơn hàng đã đặt',
    value: ORDER_DETAIL_STATUS_PLACED,
    icon: RiSurveyFill
  },
  {
    label: 'Đã thanh toán',
    value: ORDER_DETAIL_STATUS_PAID,
    icon: FaMoneyBill
  },
  {
    label: 'Chờ xác nhận',
    value: ORDER_DETAIL_STATUS_WAITING_CONFIRM,
    icon: RiPencilLine
  },
  {
    label: 'Đang đóng gói',
    value: ORDER_DETAIL_STATUS_PACKAGING,
    icon: PackageCheck
  },
  {
    label: 'Đang giao hàng',
    value: ORDER_DETAIL_STATUS_SHIPPING,
    icon: RiTruckLine
  },
  {
    label: 'Giao hàng thành công',
    value: ORDER_DETAIL_STATUS_DELIVERED,
    icon: RiCheckLine
  },
  {
    label: 'Đã nhận được hàng',
    value: ORDER_DETAIL_STATUS_RECEIVED,
    icon: RiStarLine
  }
];

export const paymentMethods = [
  {
    label: 'Thanh toán khi nhận hàng',
    icon: cod,
    value: PAYMENT_COD
  },
  {
    label: 'VNPAY',
    icon: vnPAY,
    value: PAYMENT_VNPAY
  }
];
