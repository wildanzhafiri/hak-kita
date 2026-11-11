import Link from 'next/link';
import { AUTH_SHARED_COPY as COPY } from './content';
import type { AuthLayoutProps } from './types';

export function AuthLayout({ title, subtitle, hidePrivacy = false, children }: AuthLayoutProps) {
  return (
    <section aria-labelledby="auth-title" className="mx-auto w-full max-w-[440px] text-[#1b304c]">
      <div className="mb-6">
        <h1
          className="m-0 mb-3.5 text-[32px] font-bold capitalize leading-[1.25] tracking-[-0.025em] max-[640px]:text-[30px]"
          id="auth-title"
        >
          {title}
        </h1>
        <p className="m-0 text-[15px] leading-[1.65] text-[#687385]">{subtitle}</p>
      </div>
      {children}
      {!hidePrivacy && (
        <p className="mb-0 mt-[22px] text-center text-xs leading-[1.65] text-[#687385]">
          {COPY.privacy}
          <br />
          <Link className="text-[#1769c2] hover:underline" href="/privasi">
            {COPY.privacyLink}
          </Link>
        </p>
      )}
    </section>
  );
}
