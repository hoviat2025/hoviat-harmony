export interface User {
  counter: number;
  user_id: number;
  accounting_code?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  nickname?: string;
  phone_number?: string;
  whatsapp_number?: string;
  country?: string;
  password?: string;
  mode?: string;
  is_ban: boolean;
  is_registered?: boolean;
  chat_not_found?: boolean;
  score?: number;
  ban_time?: number;
  join_date?: number;
  profile_path?: string;
  telegram_message_id?: number;
  group_message_id?: number;
  public_message_id?: number;
  public_group_message_id?: number;
  updated_at?: string;
  channel_updated_at?: string;
}

export interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    size: number;
    pages: number;
  };
  error: Record<string, unknown>;
}

export interface SingleUserResponse {
  data: User;
  meta: Record<string, unknown>;
  error: Record<string, unknown>;
}

export interface UserUpdateRequest {
  user_id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  nickname?: string;
  phone_number?: string;
  whatsapp_number?: string;
  country?: string;
  password?: string;
  is_ban?: boolean;
  is_registered?: boolean;
  chat_not_found?: boolean;
  score?: number;
  ban_time?: number;
}

export interface FilterRule {
  field: string;
  operator: 'equals' | 'contains' | 'gt' | 'lt' | 'is_empty' | 'is_full';
  value?: string | number | boolean;
}

export interface UsersFilters {
  page: number;
  size: number;
  order_by: string;
  search?: string;
  rules: FilterRule[];
}

export const FIELD_TRANSLATIONS: Record<string, string> = {
  counter: 'شمارنده',
  user_id: 'آیدی تلگرام',
  accounting_code: 'کد حسابداری',
  username: 'یوزر تلگرام',
  first_name: 'نام کوچک',
  last_name: 'نام خانوادگی',
  nickname: 'نام تلگرام',
  phone_number: 'شماره همراه',
  whatsapp_number: 'شماره واتساپ',
  country: 'کشور',
  password: 'رمز عبور',
  mode: 'حالت در ربات',
  is_ban: 'بن شده است',
  is_registered: 'رجیستر شده است',
  chat_not_found: 'چت یافت نمیشود',
  score: 'امتیاز',
  ban_time: 'تاریخ بن شدن',
  join_date: 'تاریخ عضویت',
  profile_path: 'مسیر پروفایل',
  telegram_message_id: 'آیدی پیام چنل اصلی',
  group_message_id: 'آیدی پیام کامنت اصلی',
  public_message_id: 'آیدی پیام چنل عمومی',
  public_group_message_id: 'آِیدی پیام کامنت عمومی',
  updated_at: 'تاریخ آخرین ویرایش',
  channel_updated_at: 'تاریخ آپدیت شدن چنل',
};

export const PROFILE_IMAGE_BASE_URL = 'https://pub-4036d35baed54ee7a9504072ea49740f.r2.dev/';

export type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'datetime';

export interface FieldConfig {
  name: string;
  type: FieldType;
  sortable: boolean;
  filterable: boolean;
  nullable: boolean;
}

export const FIELD_CONFIGS: FieldConfig[] = [
  { name: 'counter', type: 'number', sortable: true, filterable: true, nullable: false },
  { name: 'user_id', type: 'number', sortable: true, filterable: true, nullable: true },
  { name: 'accounting_code', type: 'text', sortable: true, filterable: true, nullable: true },
  { name: 'username', type: 'text', sortable: true, filterable: true, nullable: true },
  { name: 'first_name', type: 'text', sortable: true, filterable: true, nullable: true },
  { name: 'last_name', type: 'text', sortable: true, filterable: true, nullable: true },
  { name: 'nickname', type: 'text', sortable: true, filterable: true, nullable: true },
  { name: 'phone_number', type: 'text', sortable: true, filterable: true, nullable: true },
  { name: 'whatsapp_number', type: 'text', sortable: true, filterable: true, nullable: true },
  { name: 'country', type: 'text', sortable: true, filterable: true, nullable: true },
  { name: 'password', type: 'text', sortable: false, filterable: false, nullable: true },
  { name: 'mode', type: 'text', sortable: true, filterable: true, nullable: true },
  { name: 'is_ban', type: 'boolean', sortable: true, filterable: true, nullable: false },
  { name: 'is_registered', type: 'boolean', sortable: true, filterable: true, nullable: false },
  { name: 'chat_not_found', type: 'boolean', sortable: true, filterable: true, nullable: false },
  { name: 'score', type: 'number', sortable: true, filterable: true, nullable: true },
  { name: 'ban_time', type: 'number', sortable: true, filterable: true, nullable: true },
  { name: 'join_date', type: 'date', sortable: true, filterable: true, nullable: true },
  { name: 'profile_path', type: 'text', sortable: false, filterable: true, nullable: true },
  { name: 'telegram_message_id', type: 'number', sortable: false, filterable: true, nullable: true },
  { name: 'group_message_id', type: 'number', sortable: false, filterable: true, nullable: true },
  { name: 'public_message_id', type: 'number', sortable: false, filterable: true, nullable: true },
  { name: 'public_group_message_id', type: 'number', sortable: false, filterable: true, nullable: true },
  { name: 'updated_at', type: 'datetime', sortable: true, filterable: true, nullable: true },
  { name: 'channel_updated_at', type: 'datetime', sortable: true, filterable: true, nullable: true },
];
