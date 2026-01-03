import { Link } from 'react-router-dom';
import { Users, BarChart3, Lock, Zap, Brain, LucideIcon } from 'lucide-react';

// --- CONFIGURATION ---
const GRID_CONFIG = {
  // Limits max width on desktop so cards don't stretch indefinitely
  maxWidth: "max-w-xl", 
  // Forces the vertical portrait shape
  cardAspectRatio: "aspect-[3/4]" 
};

interface DashboardCard {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  enabled: boolean;
}

const dashboardCards: DashboardCard[] = [
  {
    id: 'users',
    title: 'مدیریت کاربران',
    description: 'مشاهده و جست و جو و فیلتر و ویرایش در بین کاربران',
    icon: Users,
    path: '/users',
    enabled: true,
  },
  {
    id: 'shortcuts',
    title: 'کار های پرتکرار',
    description: 'میان بر هایی برای کارهای پرتکرار مانند مشاهده کاربران بن شده',
    icon: Zap,
    path: '/shortcuts',
    enabled: false,
  },
  {
    id: 'stats',
    title: 'آمار و ارقام',
    description: 'مشاهده آمار و ارقام مختلف مانند تعداد کاربران و ...',
    icon: BarChart3,
    path: '/stats',
    enabled: true,
  },
  {
    id: 'ai',
    title: 'هوش مصنوعی',
    description: 'استفاده از هوش مصنوعی برای مشاهده و جست و جو در بین کاربران',
    icon: Brain,
    path: '/ai',
    enabled: false,
  },
];

export const DashboardGrid = () => {
  return (
    <div className="py-4 md:py-10">
      <h2 className="text-xl md:text-3xl font-bold text-foreground mb-6 md:mb-10 text-center">
        داشبورد مدیریت
      </h2>
      
      <div className={`grid grid-cols-2 gap-3 md:gap-8 mx-auto px-2 md:px-0 ${GRID_CONFIG.maxWidth}`}>
        {dashboardCards.map((card, index) => (
          <DashboardCardItem key={card.id} card={card} index={index} />
        ))}
      </div>
    </div>
  );
};

const DashboardCardItem = ({ card, index }: { card: DashboardCard; index: number }) => {
  const IconComponent = card.icon;

  const content = (
    <div
      className={`
        relative rounded-2xl w-full flex flex-col items-center justify-center text-center
        transition-all duration-300 animate-fade-in
        p-3 md:p-8
        ${GRID_CONFIG.cardAspectRatio}
        ${card.enabled 
          ? 'glass-static hover:shadow-glass-hover cursor-pointer group' 
          : 'glass-static glass-disabled cursor-not-allowed'
        }
      `}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* 
        Icon Container 
        Mobile size increased: w-12 h-12 (48px)
        Desktop size: w-20 h-20 (80px)
      */}
      <div className={`
        mb-3 md:mb-6 p-3 md:p-5 rounded-2xl transition-colors duration-300 flex-shrink-0
        ${card.enabled 
          ? 'text-primary group-hover:text-primary-foreground group-hover:gold-shine' 
          : 'text-muted-foreground'
        }
      `}>
        <IconComponent className="w-12 h-12 md:w-20 md:h-20" />
      </div>
      
      {/* 
        Title
        Mobile size increased: text-base
        Desktop size: text-2xl
      */}
      <h3 className={`
        text-base md:text-2xl font-bold mb-2 md:mb-4 flex-shrink-0
        ${card.enabled ? 'text-foreground' : 'text-muted-foreground'}
      `}>
        {card.title}
      </h3>
      
      {/* 
        Description Wrapper 
        max-h-[40%] ensures it doesn't push the icon up if text is long.
        overflow-y-auto handles the scrolling if needed.
        Items are naturally centered by the parent's justify-center.
      */}
      <div className="w-full max-h-[40%] overflow-y-auto px-1 custom-scrollbar">
        <p className={`
          text-sm md:text-lg leading-snug md:leading-relaxed
          ${card.enabled ? 'text-silver' : 'text-muted-foreground/60'}
        `}>
          {card.description}
        </p>
      </div>

      {/* Coming Soon Badge */}
      {!card.enabled && (
        <div className="absolute top-2 left-2 md:top-4 md:left-4 z-20 flex items-center gap-1 px-2 py-0.5 md:py-1 rounded-full bg-muted text-muted-foreground text-[10px] md:text-xs font-medium">
          <Lock className="w-3 h-3" />
          <span className="whitespace-nowrap">به زودی</span>
        </div>
      )}
    </div>
  );

  if (card.enabled) {
    return (
      <Link to={card.path} className="block w-full">
        {content}
      </Link>
    );
  }

  return <div className="block w-full">{content}</div>;
};