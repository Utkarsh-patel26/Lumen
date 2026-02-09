import clsx from "clsx";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}) => {
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent";
  const variants = {
    primary: "bg-emerald-400 text-slate-950 hover:bg-emerald-300 focus:ring-emerald-400",
    secondary: "bg-white/10 text-white hover:bg-white/20 focus:ring-white/30",
    ghost: "bg-transparent text-white hover:bg-white/10 focus:ring-white/20",
    danger: "bg-rose-500 text-white hover:bg-rose-400 focus:ring-rose-400"
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      type={type}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
