import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const DashboardLayout = () => {
  return (
    <div className="min-h-screen font-vazir bg-transparent">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};