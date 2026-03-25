// LastUpdated — [US-005] Reusable timestamp display component
// Renders relative time with absolute tooltip on hover.
// Uses <time> element with datetime attribute for accessibility.

import { formatRelativeTime, formatAbsoluteTime } from '../../utils/formatters';

interface LastUpdatedProps {
  fetchedAt: number | null | undefined;
}

export default function LastUpdated({ fetchedAt }: LastUpdatedProps) {
  if (!fetchedAt || fetchedAt <= 0) return null;

  const relativeTime = formatRelativeTime(fetchedAt);
  const absoluteTime = formatAbsoluteTime(fetchedAt);
  const isoTime = new Date(fetchedAt).toISOString();

  return (
    <time
      dateTime={isoTime}
      title={absoluteTime}
      className="text-sm text-gray-500 block"
    >
      Last updated: {relativeTime}
    </time>
  );
}
