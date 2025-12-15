import { User, PROFILE_IMAGE_BASE_URL, FIELD_TRANSLATIONS } from '@/features/users/types';
import { AlertTriangle } from 'lucide-react';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export const UserCard = ({ user, onClick }: UserCardProps) => {
  const profileUrl = user.profile_path 
    ? `${PROFILE_IMAGE_BASE_URL}${user.profile_path}`
    : null;

  const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'بدون نام';

  return (
    <div
      onClick={onClick}
      className="glass-static rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:shadow-glass-hover group animate-fade-in relative"
    >
      {/* Ban Badge */}
      {user.is_ban && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-xs font-medium">
          <AlertTriangle className="w-3 h-3" />
          {FIELD_TRANSLATIONS.is_ban}
        </div>
      )}

      {/* Profile Image */}
      <div className="flex justify-center mb-4">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-border/30 group-hover:border-primary/30 transition-colors">
          {profileUrl ? (
            <img
              src={profileUrl}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random&size=200`;
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-2xl font-bold text-primary">
              {displayName.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="text-center space-y-2">
        {/* Name */}
        <h3 className="text-lg font-bold text-value truncate">
          {displayName}
        </h3>

        {/* Telegram ID */}
        <p className="text-sm text-silver">
          <span className="text-silver-light text-xs ml-1">{FIELD_TRANSLATIONS.user_id}:</span>
          {user.user_id}
        </p>

        {/* Country */}
        {user.country && (
          <p className="text-sm text-silver">
            <span className="text-silver-light text-xs ml-1">{FIELD_TRANSLATIONS.country}:</span>
            {user.country}
          </p>
        )}
      </div>
    </div>
  );
};
