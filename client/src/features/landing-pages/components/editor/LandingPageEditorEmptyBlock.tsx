import { FileText } from 'lucide-react';

interface Props {
  sectionLabel: string;
}

export default function LandingPageEditorEmptyBlock({ sectionLabel }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed rounded-lg bg-gray-50">
      <FileText className="h-8 w-8 text-gray-300 mb-2" />
      <p className="text-sm text-gray-400">No {sectionLabel} content yet</p>
      <p className="text-xs text-gray-300 mt-1">Use AI regeneration to generate this section</p>
    </div>
  );
}
