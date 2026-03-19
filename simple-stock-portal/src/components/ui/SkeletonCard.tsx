// SkeletonCard — loading placeholder [US-015]

interface SkeletonCardProps {
  className?: string;
  lines?: number;
}

export default function SkeletonCard({ className = '', lines = 3 }: SkeletonCardProps) {
  return (
    <div className={`animate-pulse bg-white rounded-xl border border-gray-200 p-4 ${className}`}>
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-3 bg-gray-100 rounded mb-2 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}
