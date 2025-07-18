import React, { useEffect } from 'react';
import { jiraMarkupToHtml } from '../utils/formatter';

interface JiraLogModalProps {
  issueId: string | null;
  onClose: () => void;
  theme: 'light' | 'dark';
}

interface JiraLogItem {
  field: string;
  fromString?: string;
  toString?: string;
}

interface JiraLogEntry {
  author: { displayName: string };
  created: string;
  items: JiraLogItem[];
}

interface JiraLogData {
  updated: string;
  summary: string;
  changelog: {
    histories: JiraLogEntry[];
  };
  description?: string;
}

const JiraLogModal: React.FC<JiraLogModalProps> = ({ issueId, onClose, theme }) => {
  const [loading, setLoading] = React.useState(false);
  const [log, setLog] = React.useState<JiraLogData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (!issueId) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3001/api/jira-issue/${issueId}`)
      .then(res => res.json())
      .then(data => {
        setLog(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch log');
        setLoading(false);
      });
  }, [issueId]);

  if (!issueId) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40`}>
      <div className={`rounded-xl shadow-xl p-8 max-w-lg w-full ${theme === 'light' ? 'bg-white text-gray-800' : 'bg-gray-900 text-gray-100'}`}>
        <button
          className={`absolute top-4 right-6 text-2xl font-bold ${theme === 'light' ? 'text-gray-700' : 'text-gray-200'}`}
          onClick={onClose}
          aria-label="Close modal"
        >✖</button>
        <h2 className="text-xl font-bold mb-4">Jira Log for {issueId}</h2>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {log && (
          <div>
            <div className="mb-2 font-semibold">Last Updated: {new Date(log.updated).toLocaleString()}</div>
            <div className="mb-2 font-semibold">Summary:</div>
            <div className="mb-2" dangerouslySetInnerHTML={{ __html: jiraMarkupToHtml(log.summary) }} />
            {log.description && (
              <>
                <div className="mb-2 font-semibold">Description:</div>
                <div className="mb-2" dangerouslySetInnerHTML={{ __html: jiraMarkupToHtml(log.description) }} />
              </>
            )}
            <div className="mb-2 font-semibold">Changelog:</div>
            <ul className="max-h-64 overflow-y-auto text-sm">
              {log.changelog && log.changelog.histories && log.changelog.histories.length > 0 ? (
                log.changelog.histories.slice(-5).reverse().map((entry, idx) => (
                  <li key={idx} className="mb-2 p-2 rounded bg-blue-50 dark:bg-gray-800">
                    <div className="font-semibold">{entry.author.displayName} ({new Date(entry.created).toLocaleString()})</div>
                    <ul>
                      {entry.items.map((item, i) => (
                        <li key={i}>
                          <span className="font-bold">{item.field}:</span> <span dangerouslySetInnerHTML={{ __html: jiraMarkupToHtml(item.fromString || '') }} /> → <span dangerouslySetInnerHTML={{ __html: jiraMarkupToHtml(item.toString || '') }} />
                        </li>
                      ))}
                    </ul>
                  </li>
                ))
              ) : (
                <li>No changelog found.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default JiraLogModal;
