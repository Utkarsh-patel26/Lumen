const PageHeader = ({ title, subtitle, action }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-semibold text-white md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-slate-300">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

export default PageHeader;
