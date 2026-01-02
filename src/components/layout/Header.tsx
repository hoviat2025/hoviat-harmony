import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, ChevronRight, LayoutDashboard } from 'lucide-react';
import { useLogout, useCurrentUser } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Header = () => {
  const logout = useLogout();
  const user = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if we are on the dashboard (root)
  const isDashboard = location.pathname === '/';

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="sticky top-4 z-50 px-4 flex justify-center w-full">
      <header 
        className={cn(
          "glass-static w-full max-w-6xl h-16 rounded-full px-2 sm:px-6",
          "flex items-center justify-between shadow-lg transition-all duration-300"
        )}
      >
        {/* Right Side (RTL Start) - Always Back Button */}
        <div className="flex items-center min-w-[100px]">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 text-foreground hover:bg-accent/50 rounded-full px-4"
          >
            <ChevronRight className="w-5 h-5" />
            <span className="hidden sm:inline">بازگشت</span>
          </Button>
        </div>

        {/* Center - Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-base sm:text-lg font-bold text-foreground whitespace-nowrap">
            پنل مدیریت هویت
          </h1>
        </div>

        {/* Left Side (RTL End) - User Info & Action Button */}
        <div className="flex items-center justify-end gap-2 sm:gap-4 min-w-[100px]">
          {user && (
            <span className="text-sm text-silver hidden md:flex items-center gap-2">
              {user.username}
              {user.is_superadmin && (
                <span className="px-2 py-0.5 rounded-full text-[10px] gold-shine text-primary-foreground font-bold shadow-sm">
                  مدیر
                </span>
              )}
            </span>
          )}

          {isDashboard ? (
            <Button
              variant="ghost"
              onClick={logout}
              className="flex items-center gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-full px-4"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">خروج</span>
            </Button>
          ) : (
            <Link to="/">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-foreground hover:bg-accent/50 rounded-full px-4"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span className="hidden sm:inline">داشبورد</span>
              </Button>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
};