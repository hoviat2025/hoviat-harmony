import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutGrid, List, Loader2 } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const { data, isLoading, isError } = useUsers();
  const { page, orderBy, rules, updateFilters, searchParams } = useUsersUrlState();

  const handleUserClick = (userId: number) => {
    // Navigate to user details, preserving current filters in the URL
    navigate(`/users/${userId}?from=${encodeURIComponent(searchParams)}`);
  };

  const handleApplyFilters = (newRules: typeof rules, newOrderBy: string) => {
    updateFilters({ rules: newRules, order_by: newOrderBy });
  };

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">مدیریت کاربران</h1>
        
        {/* View Toggle */}
        <div className="flex items-center gap-2 glass-static rounded-lg p-1">
          <Button
            variant={viewMode === 'card' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('card')}
            className={viewMode === 'card' ? 'gold-shine text-primary-foreground' : ''}
          >
            <LayoutGrid className="w-4 h-4 ml-2" />
            کارت
          </Button>
          <Button
            variant={viewMode === 'row' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('row')}
            className={viewMode === 'row' ? 'gold-shine text-primary-foreground' : ''}
          >
            <List className="w-4 h-4 ml-2" />
            لیست
          </Button>
        </div>
      </div>

      {/* Active Filters Indicator */}
      {rules.length > 0 && (
        <div className="mb-4 p-3 rounded-lg bg-accent/50 text-sm text-accent-foreground">
          {rules.length} فیلتر فعال
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="text-center py-20">
          <p className="text-destructive mb-4">خطا در دریافت اطلاعات کاربران</p>
          <Button onClick={() => window.location.reload()}>تلاش مجدد</Button>
        </div>
      )}

      {/* Users List */}
      {data && (
        <>
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.data.map((user, index) => (
                <div
                  key={user.user_id}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <UserCard
                    user={user}
                    onClick={() => handleUserClick(user.user_id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {data.data.map((user, index) => (
                <div
                  key={user.user_id}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <UserRow
                    user={user}
                    onClick={() => handleUserClick(user.user_id)}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {data.data.length === 0 && (
            <div className="text-center py-20 glass-static rounded-2xl">
              <p className="text-silver text-lg">کاربری یافت نشد</p>
              {rules.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={() => updateFilters({ rules: [] })}
                  className="mt-4"
                >
                  پاک کردن فیلترها
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={data.meta.pages}
            totalItems={data.meta.total}
            pageSize={data.meta.size}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Floating Search Button */}
      <FloatingSearchButton onClick={() => setIsFilterOpen(true)} />

      {/* Filter Modal */}
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
