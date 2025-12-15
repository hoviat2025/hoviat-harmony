import { User, PROFILE_IMAGE_BASE_URL, FIELD_TRANSLATIONS } from '@/features/users/types';
import { AlertTriangle } from 'lucide-react';

interface UserRowProps {
  user: User;
  onClick: () => void;
}

// Fields to display in row view (excluding technical ones)
const ROW_FIELDS = [
  'first_name',
  'last_name',
  'user_id',
  'username',
  'phone_number',
  'country',
  'score',
  'is_ban',
  'is_registered',
] as const;

export const UserRow = ({ user, onClick }: UserRowProps) => {
  const profileUrl = user.profile_path 
    ? `${PROFILE_IMAGE_BASE_URL}${user.profile_path}`
    : null;

  const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'بدون نام';

  const formatValue = (field: string, value: unknown): string => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'بله' : 'خیر';
    return String(value);
  };

  return (
    <div
      onClick={onClick}
      className="glass-static rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-glass-hover group animate-fade-in mb-3"
    >
      <div className="flex items-center gap-4 flex-wrap">
        {/* Profile Image */}
        <div className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 border-border/30 group-hover:border-primary/30 transition-colors">
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

        {/* Fields */}
        {ROW_FIELDS.map((field) => {
          const value = user[field as keyof User];
          const label = FIELD_TRANSLATIONS[field] || field;
          
          // Special handling for is_ban
          if (field === 'is_ban' && value === true) {
            return (
              <div key={field} className="flex-shrink-0">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
                  <AlertTriangle className="w-3 h-3" />
                  بن شده
                </div>
              </div>
            );
          }

          // Skip false boolean values
          if (typeof value === 'boolean' && !value) return null;

          return (
            <div key={field} className="flex-shrink-0 min-w-0">
              <div className="text-xs text-silver mb-0.5 truncate">{label}</div>
              <div className="text-sm font-medium text-value truncate max-w-32">
                {formatValue(field, value)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
