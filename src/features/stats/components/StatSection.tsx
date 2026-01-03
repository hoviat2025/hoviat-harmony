import type { StatConfig } from '../types';
import { StatCard } from './StatCard';

export const StatSection = ({ title, stats }: { title: string; stats: StatConfig[] }) => {
  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-foreground mb-6 pr-4 border-r-4 border-primary animate-fade-in">
        {title}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.id} config={stat} />
        ))}
      </div>
    </div>
  );
};