import { useUiStore } from "../../store/uiStore.js";

const ToastHost = () => {
  const { toasts, removeToast } = useUiStore();

  return (
    <div className="fixed right-6 top-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="glass flex items-start gap-3 rounded-2xl px-4 py-3 text-sm text-white shadow-glass"
          onClick={() => removeToast(toast.id)}
          role="button"
          tabIndex={0}
        >
          <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
          <div>
            <p className="font-semibold">{toast.title}</p>
            {toast.message && <p className="text-xs text-slate-300">{toast.message}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ToastHost;
