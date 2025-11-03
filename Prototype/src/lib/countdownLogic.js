// An attempt to get test logic working for Countdown component
// Countdown itself is not able to be tested directly due to dependency on browser APIs
// Logic extracted here for unit testing
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function tick(timeLeft) {
  return timeLeft > 0 ? timeLeft - 1 : 0;
}
