interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog" onClick={e => e.stopPropagation()}>
        <h3 className="dialog-title">{title}</h3>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button onClick={onCancel} className="btn btn-outline">
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

