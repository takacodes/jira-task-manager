import { formatDistanceToNow } from 'date-fns';

export const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays > 30) { 
    return <span className="text-gray-500">{formatDistanceToNow(date, { addSuffix: true })}</span>;
  } else if (diffDays > 7) {
    return <span className="text-red-600">{formatDistanceToNow(date, { addSuffix: true })}</span>;
  } else if (diffDays > 5) {
    return <span className="text-yellow-600">{formatDistanceToNow(date, { addSuffix: true })}</span>;
  } else {
    return <span className="text-green-600">{formatDistanceToNow(date, { addSuffix: true })}</span>;
  } 
};

export const formatStatus = (status: string) => {
  const s = status.toLowerCase();
  let color = "text-gray-800";
  let bg = "";
  if (s === "to do") {
    color = "text-blue-700";
    bg = "bg-blue-100";
  } else if (s === "in progress") {
    color = "text-yellow-800";
    bg = "bg-yellow-100";
  } else if (s === "testing") {
    color = "text-purple-800";
    bg = "bg-purple-100";
  } else if (s === "done") {
    color = "text-green-800";
    bg = "bg-green-100";
  }
  return (
    <span className={`font-semibold rounded px-2 py-1 ${color} ${bg}`}>
      {status}
    </span>
  );
};

export const formatSprint = (sprintNames?: string[]) => {
if (Array.isArray(sprintNames) && sprintNames.length > 0) {
    const match = sprintNames[0].match(/^(.+?)\s*(\d+)$/);
    if (match) {
    const prefix = match[1];
    const numbers = sprintNames
        .map(name => {
        const m = name.match(/^.+?\s*(\d+)$/);
        return m ? Number(m[1]) : name;
        })
        .sort((a, b) => (typeof a === "number" && typeof b === "number" ? a - b : 0));
    return (
        <span>
        {prefix} {numbers.join(', ')}
        </span>
    );
    } else {
    return (
        <ul className="list-disc pl-4">
        {sprintNames.map((name, idx) => <li key={idx}>{name}</li>)}
        </ul>
    );
    }
}
return <span>-</span>;
};
