import { useState } from 'react';
import { Loader2, RotateCcw } from 'lucide-react';
import type { StatConfig } from '../types';

export const StatCard = ({ config }: { config: StatConfig }) => {
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await config.calculateFn();
      setValue(result);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full glass-static rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-glass-hover h-full group animate-fade-in">
      <div className="w-full flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          <config.icon className="w-6 h-6" />
        </div>
        {value !== null && (
          <button 
            onClick={() => setValue(null)} 
            className="text-silver hover:text-primary transition-colors p-1"
            title="ریست"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      <h3 className="text-lg font-bold text-foreground mb-2">{config.title}</h3>
      <p className="text-sm text-silver mb-6 flex-grow">{config.description}</p>

      <div className="w-full mt-auto">
        {value !== null ? (
          <div className="animate-fade-in py-2">
            <span className="text-3xl font-bold text-value block">{value.toLocaleString('fa-IR')}</span>
            <span className="text-xs text-silver mt-1 block">کاربر</span>
          </div>
        ) : (
          <button
            onClick={handleCalculate}
            disabled={loading}
            className="w-full py-2 px-4 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>محاسبه...</span>
              </>
            ) : (
              'محاسبه'
            )}
          </button>
        )}
        
        {error && (
          <p className="text-xs text-destructive mt-2 animate-fade-in">خطا در محاسبه</p>
        )}
      </div>
    </div>
  );
};