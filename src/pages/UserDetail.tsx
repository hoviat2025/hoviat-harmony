import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useUser } from '@/features/users/hooks/useUsers';
import { 
  User, 
  FIELD_TRANSLATIONS, 
  PROFILE_IMAGE_BASE_URL,
  FIELD_CONFIGS 
} from '@/features/users/types';
import { FloatingEditButton } from '@/features/users/components/FloatingEditButton';
import { EditUserModal } from '@/features/users/components/EditUserModal';
import { format } from 'date-fns';

// Fields to display in detail view
const DISPLAY_FIELDS = FIELD_CONFIGS.filter(
  f => !['mode', 'profile_path', 'password'].includes(f.name)
).map(f => f.name);

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const userId = parseInt(id || '0', 10);
  const { data, isLoading, isError } = useUser(userId);

  const user = data?.data;

  const formatValue = (field: string, value: unknown): string => {
    if (value === null || value === undefined) return '-';
    
    const config = FIELD_CONFIGS.find(f => f.name === field);
    
    if (typeof value === 'boolean') {
      return value ? 'بله' : 'خیر';
    }
    
    if (config?.type === 'date' || config?.type === 'datetime') {
      // Unix timestamp
      if (typeof value === 'number' && value > 1000000000) {
        return format(new Date(value * 1000), 'yyyy/MM/dd HH:mm');
      }
      // ISO string
      if (typeof value === 'string') {
        try {
          return format(new Date(value), 'yyyy/MM/dd HH:mm');
        } catch {
          return String(value);
        }
      }
    }
    
    return String(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive mb-4">خطا در دریافت اطلاعات کاربر</p>
        <button
          onClick={() => navigate(-1)}
          className="text-primary hover:underline"
        >
          بازگشت
        </button>
      </div>
    );
  }

  const profileUrl = user.profile_path
    ? `${PROFILE_IMAGE_BASE_URL}${user.profile_path}`
    : null;

  const displayName = [user.first_name, user.last_name].filter(Boolean).join(' ') || 'بدون نام';

  return (
    <div className="max-w-4xl mx-auto pb-20">
      {/* Profile Header */}
      <div className="glass-static rounded-2xl p-8 mb-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-border/30">
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
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-4xl font-bold text-primary">
                  {displayName.charAt(0)}
                </div>
              )}
            </div>
            
            {/* Ban Badge */}
            {user.is_ban && (
              <div className="absolute -top-2 -right-2 flex items-center gap-1 px-3 py-1 rounded-full bg-destructive text-destructive-foreground text-sm font-medium shadow-lg">
                <AlertTriangle className="w-4 h-4" />
                بن شده
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="text-center sm:text-right flex-1">
            <h1 className="text-2xl font-bold text-value mb-2">{displayName}</h1>
            <p className="text-silver">
              {FIELD_TRANSLATIONS.user_id}: {user.user_id}
            </p>
            {user.username && (
              <p className="text-silver">@{user.username}</p>
            )}
            {user.country && (
              <p className="text-silver mt-1">{user.country}</p>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="glass-static rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
        <h2 className="text-lg font-bold text-foreground mb-6 border-b border-border/30 pb-3">
          اطلاعات کامل
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DISPLAY_FIELDS.map((field) => {
            const value = user[field as keyof User];
            const label = FIELD_TRANSLATIONS[field] || field;
            
            return (
              <div 
                key={field} 
                className="p-4 rounded-xl bg-muted/30 transition-colors hover:bg-muted/50"
              >
                <p className="text-xs text-silver mb-1">{label}</p>
                <p className="text-sm font-medium text-value break-all">
                  {formatValue(field, value)}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Edit Button */}
      <FloatingEditButton onClick={() => setIsEditOpen(true)} />

      {/* Edit Modal */}
      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={user}
      />
    </div>
  );
};

export default UserDetailPage;
