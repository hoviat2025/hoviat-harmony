import { User, PROFILE_IMAGE_BASE_URL, FIELD_TRANSLATIONS } from '@/features/users/types';
import { AlertTriangle, Calendar, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserRowProps {
  user: User;
  onClick: () => void;
}

const ROW_FIELDS_CONFIG = [
  { field: 'first_name', label: 'نام' },
  { field: 'last_name', label: 'نام خانوادگی' },
  { field: 'user_id', label: 'آیدی تلگرام' },
  { field: 'country', label: 'کشور' },
  { field: 'username', label: 'یوزرنیم' },
  { field: 'score', label: 'امتیاز' },
  { field: 'join_date', label: 'تاریخ عضویت' },
] as const;

export const UserRow = ({ user, onClick }: UserRowProps) => {
  const profileUrl = user.profile_path 
    ? `${PROFILE_IMAGE_BASE_URL}${user.profile_path}`
    : null;

  const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'بدون نام';

  const formatValue = (field: string, value: any): React.ReactNode => {
    if (value === null || value === undefined || value === '') return <span className="text-muted-foreground">-</span>;
    
    // Date formatting (Unix timestamp to Date)
    if (field === 'join_date') {
      const date = new Date(Number(value) * 1000); // Convert seconds to milliseconds
      return (
        <div className="flex items-center justify-center gap-1 ltr:flex-row-reverse">
          <Calendar className="w-3.5 h-3.5 text-primary" />
          <span dir="ltr" className="text-xs">
            {date.toLocaleDateString('fa-IR')}
          </span>
        </div>
      );
    }

    if (field === 'score') {
      return (
        <div className="flex items-center justify-center gap-1 text-amber-500">
          <Star className="w-3.5 h-3.5 fill-current" />
          <span>{value}</span>
        </div>
      );
    }

    return String(value);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "glass-static rounded-xl p-3 cursor-pointer transition-all duration-200 hover:shadow-glass-hover group",
        user.is_ban ? "opacity-75" : ""
      )}
    >
      <div className="flex items-center gap-6 flex-nowrap overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
        
        {/* Profile Image */}
        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 border-border/30 group-hover:border-primary/30 transition-colors">
          {profileUrl ? (
            <img
              src={profileUrl}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=100`;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-lg font-bold text-primary">
              {displayName.charAt(0)}
            </div>
          )}
        </div>

        {/* Ban Badge */}
        {user.is_ban && (
          <div className="flex-shrink-0">
            <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium whitespace-nowrap">
              <AlertTriangle className="w-3 h-3" />
              بن شده
            </div>
          </div>
        )}

        {/* Fields */}
        {ROW_FIELDS_CONFIG.map(({ field, label }) => {
          const value = user[field as keyof User];

          return (
            /* 
               Added 'items-center' and 'text-center' here.
               This forces the flex column content to be centered horizontally within the 100px box.
            */
            <div key={field} className="flex-shrink-0 min-w-[100px] flex flex-col justify-center items-center text-center">
              <div className="text-[10px] text-silver mb-0.5 whitespace-nowrap">{label}</div>
              <div className="text-sm font-medium text-value whitespace-nowrap w-full">
                {formatValue(field, value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};