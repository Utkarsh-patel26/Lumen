import Button from "../ui/Button.jsx";

const EmptyState = ({ title, description, actionLabel, onAction }) => {
  return (
    <div className="glass rounded-3xl px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {description && <p className="mt-2 text-sm text-slate-300">{description}</p>}
      {actionLabel && (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
