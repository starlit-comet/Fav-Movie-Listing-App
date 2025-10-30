import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function AuthCard({ title, subtitle, children, footer }: Props) {
  return (
    <div className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-100">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
      {footer ? <div className="mt-6 text-center text-sm text-gray-600">{footer}</div> : null}
    </div>
  );
}
