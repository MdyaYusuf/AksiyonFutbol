import { useEffect } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmTone?: "danger" | "primary";
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmTone = "primary",
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isConfirming) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isConfirming, onCancel]);

  if (!open) {
    return null;
  }

  const confirmButtonClass =
    confirmTone === "danger"
      ? "bg-error text-on-error hover:brightness-110"
      : "bg-primary text-on-primary hover:brightness-110";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/60"
        disabled={isConfirming}
        onClick={() => {
          if (!isConfirming) {
            onCancel();
          }
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        className="relative z-10 w-full max-w-md rounded-lg border border-outline-variant bg-surface-container-high p-5 shadow-lg"
      >
        <h3
          id="confirm-dialog-title"
          className="text-headline-sm font-semibold text-on-surface"
        >
          {title}
        </h3>
        <p
          id="confirm-dialog-message"
          className="mt-2 text-body-sm text-on-surface-variant"
        >
          {message}
        </p>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            disabled={isConfirming}
            onClick={onCancel}
            className="rounded border border-outline-variant px-4 py-2 text-body-sm font-semibold text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isConfirming}
            onClick={onConfirm}
            className={`rounded px-4 py-2 text-body-sm font-semibold transition-colors disabled:opacity-50 ${confirmButtonClass}`}
          >
            {isConfirming ? "Please wait…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
