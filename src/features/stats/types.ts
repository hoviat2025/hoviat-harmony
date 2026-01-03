import type { LucideIcon } from 'lucide-react';

export interface StatConfig {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  calculateFn: () => Promise<number>;
}
