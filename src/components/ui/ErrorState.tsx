import { Button } from "./Button";

type ErrorStateProps = {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({
  message,
  retryLabel,
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex w-full flex-col items-center justify-center gap-4 rounded-2xl bg-danger-surface px-6 py-8 text-center text-danger ${className}`}
    >
      <p className="text-body">{message}</p>
      {onRetry && retryLabel && (
        <Button type="button" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
