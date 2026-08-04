import { useEffect, useRef, useState } from "react";
import { useInView } from "./Reveal";

export function StatCounter({
  value,
  suffix = "",
  label,
}: {
  value: number;
  suffix?: string;
  label: string;
}) {
  const { ref, visible } = useInView<HTMLDivElement>();
  const [display, setDisplay] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (!visible) return;
    const duration = 1600;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [visible, value]);

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-4xl font-semibold text-gold sm:text-5xl">
        {display.toLocaleString()}
        {suffix}
      </p>
      <p className="mt-2 text-sm tracking-wide text-primary-foreground/70">{label}</p>
    </div>
  );
}
