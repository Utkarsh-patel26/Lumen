import clsx from "clsx";

const Input = ({ label, error, className, ...props }) => {
  return (
    <label className="block text-sm text-slate-200">
      {label && <span className="mb-2 block font-medium">{label}</span>}
      <input
        className={clsx(
          "w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/30",
          className
        )}
        {...props}
      />
      {error && <span className="mt-2 block text-xs text-rose-300">{error}</span>}
    </label>
  );
};

export default Input;
