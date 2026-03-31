import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface LandingPageInlineTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  rows?: number;
  maxLength?: number;
}

export default function LandingPageInlineTextarea({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  rows = 3,
  maxLength,
}: LandingPageInlineTextareaProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-gray-600">{label}</Label>
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="text-sm resize-y"
      />
      {helperText && <p className="text-xs text-gray-400">{helperText}</p>}
      {maxLength && (
        <p className="text-xs text-gray-400 text-right">{value.length}/{maxLength}</p>
      )}
    </div>
  );
}
