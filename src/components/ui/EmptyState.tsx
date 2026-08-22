type EmptyStateProps = {
  message: string;
  className?: string;
};

export function EmptyState({
  message,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex min-h-24 w-full items-center justify-center rounded-2xl bg-field px-6 text-body text-content-muted ${className}`}
    >
      {message}
    </div>
  );
}
