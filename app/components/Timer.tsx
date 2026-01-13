"use client";

type TimerProps = {
  timeLeft: number;
};

/**
 * Presentational timer component.
 * Countdown logic lives in the parent (Quiz page) so we can score based on timeLeft.
 */
export default function Timer({ timeLeft }: TimerProps) {
  return (
    <div style={{ fontWeight: 600 }} aria-live="polite">
      ⏱ {timeLeft}
    </div>
  );
}
