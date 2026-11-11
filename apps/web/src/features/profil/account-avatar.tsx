import { profileInitials } from './profile-initials';
import type { AccountAvatarProps } from './types';

const SIZE_CLASSES = {
  sm: 'size-[34px] text-xs',
  md: 'size-[38px] text-[13px]',
  lg: 'size-[52px] text-lg',
} as const;

export function AccountAvatar({ nama, email, size = 'lg' }: AccountAvatarProps) {
  return (
    <span
      aria-hidden="true"
      className={`grid shrink-0 place-items-center rounded-full bg-[#edf5ff] font-semibold text-[#1769c2] ${SIZE_CLASSES[size]}`}
    >
      {profileInitials(nama, email)}
    </span>
  );
}
