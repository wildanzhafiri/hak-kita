import type { EyebrowProps } from './types';

export function Eyebrow({ children, light = false, marker = true }: EyebrowProps) {
  return (
    <span className={light ? 'eyebrow light' : 'eyebrow'}>
      {marker && <span />}
      {children}
    </span>
  );
}
