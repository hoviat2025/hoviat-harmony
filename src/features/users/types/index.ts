// --- User Data Interfaces ---

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
  ban_time?: number; // Unix timestamp
  join_date?: number; // Unix timestamp
  profile_path?: string;
  telegram_message_id?: string;
  group_message_id?: string;
  public_message_id?: string;
  public_group_message_id?: string;
  updated_at?: string; // ISO String
  channel_updated_at?: string; // ISO String
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

export const PROFILE_IMAGE_BASE_URL = 'https://pub-4036d35baed54ee7a9504072ea49740f.r2.dev/';

// --- Filter & UI Config Interfaces ---

export type FilterOperator = 
  | 'equals' 
  | 'contains' 
  | 'gt' 
  | 'lt' 
  | 'between' 
  | 'is_empty' 
  | 'is_full';

export interface FilterRule {
  field: string;
  operator: FilterOperator;
  value?: any;
  valueTo?: any; 
}

export type FieldType = 'text' | 'id_number' | 'range_number' | 'boolean' | 'date' | 'datetime' | 'unix' | 'counter';

export interface FieldConfig {
  name: string;
  type: FieldType;
  sortable: boolean;
  filterable: boolean;
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

export const FIELD_CONFIGS: FieldConfig[] = [
  { name: 'counter', type: 'counter', sortable: true, filterable: true },
  { name: 'user_id', type: 'id_number', sortable: true, filterable: true },
  { name: 'accounting_code', type: 'id_number', sortable: true, filterable: true },
  { name: 'username', type: 'text', sortable: true, filterable: true },
  { name: 'first_name', type: 'text', sortable: true, filterable: true },
  { name: 'last_name', type: 'text', sortable: true, filterable: true },
  { name: 'nickname', type: 'text', sortable: true, filterable: true },
  { name: 'phone_number', type: 'text', sortable: true, filterable: true },
  { name: 'whatsapp_number', type: 'text', sortable: true, filterable: true },
  { name: 'country', type: 'text', sortable: true, filterable: true },
  { name: 'mode', type: 'id_number', sortable: true, filterable: true },
  { name: 'is_ban', type: 'boolean', sortable: true, filterable: true },
  { name: 'is_registered', type: 'boolean', sortable: true, filterable: true },
  { name: 'chat_not_found', type: 'boolean', sortable: true, filterable: true },
  { name: 'score', type: 'range_number', sortable: true, filterable: true },
  { name: 'ban_time', type: 'unix', sortable: true, filterable: true },
  { name: 'join_date', type: 'unix', sortable: true, filterable: true },
  { name: 'profile_path', type: 'text', sortable: false, filterable: true },
  { name: 'telegram_message_id', type: 'id_number', sortable: false, filterable: true },
  { name: 'group_message_id', type: 'id_number', sortable: false, filterable: true },
  { name: 'public_message_id', type: 'id_number', sortable: false, filterable: true },
  { name: 'public_group_message_id', type: 'id_number', sortable: false, filterable: true },
  { name: 'updated_at', type: 'datetime', sortable: true, filterable: true },
  { name: 'channel_updated_at', type: 'datetime', sortable: true, filterable: true },
];