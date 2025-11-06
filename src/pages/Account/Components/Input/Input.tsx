export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "capture"
> & {
  label: string;
  value: string;
  onChange: (value: string) => void;
  capture?: boolean | "user" | "environment";
};

export function Input({ label, onChange, ...othersProps }: InputProps) {
  return (
    <label>
      <span>{label}</span>

      <input
        {...othersProps}
        onChange={(e) => onChange(String(e.target.value))}
      />
    </label>
  );
}
