import { useState, useEffect } from 'react';
import { X, Plus, Search, SortAsc, SortDesc, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FilterRule,
  FIELD_TRANSLATIONS,
  FIELD_CONFIGS,
  FieldConfig,
  FilterOperator,
} from '@/features/users/types';

interface DynamicFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRules: FilterRule[];
  currentOrderBy: string;
  onApply: (rules: FilterRule[], orderBy: string) => void;
}

const OPERATOR_LABELS: Record<FilterOperator, string> = {
  equals: 'برابر باشد با',
  contains: 'شامل باشد',
  gt: 'بعد از / بزرگتر از',
  lt: 'قبل از / کوچکتر از',
  between: 'بـیـن',
  is_empty: 'خالی باشد',
  is_full: 'پر باشد',
};

export const DynamicFilterModal = ({
  isOpen,
  onClose,
  currentRules,
  currentOrderBy,
  onApply,
}: DynamicFilterModalProps) => {
  const [rules, setRules] = useState<FilterRule[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [sortField, setSortField] = useState('counter');

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setRules([...currentRules]);
      setSortDirection(currentOrderBy.startsWith('-') ? 'desc' : 'asc');
      setSortField(currentOrderBy.replace('-', '') || 'counter');
    }
  }, [isOpen, currentRules, currentOrderBy]);

  /**
   * Adds a new rule.
   * Initializes values immediately to ensure API stability.
   */
  const addRule = (fieldName: string) => {
    const config = FIELD_CONFIGS.find((f) => f.name === fieldName);
    if (!config) return;

    let initialOp: FilterOperator = 'equals';
    let initialValue: any = '';

    // Initialize Dates/Unix to Current Time immediately
    if (['unix', 'datetime', 'date'].includes(config.type)) {
      initialOp = 'gt';
      const now = new Date();
      // For Unix, store integer seconds. For Date/Datetime, store ISO string.
      initialValue = config.type === 'unix' 
        ? Math.floor(now.getTime() / 1000) 
        : now.toISOString();
    } 
    // Initialize Range Numbers (Score) to 0
    else if (config.type === 'range_number') {
      initialOp = 'gt';
      initialValue = 0;
    }
    // Initialize Booleans
    else if (config.type === 'boolean') {
      initialValue = true;
    }

    setRules([...rules, { field: fieldName, operator: initialOp, value: initialValue }]);
  };

  const updateRule = (index: number, updates: Partial<FilterRule>) => {
    const newRules = [...rules];
    newRules[index] = { ...newRules[index], ...updates };
    setRules(newRules);
  };

  const removeRule = (index: number) => setRules(rules.filter((_, i) => i !== index));

  const handleApply = () => {
    const finalOrderBy = sortDirection === 'desc' ? `-${sortField}` : sortField;
    onApply(rules, finalOrderBy);
    onClose();
  };

  if (!isOpen) return null;

  // Filter out fields that are already added
  const availableFields = FIELD_CONFIGS.filter(f => f.filterable && !rules.some(r => r.field === f.name));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      {/* Simple Dark Backdrop (No Blur) */}
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-lg flex flex-col glass-static rounded-2xl max-h-[90vh] overflow-hidden animate-scale-in bg-white/50">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">فیلتر و جستجو</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted"><X /></Button>
        </div>

        {/* Scrollable Rules Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-silver mr-1">افزودن فیلتر جدید</Label>
            <Select onValueChange={addRule}>
              <SelectTrigger className="w-full h-12 bg-background/50 border-border/30 rounded-xl [&>span]:w-full [&>span]:text-right flex-row-reverse text-sm">
                <SelectValue placeholder="یک فیلد انتخاب کنید..." />
              </SelectTrigger>
              <SelectContent className="[&>*]:text-right" align="end">
                {availableFields.map((f) => (
                  <SelectItem key={f.name} value={f.name} className="flex-row-reverse justify-between cursor-pointer">
                    {FIELD_TRANSLATIONS[f.name]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {rules.map((rule, idx) => (
              <FilterRuleRow
                key={rule.field}
                rule={rule}
                onUpdate={(upd) => updateRule(idx, upd)}
                onRemove={() => removeRule(idx)}
              />
            ))}
            {rules.length === 0 && (
              <div className="text-center py-8 text-muted-foreground/50 flex flex-col items-center">
                <Plus className="w-10 h-10 mb-2 opacity-50" />
                <span className="text-sm">هیچ فیلتری فعال نیست</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Configuration */}
        <div className="p-5 border-t border-border/30 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <Label className="text-xs font-bold text-silver mr-1">مرتب‌سازی بر اساس</Label>
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger className="h-10 bg-background/50 border-border/30 [&>span]:w-full [&>span]:text-right flex-row-reverse text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="[&>*]:text-right" align="end">
                  {FIELD_CONFIGS.filter(f => f.sortable).map(f => (
                    <SelectItem key={f.name} value={f.name} className="flex-row-reverse justify-between cursor-pointer">
                      {FIELD_TRANSLATIONS[f.name]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-bold text-muted-foreground mr-1 invisible">جهت</Label>
              <Button 
                variant="outline" 
                className="h-10 bg-background/50 border-border/30 w-28 justify-between px-3 text-sm"
                onClick={() => setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')}
              >
                {sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                <span className="text-xs">{sortDirection === 'asc' ? 'صعودی' : 'نزولی'}</span>
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => setRules([])} className="text-destructive hover:bg-destructive/10 flex-1 h-11 text-sm font-medium">
              <Trash2 className="w-4 h-4 ml-2" /> پاک کردن
            </Button>
            <Button onClick={handleApply} className="gold-shine flex-[2] h-11 rounded-xl font-bold text-sm">اعمال فیلتر</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterRuleRow = ({ rule, onUpdate, onRemove }: { 
  rule: FilterRule; 
  onUpdate: (u: Partial<FilterRule>) => void; 
  onRemove: () => void 
}) => {
  const config = FIELD_CONFIGS.find((f) => f.name === rule.field)!;

  const getAvailableOperators = (): FilterOperator[] => {
    switch(config.type) {
      case 'counter': return ['equals'];
      case 'id_number': return ['equals', 'is_empty', 'is_full'];
      case 'boolean': return ['equals'];
      case 'text': return ['equals', 'contains', 'is_empty', 'is_full'];
      case 'range_number':
      case 'unix':
      case 'datetime': return ['gt', 'lt', 'between', 'is_empty', 'is_full'];
      default: return ['equals'];
    }
  };

  const ops = getAvailableOperators();

  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-background/40 border border-border/40 shadow-sm animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between border-b border-border/20 pb-2 mb-1">
        {/* Changed text-primary to text-foreground (Black/Dark) */}
        <span className="font-bold text-sm text-foreground">{FIELD_TRANSLATIONS[rule.field]}</span>
        <Button variant="ghost" size="icon" onClick={onRemove} className="h-6 w-6 text-muted-foreground hover:text-destructive">
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <Select 
          value={rule.operator} 
          onValueChange={(v) => {
            const newOperator = v as FilterOperator;
            const updates: Partial<FilterRule> = { operator: newOperator };
            
            if (newOperator === 'between' && (rule.valueTo === undefined || rule.valueTo === null || rule.valueTo === '')) {
              updates.valueTo = rule.value; 
            }
            
            onUpdate(updates);
          }}
        >
          <SelectTrigger className="bg-background/50 border-border/30 shadow-sm h-10 [&>span]:w-full [&>span]:text-right flex-row-reverse text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="[&>*]:text-right" align="end">
            {ops.map(op => <SelectItem key={op} value={op} className="flex-row-reverse justify-between cursor-pointer">
              {OPERATOR_LABELS[op]}
            </SelectItem>)}
          </SelectContent>
        </Select>

        {rule.operator !== 'is_empty' && rule.operator !== 'is_full' && (
          <div className="flex flex-col gap-3">
            <ValueInput 
              config={config} 
              value={rule.value} 
              onChange={(v) => onUpdate({ value: v })} 
              label={rule.operator === 'between' ? 'از مقدار / تاریخ' : undefined}
            />
            
            {rule.operator === 'between' && (
              <ValueInput 
                config={config} 
                value={rule.valueTo ?? rule.value} 
                onChange={(v) => onUpdate({ valueTo: v })} 
                label="تا مقدار / تاریخ"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ValueInput = ({ config, value, onChange, label }: { config: FieldConfig, value: any, onChange: (v: any) => void, label?: string }) => {
  return (
    <div className="space-y-2">
      {label && <Label className="text-xs font-bold text-silver mr-1">{label}</Label>}
      
      {config.type === 'boolean' ? (
        <div className="flex items-center justify-between bg-background/50 p-3 rounded-xl border border-border/30">
          <span className="text-sm font-medium">{value ? 'بله / فعال' : 'خیر / غیرفعال'}</span>
          <Switch checked={!!value} onCheckedChange={onChange} />
        </div>
      ) : ['date', 'datetime', 'unix'].includes(config.type) ? (
        <ManualDateTimeInput 
          value={value} 
          onChange={onChange} 
          showTime={config.type !== 'date'} 
          isUnix={config.type === 'unix'}
        />
      ) : (
        <Input
          type={config.type.includes('number') || config.type === 'counter' ? 'number' : 'text'}
          value={value ?? ''}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '') onChange('');
            else if (config.type.includes('number') || config.type === 'counter') onChange(Number(val));
            else onChange(val);
          }}
          className="bg-background/50 border-border/30 h-10 shadow-sm focus-visible:ring-primary text-right text-sm" 
          placeholder="مقدار را وارد کنید..."
        />
      )}
    </div>
  );
};

const ManualDateTimeInput = ({ value, onChange, showTime, isUnix }: { 
  value: any, 
  onChange: (v: any) => void, 
  showTime: boolean, 
  isUnix: boolean 
}) => {
  const dateObj = value 
    ? (isUnix ? new Date(Number(value) * 1000) : new Date(value)) 
    : new Date();

  // Local state for inputs
  const parts = {
    year: dateObj.getFullYear(),
    month: dateObj.getMonth() + 1,
    day: dateObj.getDate(),
    hour: dateObj.getHours(),
    minute: dateObj.getMinutes()
  };

  const updatePart = (key: keyof typeof parts, val: number) => {
    const newParts = { ...parts, [key]: val };
    const d = new Date(newParts.year, newParts.month - 1, newParts.day, newParts.hour, newParts.minute);
    onChange(isUnix ? Math.floor(d.getTime() / 1000) : d.toISOString());
  };

  const boxClass = "text-center bg-background/50 border border-border/30 rounded-lg text-sm font-mono h-10 focus:ring-1 ring-primary outline-none";

  return (
    <div className="flex gap-2 p-3 rounded-xl bg-background/40 border border-border/30 items-center justify-center overflow-x-auto" dir="ltr">
      
      {/* Date Section */}
      <div className="flex gap-1 items-center">
        <div className="flex flex-col gap-1 items-center">
          <Label className="text-xs text-silver">سال</Label>
          <input 
            type="number" 
            className={`${boxClass} w-[4.5rem]`} 
            value={parts.year} 
            onChange={e => updatePart('year', +e.target.value)} 
          />
        </div>
        <div className="flex flex-col gap-1 items-center">
          <Label className="text-xs text-silver">ماه</Label>
          <input 
            type="number" min="1" max="12" 
            className={`${boxClass} w-[3rem]`} 
            value={parts.month} 
            onChange={e => updatePart('month', +e.target.value)} 
          />
        </div>
        <div className="flex flex-col gap-1 items-center">
          <Label className="text-xs text-silver">روز</Label>
          <input 
            type="number" min="1" max="31" 
            className={`${boxClass} w-[3rem]`} 
            value={parts.day} 
            onChange={e => updatePart('day', +e.target.value)} 
          />
        </div>
      </div>

      {showTime && (
           <>
              <div className="w-[1px] h-6 bg-border/50 mx-1"></div>

              {/* Time Section */}
              <div className="flex gap-1 items-center">
                <div className="flex flex-col gap-1 items-center">
                  <Label className="text-xs text-silver">ساعت</Label>
                  <input 
                    type="number" min="0" max="23" 
                    className={`${boxClass} w-[3rem]`} 
                    value={parts.hour} 
                    onChange={e => updatePart('hour', +e.target.value)} 
                  />
                </div>
                <div className="flex flex-col gap-1 items-center">
                  <Label className="text-xs text-silver">دقیقه</Label>
                  <input 
                    type="number" min="0" max="59" 
                    className={`${boxClass} w-[3rem]`} 
                    value={parts.minute} 
                    onChange={e => updatePart('minute', +e.target.value)} 
                  />
                </div>
              </div>
           </>
        )}
    </div>
  );
};