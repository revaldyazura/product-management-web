import React from 'react';
import '../../styles/components/table/DataTable.css';

/**
 * DataTable - minimal, reusable table
 * Props:
 * - columns: Array<{ key: string, header: string, width?: string|number, render?: (row) => ReactNode }>
 * - data: Array<any>
 * - emptyText?: string
 */
export default function DataTable({ columns, data, emptyText = 'Tidak ada data' }) {
  return (
    <div className="admintable wrapper">
      <table className="admintable table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td className="admintable__empty" colSpan={columns.length}>
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={row.id || idx}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
