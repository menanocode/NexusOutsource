import React from 'react';

// Basic table wrapper. In a real app with Tanstack Table, this would accept the table instance
export const Table = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-slate-200 dark:border-slate-700 sm:rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              {children}
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TableHeader = ({ children }: { children: React.ReactNode }) => (
  <thead className="bg-slate-50 dark:bg-slate-800">
    {children}
  </thead>
);

export const TableRow = ({ children }: { children: React.ReactNode }) => (
  <tr className="bg-white dark:bg-slate-900">
    {children}
  </tr>
);

export const TableHead = ({ children }: { children: React.ReactNode }) => (
  <th
    scope="col"
    className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider"
  >
    {children}
  </th>
);

export const TableBody = ({ children }: { children: React.ReactNode }) => (
  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
    {children}
  </tbody>
);

export const TableCell = ({ children }: { children: React.ReactNode }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-slate-100">
    {children}
  </td>
);
