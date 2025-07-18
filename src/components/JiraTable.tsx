import React from 'react';
import { FiLink } from "react-icons/fi";
import { formatDate, formatStatus, formatSprint } from '../utils/formatter';

export interface JiraTask {
  id: string;
  task: string;
  status: string;
  created: string;
  updated: string;
  sprint?: string[];
  url: string;
}

interface JiraTableProps {
  data: JiraTask[];
  error: string | null;
  columns: { key: string; label: string }[];
  sortKey: string;
  sortAsc: boolean;
  onSort: (key: string) => void;
  theme: 'light' | 'dark';
  onLogHover?: (issueId: string) => void;
}

const JiraTable: React.FC<JiraTableProps> = ({ data, error, columns, sortKey, sortAsc, onSort, theme, onLogHover }) => (
  <div className="w-full max-w-[90vw] p-6 relative">
    {error && (
      <div className={`mb-4 p-4 rounded border ${theme === "light" ? "bg-red-100 text-red-700 border-red-300" : "bg-red-900 text-red-200 border-red-700"}`}>
        {error}
      </div>
    )}
    <table className={`w-full border-collapse shadow-lg rounded-lg overflow-hidden backdrop-blur-sm ${theme === "light" ? "bg-white/80" : "bg-gray-900/80"}`}>
      <thead>
        <tr className={`${theme === "light" ? "bg-gradient-to-r from-blue-200 to-teal-200 text-gray-700" : "bg-gradient-to-r from-gray-800 to-gray-700 text-gray-200"}`}>
          {columns.map(col => (
            <th
              key={col.key}
              className="py-4 px-6 text-left font-semibold text-sm uppercase tracking-wider cursor-pointer select-none"
              onClick={() => onSort(col.key)}
            >
              {col.label}
              {sortKey === col.key && (
                <span className="ml-1">
                  {sortAsc ? "▲" : "▼"}
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr key={item.id} className={`${theme === "light" ? "border-b border-blue-100/50 hover:bg-blue-50/50" : "border-b border-gray-700/50 hover:bg-gray-800/70"} transition-colors`}>
            <td className={`${theme === "light" ? "text-gray-800" : "text-gray-200"} py-4 px-2 w-40 min-w-28`}>{formatStatus(item.status)}</td>
            <td className={`${theme === "light" ? "text-gray-800" : "text-gray-200"} py-4 px-4 w-40 min-w-28`}>{item.id}</td>
            <td className={`${theme === "light" ? "text-gray-800" : "text-gray-200"} py-4 px-2`}>{item.task}</td>
            <td className={`${theme === "light" ? "text-gray-800" : "text-gray-200"} py-4 px-2`}>{formatDate(item.updated)}</td>
            <td className={`${theme === "light" ? "text-gray-800" : "text-gray-200"} py-4 px-2`}>{formatDate(item.created)}</td>
            <td className={`${theme === "light" ? "text-gray-800" : "text-gray-200"} py-4 px-6`}>{formatSprint(item.sprint)}</td>
            <td className="py-4 px-2 text-blue-700 dark:text-blue-300">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:underline"
                title="Open in Jira"
              >
                <FiLink className="w-5 h-5" />
              </a>
            </td>
            {/* Log column */}
            <td className="py-4 px-2">
              <button
                className={`rounded-full px-3 py-1 text-xs font-bold shadow transition ${theme === 'light' ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-700 text-blue-200 hover:bg-gray-800'}`}
                onClick={() => onLogHover && onLogHover(item.id)}
                title="Show log"
              >
                Log
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default JiraTable;
