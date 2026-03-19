// TimeRangeSelector — [FRD-006], [US-006]

import type { TimeRange } from '../../types';

const RANGES: TimeRange[] = ['1W', '1M', '3M', '1Y'];

interface TimeRangeSelectorProps {
  selected: TimeRange;
  onChange: (range: TimeRange) => void;
}

export default function TimeRangeSelector({ selected, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex gap-1">
      {RANGES.map((range) => (
        <button
          key={range}
          onClick={() => onChange(range)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-100 ${
            selected === range
              ? 'bg-indigo-600 text-white'
              : 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  );
}
