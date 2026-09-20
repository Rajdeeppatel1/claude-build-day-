export default function DataTable({ columns, data, emptyMessage = "No data available." }) {
  return (
    <div className="data-table-container fade-in">
      <div className="table-responsive" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={col.style}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="data-table-empty">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr key={row.id || rowIdx}>
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} style={col.style}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
