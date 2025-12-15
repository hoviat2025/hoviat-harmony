import { useState, useEffect } from 'react';
import { X, Plus, Search, SortAsc, SortDesc, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
} from '@/features/users/types';
import { format } from 'date-fns';

interface DynamicFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRules: FilterRule[];
  currentOrderBy: string;
  onApply: (rules: FilterRule[], orderBy: string) => void;
}

type TextOperator = 'equals' | 'contains' | 'is_empty' | 'is_full';
type NumberOperator = 'equals' | 'gt' | 'lt' | 'is_empty' | 'is_full';
type DateOperator = 'equals' | 'gt' | 'lt' | 'is_empty' | 'is_full';
type BooleanOperator = 'equals' | 'is_empty' | 'is_full';

const TEXT_OPERATORS: { value: TextOperator; label: string }[] = [
  { value: 'equals', label: 'برابر باشد با' },
  { value: 'contains', label: 'شامل باشد' },
  { value: 'is_empty', label: 'خالی باشد' },
  { value: 'is_full', label: 'پر باشد' },
];

const NUMBER_OPERATORS: { value: NumberOperator; label: string }[] = [
  { value: 'equals', label: 'برابر باشد با' },
  { value: 'gt', label: 'بزرگتر از' },
  { value: 'lt', label: 'کوچکتر از' },
  { value: 'is_empty', label: 'خالی باشد' },
  { value: 'is_full', label: 'پر باشد' },
];

const DATE_OPERATORS: { value: DateOperator; label: string }[] = [
  { value: 'equals', label: 'برابر باشد با' },
  { value: 'gt', label: 'بعد از' },
  { value: 'lt', label: 'قبل از' },
  { value: 'is_empty', label: 'خالی باشد' },
  { value: 'is_full', label: 'پر باشد' },
];

const BOOLEAN_OPERATORS: { value: BooleanOperator; label: string }[] = [
  { value: 'equals', label: 'برابر باشد با' },
  { value: 'is_empty', label: 'خالی باشد' },
  { value: 'is_full', label: 'پر باشد' },
];

const SORTABLE_FIELDS = FIELD_CONFIGS.filter(f => f.sortable);
const FILTERABLE_FIELDS = FIELD_CONFIGS.filter(f => f.filterable);

