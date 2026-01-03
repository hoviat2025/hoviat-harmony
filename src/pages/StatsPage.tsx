import { useState, useEffect } from 'react';
import { Clock, CalendarDays, Globe2, HelpCircle, Users, Flag } from 'lucide-react';

import { fetchCount, createTimeCalculator, createCountryCalculator, calculateForeigners } from '@/features/stats/logic/statsCalculations';
import type { StatConfig } from '@/features/stats/types';
import { StatSection } from '@/features/stats/components/StatSection';

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