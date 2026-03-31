import type { LandingPageRecord } from '../../types/landingPage.types';
import LandingPageInlineTextField from './LandingPageInlineTextField';

interface Props {
  page: LandingPageRecord;
  title: string;
  onTitleChange: (title: string) => void;
}

export default function LandingPageSettingsPanel({ page, title, onTitleChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Page Settings</h3>

      <LandingPageInlineTextField
        label="Page Title"
        value={title}
        onChange={onTitleChange}
        placeholder="Landing page title"
      />

      <div className="space-y-2 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Type</span>
          <span className="font-medium text-gray-700">{page.page_type || 'Custom'}</span>
        </div>
        {page.primary_service && (
          <div className="flex justify-between">
            <span>Service</span>
            <span className="font-medium text-gray-700">{page.primary_service}</span>
          </div>
        )}
        {page.city && (
          <div className="flex justify-between">
            <span>City</span>
            <span className="font-medium text-gray-700">{page.city}</span>
          </div>
        )}
        {page.target_audience && (
          <div className="flex justify-between">
            <span>Audience</span>
            <span className="font-medium text-gray-700 text-right max-w-[160px] truncate">{page.target_audience}</span>
          </div>
        )}
        {page.offer_summary && (
          <div className="flex justify-between">
            <span>Offer</span>
            <span className="font-medium text-gray-700 text-right max-w-[160px] truncate">{page.offer_summary}</span>
          </div>
        )}
      </div>
    </div>
  );
}
