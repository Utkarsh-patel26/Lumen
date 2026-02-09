import Button from "../ui/Button.jsx";

const Modal = ({ open, title, children, onClose, primaryLabel, onPrimary }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 px-4">
      <div className="glass w-full max-w-lg rounded-3xl p-6 shadow-glass">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button className="text-slate-300" onClick={onClose} type="button">
            x
          </button>
        </div>
        <div className="mt-4 text-sm text-slate-200">{children}</div>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {primaryLabel && (
            <Button variant="primary" onClick={onPrimary}>
              {primaryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
