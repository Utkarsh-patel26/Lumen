import clsx from "clsx";

const Card = ({ children, className }) => {
  return (
    <div className={clsx("glass rounded-3xl p-6 shadow-glass", className)}>{children}</div>
  );
};

export default Card;
