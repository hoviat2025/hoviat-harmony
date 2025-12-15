import { Search } from 'lucide-react';

interface FloatingSearchButtonProps {
  onClick: () => void;
}

export const FloatingSearchButton = ({ onClick }: FloatingSearchButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full gold-shine flex items-center justify-center shadow-gold hover:shadow-gold-hover transition-all duration-300 animate-float"
      aria-label="جستجو و فیلتر"
    >
      <Search className="w-6 h-6 text-primary-foreground" />
    </button>
  );
};
