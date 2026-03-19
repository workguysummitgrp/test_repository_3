// NotFoundPage — 404

import { Link } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState';

export default function NotFoundPage() {
  return (
    <EmptyState
      icon={
        <span className="text-6xl">404</span>
      }
      title="Page Not Found"
      description="The page you're looking for doesn't exist."
      action={
        <Link
          to="/"
          className="bg-indigo-600 text-white font-medium text-sm px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      }
    />
  );
}
