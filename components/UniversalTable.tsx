import { useTableData } from "@/hooks/useTableData";

type ColumnDef = {
    key: string;       // поле в объекте
    label: string;     // заголовок колонки
    render?: (value: any, row: any) => React.ReactNode;
};

type Props = {
    data: Record<string, any>[];
    columns?: ColumnDef[];
    loading?: boolean;
};

function formatCellValue (value: any){
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'boolean') return value ? '✓' : '✗';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(value).toLocaleDateString();
    }
    return value.toString();
};

export const UniversalTable = ({ data, columns, loading }: Props) => {
    // Определяем колонки для отображения
    const tableColumns: ColumnDef[] = columns?.length
    ? columns
    : data.length > 0
    ? Object.keys(data[0])
        .filter(key => key !== 'id') // Исключаем id по умолчанию
        .map((k) => ({key: k, label: k}))
    : [];

    if (loading) return <div>Загрузка...</div>;

    return (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr>
              {tableColumns.map((col) => (
                <th key={col.key} className="border px-2 py-1 text-left">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-100">
                {tableColumns.map((col) => (
                  <td key={col.key} className="border px-2 py-1">
                    {col.render ? col.render(row[col.key], row) : formatCellValue(row[col.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
    );
};