export const DynamicFilterModal = ({
  isOpen,
  onClose,
  currentRules,
  currentOrderBy,
  onApply,
}: DynamicFilterModalProps) => {
  const [rules, setRules] = useState<FilterRule[]>(currentRules);
  const [orderBy, setOrderBy] = useState(currentOrderBy || '-counter');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    currentOrderBy.startsWith('-') ? 'desc' : 'asc'
  );
  const [sortField, setSortField] = useState(
    currentOrderBy.replace('-', '') || 'counter'
  );

  useEffect(() => {
    setRules(currentRules);
    setOrderBy(currentOrderBy || '-counter');
    setSortDirection(currentOrderBy.startsWith('-') ? 'desc' : 'asc');
    setSortField(currentOrderBy.replace('-', '') || 'counter');
  }, [currentRules, currentOrderBy, isOpen]);

  const addRule = (field: string) => {
    const config = FIELD_CONFIGS.find(f => f.name === field);
    if (!config) return;

    // Don't add duplicate fields
    if (rules.find(r => r.field === field)) return;

    let defaultOperator: FilterRule['operator'] = 'equals';
    if (config.type === 'text') defaultOperator = 'equals';
    else if (config.type === 'number') defaultOperator = 'equals';
    else if (config.type === 'date' || config.type === 'datetime') defaultOperator = 'equals';
    else if (config.type === 'boolean') defaultOperator = 'equals';

    const newRule: FilterRule = {
      field,
      operator: defaultOperator,
      value: config.type === 'boolean' ? true : undefined,
    };

    setRules([...rules, newRule]);
  };

  const removeRule = (field: string) => {
    setRules(rules.filter(r => r.field !== field));
  };

  const updateRule = (field: string, updates: Partial<FilterRule>) => {
    setRules(rules.map(r => 
      r.field === field ? { ...r, ...updates } : r
    ));
  };

  const handleApply = () => {
    const finalOrderBy = sortDirection === 'desc' ? `-${sortField}` : sortField;
    onApply(rules, finalOrderBy);
    onClose();
  };

  const handleClear = () => {
    setRules([]);
    setSortField('counter');
    setSortDirection('desc');
  };

  if (!isOpen) return null;

  const usedFields = new Set(rules.map(r => r.field));
  const availableFields = FILTERABLE_FIELDS.filter(f => !usedFields.has(f.name));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Foggy Backdrop */}
      <div 
        className="absolute inset-0 foggy-backdrop"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden glass-static rounded-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            فیلتر و جستجو
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto max-h-[60vh] space-y-4">
          {/* Add Rule Section */}
          <div className="space-y-2">
            <Label className="text-silver text-sm">افزودن فیلتر</Label>
            <Select onValueChange={addRule}>
              <SelectTrigger className="w-full bg-background/50">
                <SelectValue placeholder="انتخاب فیلد..." />
              </SelectTrigger>
              <SelectContent className="bg-popover z-[60]">
                {availableFields.map((field) => (
                  <SelectItem key={field.name} value={field.name}>
                    {FIELD_TRANSLATIONS[field.name] || field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Active Rules */}
          {rules.length > 0 && (
            <div className="space-y-3">
              <Label className="text-silver text-sm">فیلترهای فعال</Label>
              {rules.map((rule) => (
                <FilterRuleRow
                  key={rule.field}
                  rule={rule}
                  onUpdate={(updates) => updateRule(rule.field, updates)}
                  onRemove={() => removeRule(rule.field)}
                />
              ))}
            </div>
          )}

          {rules.length === 0 && (
            <div className="text-center py-8 text-silver">
              <Plus className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>فیلتری اضافه نشده است</p>
              <p className="text-xs mt-1">از بالا یک فیلد انتخاب کنید</p>
            </div>
          )}
        </div>

        {/* Sort Section */}
        <div className="p-4 border-t border-border/30 bg-muted/30">
          <Label className="text-silver text-sm mb-3 block">مرتب‌سازی</Label>
          <div className="flex gap-3">
            <Select value={sortField} onValueChange={setSortField}>
              <SelectTrigger className="flex-1 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-[60]">
                {SORTABLE_FIELDS.map((field) => (
                  <SelectItem key={field.name} value={field.name}>
                    {FIELD_TRANSLATIONS[field.name] || field.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortDirection(d => d === 'asc' ? 'desc' : 'asc')}
              className="px-4"
            >
              {sortDirection === 'asc' ? (
                <SortAsc className="w-5 h-5" />
              ) : (
                <SortDesc className="w-5 h-5" />
              )}
              <span className="mr-2">
                {sortDirection === 'asc' ? 'صعودی' : 'نزولی'}
              </span>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border/30">
          <Button variant="ghost" onClick={handleClear} className="text-destructive">
            <Trash2 className="w-4 h-4 ml-2" />
            پاک کردن همه
          </Button>
          <Button
            onClick={handleApply}
            className="gold-shine text-primary-foreground px-8"
          >
            اعمال فیلتر
          </Button>
        </div>
      </div>
    </div>
  );
};

// Individual Filter Rule Row Component
const FilterRuleRow = ({
  rule,
  onUpdate,
  onRemove,
}: {
  rule: FilterRule;
  onUpdate: (updates: Partial<FilterRule>) => void;
  onRemove: () => void;
}) => {
  const config = FIELD_CONFIGS.find(f => f.name === rule.field);
  if (!config) return null;

  const isNullCheck = rule.operator === 'is_empty' || rule.operator === 'is_full';

  const getOperators = () => {
    switch (config.type) {
      case 'text': return TEXT_OPERATORS;
      case 'number': return NUMBER_OPERATORS;
      case 'date':
      case 'datetime': return DATE_OPERATORS;
      case 'boolean': return BOOLEAN_OPERATORS;
      default: return TEXT_OPERATORS;
    }
  };

  const renderValueInput = () => {
    if (isNullCheck) return null;

    switch (config.type) {
      case 'text':
        return (
          <Input
            value={String(rule.value || '')}
            onChange={(e) => onUpdate({ value: e.target.value })}
            placeholder="مقدار..."
            className="flex-1 bg-background/50"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={String(rule.value || '')}
            onChange={(e) => onUpdate({ value: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="مقدار..."
            className="flex-1 bg-background/50"
          />
        );

      case 'date':
      case 'datetime':
        const dateValue = rule.value ? new Date(Number(rule.value) * 1000) : undefined;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-start bg-background/50">
                {dateValue ? format(dateValue, 'yyyy/MM/dd') : 'انتخاب تاریخ...'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[70]" align="start">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => {
                  if (date) {
                    // Convert to Unix timestamp (seconds)
                    onUpdate({ value: Math.floor(date.getTime() / 1000) });
                  }
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );

      case 'boolean':
        return (
          <div className="flex items-center gap-2">
            <Switch
              checked={Boolean(rule.value)}
              onCheckedChange={(checked) => onUpdate({ value: checked })}
            />
            <span className="text-sm text-silver">
              {rule.value ? 'بله' : 'خیر'}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 animate-fade-in">
      {/* Field Label */}
      <div className="min-w-24 text-sm font-medium text-foreground">
        {FIELD_TRANSLATIONS[rule.field] || rule.field}
      </div>

      {/* Operator Select */}
      <Select
        value={rule.operator}
        onValueChange={(op) => onUpdate({ operator: op as FilterRule['operator'] })}
      >
        <SelectTrigger className="w-36 bg-background/50">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-popover z-[60]">
          {getOperators().map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Value Input */}
      {renderValueInput()}

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
