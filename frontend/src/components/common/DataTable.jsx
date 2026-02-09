const DataTable = ({ columns, rows }) => {
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <table className="min-w-full text-left text-sm text-slate-200">
        <thead className="bg-white/5 text-xs uppercase text-slate-400">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-4">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || index} className="border-t border-white/5">
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-4">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
