import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, LogOut, ChevronRight } from 'lucide-react';
import { useLogout, useCurrentUser } from '@/features/auth/hooks/useAuth';
import { Button } from '@/components/ui/button';

export const Header = () => {
  const logout = useLogout();
  const user = useCurrentUser();
  const location = useLocation();
  const navigate = useNavigate();
  
  const isOnDetailsPage = location.pathname.includes('/users/');
  const isOnUsersPage = location.pathname === '/users';

  const handleBack = () => {
    // Navigate back preserving the search params (filters)
    navigate(-1);
  };

  return (
    <header className="glass-static sticky top-0 z-50 border-b border-border/30">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Right Side (visually left in RTL) - Home/Back */}
        <div className="flex items-center gap-3">
          {isOnDetailsPage || isOnUsersPage ? (
            <Button
              variant="ghost"
              onClick={handleBack}
              className="flex items-center gap-2 text-foreground hover:bg-accent"
            >
              <ChevronRight className="w-5 h-5" />
              <span>بازگشت</span>
            </Button>
          ) : (
            <Link to="/">
              <Button variant="ghost" className="flex items-center gap-2 text-foreground hover:bg-accent">
                <Home className="w-5 h-5" />
                <span>صفحه اصلی</span>
              </Button>
            </Link>
          )}
        </div>

        {/* Center - Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <h1 className="text-lg font-bold text-foreground">پنل مدیریت هویت</h1>
        </div>

        {/* Left Side (visually right in RTL) - User & Logout */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-silver hidden sm:inline">
              {user.username}
              {user.is_superadmin && (
                <span className="mr-1 px-2 py-0.5 rounded-full text-xs gold-shine text-primary-foreground">
                  مدیر
                </span>
              )}
            </span>
          )}
          <Button
            variant="ghost"
            onClick={logout}
            className="flex items-center gap-2 text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden sm:inline">خروج</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
