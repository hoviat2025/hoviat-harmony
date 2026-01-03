import { subDays, getUnixTime } from 'date-fns';
import { getUsers } from '@/features/users/api/usersApi';
import type { FilterRule } from '@/features/users/types';

export const fetchCount = async (rules: FilterRule[] = []): Promise<number> => {
  try {
    const response = await getUsers({ page: 1, size: 1, rules });
    return response.meta.total;
  } catch (error) {
    console.error('Failed to fetch stat count:', error);
    throw error;
  }
};

export const createTimeCalculator = (days: number) => {
  return async () => {
    const pastDate = subDays(new Date(), days);
    const unixTimestamp = getUnixTime(pastDate);

    const rules: FilterRule[] = [{ field: 'join_date', operator: 'gt', value: unixTimestamp }];

    return await fetchCount(rules);
  };
};

export const createCountryCalculator = (countryName: string | null) => {
  return async () => {
    let rules: FilterRule[] = [];

    if (countryName === null) {
      rules = [{ field: 'country', operator: 'is_empty' }];
    } else {
      rules = [{ field: 'country', operator: 'equals', value: countryName }];
    }

    return await fetchCount(rules);
  };
};

export const calculateForeigners = async () => {
  const [total, iran, unknown] = await Promise.all([
    fetchCount([]),
    fetchCount([{ field: 'country', operator: 'equals', value: 'ایران' }]),
    fetchCount([{ field: 'country', operator: 'is_empty' }])
  ]);

  return total - iran - unknown;
};