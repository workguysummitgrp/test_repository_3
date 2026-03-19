// Rate Limiter — [TR-002] Rate-Limit Queue
// Queue-based: 1 call per second minimum interval, 5 calls per minute rolling window

type QueueItem = {
  resolve: (value: void) => void;
};

const queue: QueueItem[] = [];
const callTimestamps: number[] = [];
let processing = false;

const MIN_INTERVAL_MS = 1200; // slightly over 1 second for safety
const WINDOW_MS = 60_000;     // 1 minute rolling window
const MAX_CALLS_PER_WINDOW = 5;

function cleanOldTimestamps(): void {
  const now = Date.now();
  while (callTimestamps.length > 0 && now - callTimestamps[0] > WINDOW_MS) {
    callTimestamps.shift();
  }
}

function getNextAllowedTime(): number {
  cleanOldTimestamps();

  const now = Date.now();
  let nextTime = now;

  // Enforce minimum interval between calls
  if (callTimestamps.length > 0) {
    const lastCall = callTimestamps[callTimestamps.length - 1];
    const timeSinceLast = now - lastCall;
    if (timeSinceLast < MIN_INTERVAL_MS) {
      nextTime = Math.max(nextTime, lastCall + MIN_INTERVAL_MS);
    }
  }

  // Enforce rolling window limit
  if (callTimestamps.length >= MAX_CALLS_PER_WINDOW) {
    const oldestInWindow = callTimestamps[0];
    nextTime = Math.max(nextTime, oldestInWindow + WINDOW_MS + 100);
  }

  return nextTime;
}

async function processQueue(): Promise<void> {
  if (processing) return;
  processing = true;

  while (queue.length > 0) {
    const nextTime = getNextAllowedTime();
    const now = Date.now();
    const delay = nextTime - now;

    if (delay > 0) {
      await new Promise((r) => setTimeout(r, delay));
    }

    const item = queue.shift();
    if (item) {
      callTimestamps.push(Date.now());
      item.resolve();
    }
  }

  processing = false;
}

export function enqueueRequest(): Promise<void> {
  return new Promise<void>((resolve) => {
    queue.push({ resolve });
    processQueue();
  });
}

export function getQueueLength(): number {
  return queue.length;
}
