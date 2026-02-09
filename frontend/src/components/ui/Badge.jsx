import clsx from "clsx";

const Badge = ({ children, tone = "neutral", className }) => {
  const tones = {
    neutral: "bg-white/10 text-white",
    success: "bg-emerald-400/20 text-emerald-200",
    info: "bg-sky-400/20 text-sky-200",
    warn: "bg-amber-400/20 text-amber-200"
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
