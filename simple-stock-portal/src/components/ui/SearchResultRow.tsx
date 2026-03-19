// SearchResultRow — [FRD-002], [US-003]

import { ChevronRightIcon } from '@heroicons/react/24/outline';
import Badge from './Badge';

interface SearchResultRowProps {
  symbol: string;
  name: string;
  type: string;
  region: string;
  onClick: () => void;
}

export default function SearchResultRow({ symbol, name, type, region, onClick }: SearchResultRowProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors text-left"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className="font-mono text-sm font-semibold text-gray-900 shrink-0">{symbol}</span>
        <span className="text-sm text-gray-600 truncate">{name}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-4">
        <Badge>{type}</Badge>
        <Badge>{region}</Badge>
        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
      </div>
    </button>
  );
}
