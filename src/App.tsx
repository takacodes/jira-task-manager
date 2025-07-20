
import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import JiraTable from './components/JiraTable';
import type { JiraTask } from './components/JiraTable';

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
  { key: "log", label: "Log" },
];

import JiraLogModal from './components/JiraLogModal';

const App: React.FC = () => {
  const [data, setData] = useState<JiraTask[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<string>("updated");
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [modalIssueId, setModalIssueId] = useState<string | null>(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const sortedData = [...data].sort((a, b) => {
    const aVal = a[sortKey as keyof JiraTask];
    const bVal = b[sortKey as keyof JiraTask];

    if (sortKey === "id") {
      const aNum = parseInt((aVal as string).split('-')[1], 10);
      const bNum = parseInt((bVal as string).split('-')[1], 10);
      return sortAsc ? aNum - bNum : bNum - aNum;
    }
    if (sortKey === "created" || sortKey === "updated") {
      const aDate = new Date(aVal as string).getTime();
      const bDate = new Date(bVal as string).getTime();
      return sortAsc ? aDate - bDate : bDate - aDate;
    }
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
    <div className={`min-h-screen flex flex-col ${theme === "light" ? "bg-gradient-to-br from-blue-100 to-teal-100" : "bg-gradient-to-br from-gray-900 to-gray-800"}`}>
      <Header theme={theme} onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")} />
      <Sidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} theme={theme} />
      <main className="flex-1 flex justify-center items-start pt-8">
        <JiraTable
          data={sortedData}
          error={error}
          columns={columns}
          sortKey={sortKey}
          sortAsc={sortAsc}
          onSort={handleSort}
          theme={theme}
          onLogHover={setModalIssueId}
        />
        <JiraLogModal
          issueId={modalIssueId}
          onClose={() => setModalIssueId(null)}
          theme={theme}
        />
      </main>
    </div>
  );
};

export default App;