// Badge — generic label badge
// [BRD-007]

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'positive' | 'negative';
  className?: string;
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variantClasses: Record<string, string> = {
    default: 'bg-gray-100 text-gray-600',
    positive: 'bg-emerald-100 text-emerald-700',
    negative: 'bg-red-100 text-red-700',
  };

  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
