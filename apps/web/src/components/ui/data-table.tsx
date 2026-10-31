import type { DataTableProps } from './types';

export function DataTable({ columns, rows }: DataTableProps) {
  const cellClassName =
    'min-w-[110px] border-b border-[var(--border)] px-[17px] py-[15px] align-top';

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left text-xs">
        <thead className="bg-[var(--bg)] text-[11px]">
          <tr>
            {columns.map((column) => (
              <th className={`${cellClassName} font-semibold`} key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, cells }) => (
            <tr key={key}>
              {cells.map((cell, i) =>
                i === 0 ? (
                  <th className={`${cellClassName} font-medium`} key={i} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td className={`${cellClassName} text-[var(--muted)]`} key={i}>
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
