import clsx from "clsx";

const Skeleton = ({ className }) => {
  return <div className={clsx("animate-pulse rounded-2xl bg-white/10", className)} />;
};

export default Skeleton;
