import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { User, FIELD_TRANSLATIONS, FIELD_CONFIGS, UserUpdateRequest } from '@/features/users/types';
import { useUpdateUser } from '@/features/users/hooks/useUsers';
import { format } from 'date-fns';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

// Editable fields
const EDITABLE_FIELDS = [
  'username',
  'first_name',
  'last_name',
  'nickname',
  'phone_number',
  'whatsapp_number',
  'country',
  'password',
  'is_ban',
  'is_registered',
  'chat_not_found',
  'score',
  'ban_time',
];

export const EditUserModal = ({ isOpen, onClose, user }: EditUserModalProps) => {
  const [formData, setFormData] = useState<Partial<UserUpdateRequest>>({});
  const { mutate: updateUser, isPending } = useUpdateUser();

  useEffect(() => {
    if (isOpen && user) {
      // Initialize form with current user data
      const initialData: Partial<UserUpdateRequest> = {
        user_id: user.user_id,
      };
      
      EDITABLE_FIELDS.forEach((field) => {
        const value = user[field as keyof User];
        if (value !== undefined && value !== null) {
          (initialData as Record<string, unknown>)[field] = value;
        }
      });
      
      setFormData(initialData);
    }
  }, [isOpen, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData as UserUpdateRequest, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

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
          <h2 className="text-lg font-bold text-foreground">
            ویرایش کاربر - {user.first_name || user.username || user.user_id}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            disabled={isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-4 overflow-y-auto max-h-[60vh] space-y-4">
            {EDITABLE_FIELDS.map((field) => {
              const config = FIELD_CONFIGS.find(f => f.name === field);
              if (!config) return null;

              return (
                <EditFieldRow
                  key={field}
                  field={field}
                  type={config.type}
                  value={formData[field as keyof UserUpdateRequest]}
                  onChange={(value) => updateField(field, value)}
                />
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-4 border-t border-border/30">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isPending}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="gold-shine text-primary-foreground px-8"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  در حال ذخیره...
                </span>
              ) : (
                'ذخیره تغییرات'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Individual Edit Field Row Component
const EditFieldRow = ({
  field,
  type,
  value,
  onChange,
}: {
  field: string;
  type: string;
  value: unknown;
  onChange: (value: unknown) => void;
}) => {
  const label = FIELD_TRANSLATIONS[field] || field;

  const renderInput = () => {
    switch (type) {
      case 'text':
        return (
          <Input
            value={String(value || '')}
            onChange={(e) => onChange(e.target.value || undefined)}
            placeholder={label}
            className="bg-background/50"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value !== undefined && value !== null ? String(value) : ''}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : undefined)}
            placeholder={label}
            className="bg-background/50"
          />
        );

      case 'date':
      case 'datetime':
        const dateValue = value ? new Date(Number(value) * 1000) : undefined;
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start bg-background/50">
                {dateValue ? format(dateValue, 'yyyy/MM/dd HH:mm') : `انتخاب ${label}...`}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 z-[70]" align="start">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={(date) => {
                  if (date) {
                    onChange(Math.floor(date.getTime() / 1000));
                  } else {
                    onChange(undefined);
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
              checked={Boolean(value)}
              onCheckedChange={onChange}
            />
            <span className="text-sm text-silver">
              {value ? 'بله' : 'خیر'}
            </span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <Label className="text-silver text-sm">{label}</Label>
      {renderInput()}
    </div>
  );
};
