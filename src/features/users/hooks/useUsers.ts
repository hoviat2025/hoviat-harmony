import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getUsers, getUser, updateUser } from '../api/usersApi';
import type { FilterRule, UserUpdateRequest } from '../types';
import { toast } from '@/hooks/use-toast';

// Parse filter rules from URL
const parseRulesFromUrl = (searchParams: URLSearchParams): FilterRule[] => {
  const rulesParam = searchParams.get('rules');
  if (!rulesParam) return [];
  
  try {
    return JSON.parse(decodeURIComponent(rulesParam));
  } catch {
    return [];
  }
};

// Serialize filter rules to URL
export const serializeRulesToUrl = (rules: FilterRule[]): string => {
  if (rules.length === 0) return '';
  return encodeURIComponent(JSON.stringify(rules));
};

export const useUsers = () => {
  const [searchParams] = useSearchParams();

  const page = parseInt(searchParams.get('page') || '1', 10);
  const size = parseInt(searchParams.get('size') || '20', 10);
  const orderBy = searchParams.get('order_by') || '-counter';
  const search = searchParams.get('search') || '';
  const rules = parseRulesFromUrl(searchParams);

  return useQuery({
    queryKey: ['users', { page, size, orderBy, search, rules }],
    queryFn: () => getUsers({ page, size, order_by: orderBy, search, rules }),
    staleTime: 30000,
  });
};

export const useUser = (userId: number) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUser(userId),
    enabled: !!userId,
    staleTime: 30000,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserUpdateRequest) => updateUser(data),
    onSuccess: (_, variables) => {
      toast({
        title: 'ویرایش موفق',
        description: 'اطلاعات کاربر با موفقیت به‌روزرسانی شد',
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user', variables.user_id] });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'خطا در ویرایش',
        description: 'ویرایش اطلاعات کاربر با مشکل مواجه شد',
      });
    },
  });
};

// Hook for managing URL state
export const useUsersUrlState = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateFilters = (updates: {
    page?: number;
    size?: number;
    order_by?: string;
    search?: string;
    rules?: FilterRule[];
  }) => {
    const newParams = new URLSearchParams(searchParams);

    if (updates.page !== undefined) {
      newParams.set('page', String(updates.page));
    }
    if (updates.size !== undefined) {
      newParams.set('size', String(updates.size));
    }
    if (updates.order_by !== undefined) {
      if (updates.order_by) {
        newParams.set('order_by', updates.order_by);
      } else {
        newParams.delete('order_by');
      }
    }
    if (updates.search !== undefined) {
      if (updates.search) {
        newParams.set('search', updates.search);
      } else {
        newParams.delete('search');
      }
    }
    if (updates.rules !== undefined) {
      if (updates.rules.length > 0) {
        newParams.set('rules', serializeRulesToUrl(updates.rules));
      } else {
        newParams.delete('rules');
      }
    }

    // Reset to page 1 when filters change (except for page changes)
    if (updates.page === undefined && (updates.search !== undefined || updates.rules !== undefined || updates.order_by !== undefined)) {
      newParams.set('page', '1');
    }

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return {
    page: parseInt(searchParams.get('page') || '1', 10),
    size: parseInt(searchParams.get('size') || '20', 10),
    orderBy: searchParams.get('order_by') || '-counter',
    search: searchParams.get('search') || '',
    rules: parseRulesFromUrl(searchParams),
    updateFilters,
    clearFilters,
    searchParams: searchParams.toString(),
  };
};
