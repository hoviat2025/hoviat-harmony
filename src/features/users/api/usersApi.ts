import axiosInstance from '@/lib/axios';
import type { UsersResponse, SingleUserResponse, UserUpdateRequest, FilterRule } from '../types';

interface GetUsersParams {
  page?: number;
  size?: number;
  order_by?: string;
  search?: string;
  rules?: FilterRule[];
}

/**
 * buildQueryParams:
 * Maps the frontend FilterRule[] to the flat query parameters expected by FastAPI (pydantic-filter).
 */
export const buildQueryParams = (params: GetUsersParams): Record<string, string> => {
  const queryParams: Record<string, string> = {};

  // Standard Pagination & Sorting
  queryParams.page = String(params.page || 1);
  queryParams.size = String(params.size || 20);
  if (params.order_by) queryParams.order_by = params.order_by;
  if (params.search) queryParams.search = params.search;

  if (params.rules) {
    params.rules.forEach((rule) => {
      const { field, operator, value, valueTo } = rule;

      // 1. Null Checks (is_empty / is_full)
      if (operator === 'is_empty' || operator === 'is_full') {
        const nullAlias = getNullAlias(field);
        queryParams[nullAlias] = operator === 'is_empty' ? 'true' : 'false';
        return;
      }

      // 2. Text Partial Match (contains)
      if (operator === 'contains' && isValidValue(value)) {
        queryParams[`${field}_contains`] = String(value);
        return;
      }

      // 3. Range Operations (gt, lt, between)
      const rangeAliases = getRangeAliases(field);
      
      if (operator === 'gt' && isValidValue(value)) {
        queryParams[rangeAliases.gte] = String(value);
      } 
      else if (operator === 'lt' && isValidValue(value)) {
        queryParams[rangeAliases.lte] = String(value);
      } 
      else if (operator === 'between') {
        // Maps 'value' to Start (GTE) and 'valueTo' to End (LTE)
        if (isValidValue(value)) queryParams[rangeAliases.gte] = String(value);
        if (isValidValue(valueTo)) queryParams[rangeAliases.lte] = String(valueTo);
      } 
      else if (operator === 'equals' && isValidValue(value)) {
        // 4. Exact Match
        queryParams[field] = String(value);
      }
    });
  }

  return queryParams;
};

// Helper: Allow 0 as valid, but reject empty string/null/undefined
const isValidValue = (val: any) => val !== undefined && val !== '' && val !== null;

/**
 * Internal mapping for Null Check Aliases
 * Must match the FastAPI 'alias' definitions.
 */
const getNullAlias = (field: string): string => {
  const customNulls: Record<string, string> = {
    user_id: "no_user_id",
    accounting_code: "no_accounting_code",
    username: "no_username",
    first_name: "no_first_name",
    last_name: "no_last_name",
    nickname: "no_nickname",
    phone_number: "no_phone_number",
    whatsapp_number: "no_whatsapp_number",
    country: "no_country",
    password: "no_password",
    mode: "no_mode",
    join_date: "no_join_date",
    profile_path: "no_profile_path",
    telegram_message_id: "no_telegram_msg_id",
    group_message_id: "no_group_msg_id",
    public_message_id: "no_public_msg_id",
    public_group_message_id: "no_public_group_msg_id",
    channel_updated_at: "no_channel_update",
  };
  return customNulls[field] || `${field}__isnull`;
};

/**
 * Internal mapping for Range Aliases (GTE/LTE)
 * Must match the FastAPI 'alias' definitions.
 */
const getRangeAliases = (field: string): { gte: string; lte: string } => {
  const rangeMap: Record<string, { gte: string; lte: string }> = {
    score: { gte: "min_score", lte: "max_score" },
    ban_time: { gte: "min_ban_time", lte: "max_ban_time" },
    join_date: { gte: "joined_after_unix", lte: "joined_before_unix" },
    updated_at: { gte: "updated_after", lte: "updated_before" },
    channel_updated_at: { gte: "channel_updated_after", lte: "channel_updated_before" },
  };
  return rangeMap[field] || { gte: `${field}__gte`, lte: `${field}__lte` };
};

export const getUsers = async (params: GetUsersParams = {}): Promise<UsersResponse> => {
  const queryParams = buildQueryParams(params);
  const response = await axiosInstance.get<UsersResponse>('/users-management/', {
    params: queryParams,
  });
  return response.data;
};

export const getUser = async (userId: number): Promise<SingleUserResponse> => {
  const response = await axiosInstance.get<SingleUserResponse>(`/users-management/${userId}`);
  return response.data;
};

export const updateUser = async (data: UserUpdateRequest): Promise<SingleUserResponse> => {
  const response = await axiosInstance.patch<SingleUserResponse>('/users-management/update', data);
  return response.data;
};