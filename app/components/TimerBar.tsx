"use client";

type Props = {
timeLeft: number;
total: number;
};

export default function TimerBar({ timeLeft, total }: Props) {
  const percent = (timeLeft / total) * 100;

return (
    <div
    style={{
        flex: 1,
        height: 12,
        background: "rgba(255,255,255,0.15)",
        borderRadius: 999,
        overflow: "hidden",
    }}
    >
    <div
        style={{
        height: "100%",
        width: `${percent}%`,
        background:
            percent > 40 ? "#22c55e" : percent > 20 ? "#facc15" : "#ef4444",
        transition: "width 1s linear",
        }}
    />
    </div>
);
}
