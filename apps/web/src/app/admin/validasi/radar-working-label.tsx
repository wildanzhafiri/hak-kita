import type { RadarWorkingLabelProps } from './types';

const DOT_DELAYS_MS = [0, 160, 320] as const;

export function RadarWorkingLabel({ children, isWorking }: RadarWorkingLabelProps) {
  if (!isWorking) return <span>{children}</span>;
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2.5">
      <span className="animate-agent-shimmer bg-[linear-gradient(90deg,#253044_0%,#253044_38%,#196dcc_50%,#253044_62%,#253044_100%)] bg-[length:250%_100%] bg-clip-text text-transparent">
        {children}
      </span>
      <span aria-hidden="true" className="inline-flex items-center gap-1">
        {DOT_DELAYS_MS.map((delay) => (
          <span
            key={delay}
            className="size-1.5 animate-agent-dot rounded-full bg-[#196dcc]"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </span>
    </span>
  );
}
