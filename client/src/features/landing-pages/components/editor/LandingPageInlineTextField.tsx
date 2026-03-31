import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LandingPageInlineTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  maxLength?: number;
}

export default function LandingPageInlineTextField({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  maxLength,
}: LandingPageInlineTextFieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-600">{label}</Label>
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="text-sm"
      />
      {helperText && <p className="text-xs text-gray-400">{helperText}</p>}
      {maxLength && (
        <p className="text-xs text-gray-400 text-right">{value.length}/{maxLength}</p>
      )}
    </div>
  );
}
