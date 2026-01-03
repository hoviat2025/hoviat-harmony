import { useState, useEffect } from 'react';
import { 
  Loader2, 
  Clock, 
  CalendarDays, 
  Globe2, 
  HelpCircle, 
  Users, 
  Flag,
  LucideIcon,
  RotateCcw
} from 'lucide-react';
import { getUsers } from '@/features/users/api/usersApi';
import type { FilterRule } from '@/features/users/types';
import { subDays, getUnixTime } from 'date-fns';

// --- Types & Interfaces ---

interface StatConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  // The function that performs the specific calculation for this stat
  calculateFn: () => Promise<number>;
}

// --- API Helpers ---

/**
 * Fetches the total count of users matching specific filter rules.
 * Uses size=1 to minimize data transfer as we only need meta.total.
 */
const fetchCount = async (rules: FilterRule[] = []): Promise<number> => {
  try {
    const response = await getUsers({
      page: 1,
      size: 1,
      rules: rules
    });
    return response.meta.total;
  } catch (error) {
    console.error('Failed to fetch stat count:', error);
    throw error;
  }
};

// --- Calculation Strategies ---

// 1. Time-based Calculations
const createTimeCalculator = (days: number) => {
  return async () => {
    // Calculate the timestamp for X days ago
    const pastDate = subDays(new Date(), days);
    const unixTimestamp = getUnixTime(pastDate);

    // Create rule: join_date > unixTimestamp
    // Note: In usersApi, 'join_date' + 'gt' maps to 'joined_after_unix'
    const rules: FilterRule[] = [{
      field: 'join_date',
      operator: 'gt',
      value: unixTimestamp
    }];

    return await fetchCount(rules);
  };
};

// 2. Country-based Calculations
const createCountryCalculator = (countryName: string | null) => {
  return async () => {
    let rules: FilterRule[] = [];

    if (countryName === null) {
      // Unknown country (null check)
      rules = [{ field: 'country', operator: 'is_empty' }];
    } else {
      // Specific country match
      rules = [{ field: 'country', operator: 'equals', value: countryName }];
    }

    return await fetchCount(rules);
  };
};

// 3. Complex Calculation: Foreigners
// Formula: Total Users - Iran Users - Unknown Users
const calculateForeigners = async () => {
  const [total, iran, unknown] = await Promise.all([
    fetchCount([]), // Total
    fetchCount([{ field: 'country', operator: 'equals', value: 'ایران' }]), // Iran
    fetchCount([{ field: 'country', operator: 'is_empty' }]) // Unknown
  ]);

  return total - iran - unknown;
};


// --- UI Components ---

const StatCard = ({ config }: { config: StatConfig }) => {
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await config.calculateFn();
      setValue(result);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full glass-static rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-glass-hover h-full group animate-fade-in">
      <div className="w-full flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          <config.icon className="w-6 h-6" />
        </div>
        {value !== null && (
          <button 
            onClick={() => setValue(null)} 
            className="text-silver hover:text-primary transition-colors p-1"
            title="ریست"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      <h3 className="text-lg font-bold text-foreground mb-2">{config.title}</h3>
      <p className="text-sm text-silver mb-6 flex-grow">{config.description}</p>

      <div className="w-full mt-auto">
        {value !== null ? (
          <div className="animate-fade-in py-2">
            <span className="text-3xl font-bold text-value block">{value.toLocaleString('fa-IR')}</span>
            <span className="text-xs text-silver mt-1 block">کاربر</span>
          </div>
        ) : (
          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full py-2 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>محاسبه...</span>
              </>
            ) : (
              'محاسبه'
            )}
          </button>
        )}
        
        {error && (
          <p className="text-xs text-destructive mt-2 animate-fade-in">خطا در محاسبه</p>
        )}
      </div>
    </div>
  );
};

const StatSection = ({ title, stats }: { title: string; stats: StatConfig[] }) => {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-foreground mb-6 pr-4 border-r-4 border-primary animate-fade-in">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} config={stat} />
        ))}
      </div>
    </div>
  );
};

// --- Main Page Component ---

const StatsPage = () => {
  const [totalUsers, setTotalUsers] = useState<number | null>(null);

  // Auto-fetch total users on mount
  useEffect(() => {
    fetchCount([]).then(setTotalUsers).catch(() => setTotalUsers(0));
  }, []);

  // Configuration for Time Category
  const timeStats: StatConfig[] = [
    {
      id: 'time-24h',
      title: '۲۴ ساعت گذشته',
      description: 'تعداد کاربرانی که در ۲۴ ساعت اخیر عضو شده‌اند',
      icon: Clock,
      calculateFn: createTimeCalculator(1)
    },
    {
      id: 'time-week',
      title: 'یک هفته گذشته',
      description: 'تعداد کاربرانی که در ۷ روز اخیر عضو شده‌اند',
      icon: CalendarDays,
      calculateFn: createTimeCalculator(7)
    },
    {
      id: 'time-month',
      title: 'یک ماه گذشته',
      description: 'تعداد کاربرانی که در ۳۰ روز اخیر عضو شده‌اند',
      icon: CalendarDays,
      calculateFn: createTimeCalculator(30)
    },
    {
      id: 'time-year',
      title: 'یک سال گذشته',
      description: 'تعداد کاربرانی که در ۳۶۵ روز اخیر عضو شده‌اند',
      icon: CalendarDays,
      calculateFn: createTimeCalculator(365)
    },
  ];

  // Configuration for Country Category
  const countryStats: StatConfig[] = [
    {
      id: 'country-iran',
      title: 'ایران',
      description: 'کاربرانی که کشور آن‌ها ایران ثبت شده است',
      icon: Flag,
      calculateFn: createCountryCalculator('ایران')
    },
    {
      id: 'country-germany',
      title: 'آلمان',
      description: 'کاربرانی که کشور آن‌ها آلمان ثبت شده است',
      icon: Flag,
      calculateFn: createCountryCalculator('آلمان')
    },
    {
      id: 'country-unknown',
      title: 'نامشخص',
      description: 'کاربرانی که کشور آن‌ها در سیستم ثبت نشده است (null)',
      icon: HelpCircle,
      calculateFn: createCountryCalculator(null)
    },
    {
      id: 'country-foreign',
      title: 'خارجی‌ها',
      description: 'همه کاربران به جز کاربران ایرانی و کاربران با کشور نامشخص',
      icon: Globe2,
      calculateFn: calculateForeigners
    },
  ];

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      {/* Header / Total Users */}
      <div className="relative glass-static rounded-2xl p-8 mb-10 animate-fade-in flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-value mb-2">آمار و ارقام</h1>
          <p className="text-silver">نمای کلی وضعیت کاربران و رشد سیستم</p>
        </div>
        
        <div className="text-center bg-muted/30 px-8 py-4 rounded-xl border border-primary/10">
          <p className="text-sm text-silver mb-1">تعداد کل کاربران</p>
          <div className="flex items-center gap-2 justify-center">
            <Users className="w-6 h-6 text-primary" />
            <span className="text-3xl font-bold text-foreground">
              {totalUsers !== null ? totalUsers.toLocaleString('fa-IR') : '...'}
            </span>
          </div>
        </div>
      </div>

      {/* Sections */}
      <StatSection title="رشد در گذر زمان" stats={timeStats} />
      <StatSection title="پراکندگی جغرافیایی" stats={countryStats} />
      
    </div>
  );
};

export default StatsPage;