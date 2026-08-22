import type { Key, ReactNode } from "react";

export type TableColumn<T> = {
  id: string;
  header: ReactNode;
  cell: (row: T, index: number) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

type TableProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];
  getRowKey: (row: T, index: number) => Key;
  ariaLabel?: string;
  emptyContent?: ReactNode;
  className?: string;
  tableClassName?: string;
};

export function Table<T>({
  columns,
  rows,
  getRowKey,
  ariaLabel,
  emptyContent,
  className = "",
  tableClassName = "",
}: TableProps<T>) {
  return (
    <div
      className={`min-w-0 overflow-hidden rounded-[10px] border border-table-rule ${className}`}
    >
      <div className="overflow-x-auto overscroll-x-contain">
        <table
          aria-label={ariaLabel}
          className={`w-full min-w-full border-collapse text-body text-content ${tableClassName}`}
        >
          <thead className="bg-table-header text-content">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  scope="col"
                  className={`px-4 py-4 text-left align-middle text-body text-content sm:px-6 sm:py-5 ${column.headerClassName ?? ""}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={getRowKey(row, rowIndex)}
                className="border-t border-table-rule bg-transparent"
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={`px-4 py-4 align-middle text-body text-content sm:px-6 sm:py-5 ${column.cellClassName ?? ""}`}
                  >
                    {column.cell(row, rowIndex)}
                  </td>
                ))}
              </tr>
            ))}

            {rows.length === 0 && emptyContent !== undefined && (
              <tr className="border-t border-table-rule bg-transparent">
                <td
                  colSpan={columns.length}
                  className="px-4 py-4 text-center align-middle text-body text-content sm:px-6 sm:py-5"
                >
                  {emptyContent}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
