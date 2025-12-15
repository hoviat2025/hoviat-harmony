import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-background font-vazir">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};
