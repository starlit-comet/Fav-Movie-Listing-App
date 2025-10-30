import type { ReactNode } from "react";

type Props = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export default function FormField({ label, htmlFor, hint, error, children }: Props) {
  return (
    <label htmlFor={htmlFor} className="block w-full text-sm">
      <span className="mb-1 inline-block font-medium text-gray-700">{label}</span>
      <div>{children}</div>
      {hint ? <span className="mt-1 block text-xs text-gray-500">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs text-red-600">{error}</span> : null}
    </label>
  );
}
