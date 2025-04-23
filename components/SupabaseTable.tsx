import { useState, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';

interface SupabaseTableProps {
  supabaseClient: SupabaseClient;
  tableName: string;
  columns?: string[]; // Опционально: какие колонки показывать
  pageSize?: number; // Опционально: пагинация
  className?: string; // Дополнительные классы для контейнера
}

/**
 * Универсальный компонент таблицы для Supabase
 */
const SupabaseTable = ({
  supabaseClient,
  tableName,
  columns,
  pageSize = 10,
  className = ''
}: SupabaseTableProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // Получаем данные из Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Базовый запрос
        let query = supabaseClient
          .from(tableName)
          .select(columns ? columns.join(',') : '*', 
                  pageSize > 0 ? { count: 'exact' } : undefined);

        // Добавляем пагинацию если нужно
        if (pageSize > 0) {
          query = query.range(
            (currentPage - 1) * pageSize,
            currentPage * pageSize - 1
          );
        }

        const { data: fetchedData, error, count } = await query;

        if (error) throw error;
        
        setData(fetchedData || []);
        setTotalCount(count || null);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName, currentPage, pageSize, supabaseClient, columns]);

  // Определяем колонки для отображения
  const tableColumns = columns?.length
    ? columns
    : data.length > 0
    ? Object.keys(data[0]).filter(key => key !== 'id') // Исключаем id по умолчанию
    : [];

  // Функция для форматирования значения ячейки
  const formatCellValue = (value: any) => {
    if (value === null || value === undefined) return 'NULL';
    if (typeof value === 'boolean') return value ? '✓' : '✗';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      return new Date(value).toLocaleDateString();
    }
    return value.toString();
  };

  // Состояние загрузки
  if (loading) {
    return (
      <div className={`flex justify-center items-center h-32 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Ошибка
  if (error) {
    return (
      <div className={`bg-red-50 border-l-4 border-red-500 p-4 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Ошибка загрузки данных: <span className="font-medium">{error}</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Нет данных
  if (!data.length) {
    return (
      <div className={`bg-blue-50 border-l-4 border-blue-500 p-4 ${className}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              В таблице <span className="font-medium">{tableName}</span> нет данных
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Рендер таблицы
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                {tableColumns.map((column) => (
                  <th
                    key={column}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((row, rowIndex) => (
                <tr 
                  key={rowIndex} 
                  className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  {tableColumns.map((column) => (
                    <td
                      key={`${rowIndex}-${column}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-800"
                    >
                      <div className="flex items-center">
                        {column === 'avatar' && row[column] ? (
                          <img 
                            className="h-10 w-10 rounded-full mr-3" 
                            src={row[column]} 
                            alt="Avatar" 
                          />
                        ) : null}
                        <span>{formatCellValue(row[column])}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Пагинация */}
      {pageSize > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Показано <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> -{' '}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalCount || 0)}
                </span>{' '}
                из <span className="font-medium">{totalCount || 0}</span> записей
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Первая</span>
                  «
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Предыдущая</span>
                  ‹
                </button>
                <button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={data.length < pageSize || (totalCount !== null && currentPage * pageSize >= totalCount)}
                  className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Следующая</span>
                  ›
                </button>
                <button
                  onClick={() => totalCount && setCurrentPage(Math.ceil(totalCount / pageSize))}
                  disabled={data.length < pageSize || (totalCount !== null && currentPage * pageSize >= totalCount)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">Последняя</span>
                  »
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseTable;