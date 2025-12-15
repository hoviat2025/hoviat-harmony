import axiosInstance from '@/lib/axios';
import type { UsersResponse, SingleUserResponse, UserUpdateRequest, FilterRule } from '../types';

interface GetUsersParams {
  page?: number;
  size?: number;
  order_by?: string;
  search?: string;
  rules?: FilterRule[];
}

export const buildQueryParams = (params: GetUsersParams): Record<string, string> => {
  const queryParams: Record<string, string> = {};

  // Pagination
  queryParams.page = String(params.page || 1);
  queryParams.size = String(params.size || 20);

  // Sorting
  if (params.order_by) {
    queryParams.order_by = params.order_by;
  }

  // Global search
  if (params.search) {
    queryParams.search = params.search;
  }

  // Filter rules
  if (params.rules) {
    params.rules.forEach((rule) => {
      const { field, operator, value } = rule;

      switch (operator) {
        case 'equals':
          if (value !== undefined && value !== '') {
            queryParams[field] = String(value);
          }
          break;
        case 'contains':
          if (value !== undefined && value !== '') {
            queryParams[`${field}_contains`] = String(value);
          }
          break;
        case 'gt':
          if (value !== undefined && value !== '') {
            // For date fields
            if (field === 'join_date') {
              queryParams.joined_after_unix = String(value);
            } else if (field === 'updated_at') {
              queryParams.updated_after = String(value);
            } else if (field === 'channel_updated_at') {
              queryParams.channel_updated_after = String(value);
            } else {
              queryParams[`min_${field}`] = String(value);
            }
          }
          break;
        case 'lt':
          if (value !== undefined && value !== '') {
            // For date fields
            if (field === 'join_date') {
              queryParams.joined_before_unix = String(value);
            } else if (field === 'updated_at') {
              queryParams.updated_before = String(value);
            } else if (field === 'channel_updated_at') {
              queryParams.channel_updated_before = String(value);
            } else {
              queryParams[`max_${field}`] = String(value);
            }
          }
          break;
        case 'is_empty':
          queryParams[`no_${field}`] = 'true';
          break;
        case 'is_full':
          queryParams[`no_${field}`] = 'false';
          break;
      }
    });
  }

  return queryParams;
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
