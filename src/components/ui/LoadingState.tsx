type LoadingStateProps = {
  label: string;
  className?: string;
};

export function LoadingState({
  label,
  className = "",
}: LoadingStateProps) {
  return (
    <div
      role="status"
      className={`flex min-h-24 w-full items-center justify-center text-body text-content-muted ${className}`}
    >
      {label}
    </div>
  );
}
