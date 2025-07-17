import React, { useEffect, useState } from 'react';
import { FiLink } from "react-icons/fi";
import { formatDate, formatStatus, formatSprint } from './utils/formatter';

type JiraTask = {
  id: string;
  task: string;
  status: string;
  created: string;
  updated: string;
  sprint?: string[];
  url: string;
};

type JiraIssue = {
  key: string;
  fields: {
    summary: string;
    status: { name: string };
    created: string;
    updated: string;
    customfield_10020?: { name: string }[];
  };
  url: string;
  sprint?: string;
};

const columns = [
  { key: "status", label: "Status" },
  { key: "id", label: "ID" },
  { key: "task", label: "Task" },
  { key: "updated", label: "Updated" },
  { key: "created", label: "Created" },
  { key: "sprint", label: "Sprint" },
  { key: "url", label: "URL" },
];

const App: React.FC = () => {
  const [data, setData] = useState<JiraTask[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>("id");
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    const fetchTasks = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/jira-tasks');
        if (!res.ok) {
          const errJson = await res.json().catch(() => ({}));
          setError(
            errJson.errorMessages?.[0] ||
            `Error: ${res.status} ${res.statusText}`
          );
          return;
        }
        const json = await res.json();
        if (!json.issues) {
          setError("Error: Unexpected Jira response format.");
          return;
        }
        const mapped: JiraTask[] = (json.issues as JiraIssue[]).map((issue) => ({
          id: issue.key,
          task: issue.fields.summary,
          status: issue.fields.status.name,
          created: issue.fields.created,
          updated: issue.fields.updated,
          sprint: issue.sprint ? (Array.isArray(issue.sprint) ? issue.sprint : [issue.sprint]) : undefined,
          url: issue.url,
        }));
        setData(mapped);
        setError(null);
      } catch {
        setError("Cannot connect to Jira.");
      }
    };
    fetchTasks();
  }, [theme]);

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortKey as keyof JiraTask];
    const bVal = b[sortKey as keyof JiraTask];

    // Special handling for ID column (extract number)
    if (sortKey === "id") {
      const aNum = parseInt((aVal as string).split('-')[1], 10);
      const bNum = parseInt((bVal as string).split('-')[1], 10);
      return sortAsc ? aNum - bNum : bNum - aNum;
    }

    // Date columns
    if (sortKey === "created" || sortKey === "updated") {
      const aDate = new Date(aVal as string).getTime();
      const bDate = new Date(bVal as string).getTime();
      return sortAsc ? aDate - bDate : bDate - aDate;
    }

    // Sprint: sort by first sprint number if possible
    if (sortKey === "sprint") {
      const getFirstSprintNum = (arr?: string[]) => {
        if (!arr || arr.length === 0) return 0;
        const m = arr[0].match(/\d+/);
        return m ? parseInt(m[0], 10) : 0;
      };
      const aNum = getFirstSprintNum(a.sprint);
      const bNum = getFirstSprintNum(b.sprint);
      return sortAsc ? aNum - bNum : bNum - aNum;
    }

    // Status, Task, URL: string compare
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortAsc
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    return 0;
  });

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className={`table-container min-h-screen flex justify-center ${theme === "light" ? "bg-gradient-to-br from-blue-100 to-teal-100" : "bg-gradient-to-br from-gray-900 to-gray-800"}`}>
      <div className="w-full max-w-[90vw] p-6 relative">
        {/* Theme Switch Button */}
        <button
          style={{ position: "fixed", top: 24, right: 32, zIndex: 50 }}
          className="px-4 py-2 rounded shadow bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-300 dark:border-gray-700 transition"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
        >
          {theme === "light" ? "🌙 " : "☀️ "}
        </button>
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
                  onClick={() => handleSort(col.key)}
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
            {sortedData.map((item) => (
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;