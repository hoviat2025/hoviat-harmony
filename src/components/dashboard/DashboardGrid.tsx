import { Link } from 'react-router-dom';
import { Users, GitBranch, BarChart3, Sparkles, Lock } from 'lucide-react';

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  enabled: boolean;
}

const dashboardCards: DashboardCard[] = [
  {
    id: 'users',
    title: 'مدیریت کاربران',
    description: 'مشاهده، جستجو و ویرایش اطلاعات کاربران',
    icon: <Users className="w-10 h-10" />,
    path: '/users',
    enabled: true,
  },
  {
    id: 'workflows',
    title: 'گردش کار',
    description: 'مدیریت فرآیندها و گردش کار سیستم',
    icon: <GitBranch className="w-10 h-10" />,
    path: '/workflows',
    enabled: false,
  },
  {
    id: 'stats',
    title: 'آمار و گزارشات',
    description: 'مشاهده آمار و تحلیل داده‌ها',
    icon: <BarChart3 className="w-10 h-10" />,
    path: '/stats',
    enabled: false,
  },
  {
    id: 'ai',
    title: 'هوش مصنوعی',
    description: 'قابلیت‌های پیشرفته هوش مصنوعی',
    icon: <Sparkles className="w-10 h-10" />,
    path: '/ai',
    enabled: false,
  },
];

export const DashboardGrid = () => {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
        داشبورد مدیریت
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {dashboardCards.map((card, index) => (
          <DashboardCardItem key={card.id} card={card} index={index} />
        ))}
      </div>
    </div>
  );
};

const DashboardCardItem = ({ card, index }: { card: DashboardCard; index: number }) => {
  const content = (
    <div
      className={`
        relative rounded-2xl p-6 h-48 flex flex-col items-center justify-center text-center
        transition-all duration-300 animate-fade-in
        ${card.enabled 
          ? 'glass-static hover:shadow-glass-hover cursor-pointer group' 
          : 'glass-static glass-disabled cursor-not-allowed'
        }
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Icon */}
      <div className={`
        mb-4 p-3 rounded-xl transition-colors duration-300
        ${card.enabled 
          ? 'text-primary group-hover:text-primary-foreground group-hover:gold-shine' 
          : 'text-muted-foreground'
        }
      `}>
        {card.icon}
      </div>
      
      {/* Title */}
      <h3 className={`
        text-lg font-bold mb-2
        ${card.enabled ? 'text-foreground' : 'text-muted-foreground'}
      `}>
        {card.title}
      </h3>
      
      {/* Description */}
      <p className={`
        text-sm
        ${card.enabled ? 'text-silver' : 'text-muted-foreground/60'}
      `}>
        {card.description}
      </p>

      {/* Coming Soon Badge */}
      {!card.enabled && (
        <div className="absolute top-4 left-4 z-20 flex items-center gap-1 px-2 py-1 rounded-full bg-muted text-muted-foreground text-xs">
          <Lock className="w-3 h-3" />
          به زودی
        </div>
      )}
    </div>
  );

  if (card.enabled) {
    return (
      <Link to={card.path}>
        {content}
      </Link>
    );
  }

  return content;
};
