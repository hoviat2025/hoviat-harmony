import { User, PROFILE_IMAGE_BASE_URL, FIELD_TRANSLATIONS } from '@/features/users/types';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

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
      className={cn(
        "glass-static rounded-2xl p-4 cursor-pointer transition-all duration-200 hover:shadow-glass-hover group relative flex flex-col h-full",
        // Replaced opacity-75 with background tint/border to preserve glass effect
        user.is_ban ? "border-destructive/50 bg-destructive/5" : ""
      )}
    >
      {/* Ban Badge */}
      {user.is_ban && (
        <div className="absolute top-3 left-3 z-10">
           <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-destructive/10 text-destructive text-[10px] font-medium">
             <AlertTriangle className="w-3 h-3" />
             بن شده
           </div>
        </div>
      )}

      {/* Profile Image */}
      <div className="flex justify-center mb-3">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-border/30 group-hover:border-primary/30 transition-colors">
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
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-xl font-bold text-primary">
              {displayName.charAt(0)}
            </div>
          )}
        </div>
      </div>

      {/* User Info - Centered and stacked */}
      <div className="text-center space-y-1.5 flex-1 flex flex-col justify-center">
        {/* Name */}
        <h3 className="text-base font-bold text-value truncate px-1">
          {displayName}
        </h3>

        {/* Telegram ID */}
        <div className="text-xs text-silver truncate">
          <span className="opacity-60 ml-1">آیدی تلگرام:</span>
          <span dir="ltr" className="font-mono">{user.user_id}</span>
        </div>

        {/* Telegram Username - Added Here */}
        <div className="text-xs text-silver truncate">
          <span className="opacity-60 ml-1">یوزر تلگرام:</span>
          <span dir="ltr" className="font-medium">
            {user.username ? `@${user.username}` : '-'}
          </span>
        </div>

        {/* Country */}
        <div className="text-xs text-silver truncate">
          <span className="opacity-60 ml-1">کشور:</span>
          {user.country || 'نامشخص'}
        </div>
      </div>
    </div>
  );
};