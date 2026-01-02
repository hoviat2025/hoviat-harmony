import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUsers, useUsersUrlState } from '@/features/users/hooks/useUsers';
import { UserCard } from '@/features/users/components/UserCard';
import { UserRow } from '@/features/users/components/UserRow';
import { FloatingSearchButton } from '@/features/users/components/FloatingSearchButton';
import { DynamicFilterModal } from '@/features/users/components/DynamicFilterModal';
import { Pagination } from '@/features/users/components/Pagination';

type ViewMode = 'card' | 'row';

const UsersPage = () => {
  const navigate = useNavigate();
  const [searchParamsUrl, setSearchParamsUrl] = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { data, isLoading, isError, error } = useUsers();
  const { page, orderBy, rules, updateFilters, searchParams } = useUsersUrlState();

  // Sync viewMode from URL
  useEffect(() => {
    const view = searchParamsUrl.get('view') as ViewMode | null;
    if (view && (view === 'card' || view === 'row')) {
      setViewMode(view);
    }
  }, [searchParamsUrl]);

  const handleUserClick = (userId: number) => {
    navigate(`/users/${userId}?from=${encodeURIComponent(searchParams)}`);
  };

  const handleApplyFilters = (newRules: typeof rules, newOrderBy: string) => {
    updateFilters({ rules: newRules, order_by: newOrderBy });
    const newSearchParams = new URLSearchParams(searchParams);
    if (viewMode) newSearchParams.set('view', viewMode);
    setSearchParamsUrl(newSearchParams);
  };

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
  };

  const toggleViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('view', mode);
    setSearchParamsUrl(newSearchParams);
  };

  const hasActiveFilters = rules.length > 0;

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-foreground">مدیریت کاربران</h1>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2 glass-static rounded-lg p-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleViewMode('card')}
            className={`transition-colors duration-200 ${
              viewMode === 'card' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <LayoutGrid className="w-4 h-4 ml-2" />
            کارت
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleViewMode('row')}
            className={`transition-colors duration-200 ${
              viewMode === 'row' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <List className="w-4 h-4 ml-2" />
            لیست
          </Button>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-4 p-3 rounded-lg bg-accent/50 text-sm text-accent-foreground flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>{rules.length} فیلتر فعال</span>
          <Button variant="link" onClick={() => updateFilters({ rules: [] })} className="text-accent-foreground underline px-0 mr-2">
            پاک کردن همه
          </Button>
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-20 glass-static rounded-2xl p-8">
          <p className="text-destructive text-lg mb-4">خطا در دریافت اطلاعات</p>
          <Button onClick={() => window.location.reload()}>تلاش مجدد</Button>
        </div>
      )}

      {/* Data */}
      {data && data.data.length > 0 && (
        <>
          {viewMode === 'card' ? (
            /* 
               Grid Layout: 
               - xl:grid-cols-5: Added 5 columns for large screens
               - Wrapper div: max-w-[300px] + mx-auto ensures cards stay vertical and centered
            */
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {data.data.map((user) => (
                <div key={user.user_id} className="w-full max-w-[300px] mx-auto h-full">
                  <UserCard
                    user={user}
                    onClick={() => handleUserClick(user.user_id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* List Layout */
            <div className="space-y-3">
              {data.data.map((user) => (
                <UserRow
                  key={user.user_id}
                  user={user}
                  onClick={() => handleUserClick(user.user_id)}
                />
              ))}
            </div>
          )}

          <Pagination
            currentPage={page}
            totalPages={data.meta.pages}
            totalItems={data.meta.total}
            pageSize={data.meta.size}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Empty State */}
      {data && data.data.length === 0 && (
        <div className="text-center py-20 glass-static rounded-2xl p-8">
          <p className="text-silver text-lg">کاربری یافت نشد</p>
        </div>
      )}

      <FloatingSearchButton onClick={() => setIsFilterOpen(true)} />

      <DynamicFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        currentRules={rules}
        currentOrderBy={orderBy}
        onApply={handleApplyFilters}
      />
    </div>
  );
};

export default UsersPage;