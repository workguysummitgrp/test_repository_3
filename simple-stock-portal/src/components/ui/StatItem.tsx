// StatItem — quote stat display
// [FRD-003], [US-004]

interface StatItemProps {
  label: string;
  value: string;
  className?: string;
}

export default function StatItem({ label, value, className = '' }: StatItemProps) {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-3 ${className}`}>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="font-mono text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}
