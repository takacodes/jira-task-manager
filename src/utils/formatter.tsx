// Removes excessive blank lines and multiple spaces from text
export function compactText(text: string): string {
  if (!text) return '';
  // Replace multiple blank lines with a single newline
  let cleaned = text.replace(/([\r\n]+\s*){2,}/g, '\n');
  // Replace multiple spaces with a single space
  cleaned = cleaned.replace(/ +/g, ' ');
  // Trim leading/trailing whitespace
  return cleaned.trim();
}
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

// Converts Jira wiki markup to HTML (basic support)
export function jiraMarkupToHtml(text: string): string {
  if (!text) return '';
  let html = text;
  // Panels: {panel:bgColor=#eae6ff} ... {panel}
  // html = html.replace(/\{panel(:bgColor=([^}]+))?\}/g, (_, __, color) => `<div style="background:${color || '#f4f5f7'};border-radius:8px;padding:12px 16px;margin:8px 0">`);
  html = html.replace(/\{panel(:bgColor=([^}]+))?\}/g, '<div>');
  html = html.replace(/\{panel\}/g, '</div>');
  // Horizontal rules: ----
  html = html.replace(/----+/g, '<hr />');
  // Images: !filename.png|width=123,height=456,alt="desc"!
  // html = html.replace(/!(.+?)\|(.*?)!/g, (_, src, opts) => {
  //   let width = '', height = '', alt = '';
  //   opts.split(',').forEach((opt: string) => {
  //     if (/width=/.test(opt)) width = opt.split('=')[1];
  //     if (/height=/.test(opt)) height = opt.split('=')[1];
  //     if (/alt=/.test(opt)) alt = opt.split('=')[1].replace(/"/g, '');
  //   });
  //   return `<img src="${src}"${width ? ` width=${width}` : ''}${height ? ` height=${height}` : ''}${alt ? ` alt=${alt}` : ''} style="max-width:100%;border-radius:6px;margin:8px 0" />`;
  // });
  // Bold: *text*
  html = html.replace(/\*(.*?)\*/g, '<strong>$1</strong>');
  // Italic: _text_
  html = html.replace(/_(.*?)_/g, '<em>$1</em>');
  // Monospace/code: {{text}}
  html = html.replace(/\{\{(.*?)\}\}/g, '<code>$1</code>');
  // Color: {color:(#[a-zA-Z0-9]+|[a-zA-Z]+)\}(.*?)\{color\}/g, '<span style="color:$1">$2</span>');
  // Links: [text|url]
  html = html.replace(/\[(.+?)\|(.+?)\]/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  // Headings: h1. text, h2. text, etc.
  html = html.replace(/(^|<br \/>)h([1-6])\. (.*?)(?=<br \/>|$)/g, '$1<h$2>$3</h$2>');
  // Unordered lists: * item (support multi-line)
  html = html.replace(/(<br \/>\* .+)+/g, m => {
    return '<ul>' + m.replace(/<br \/>\* (.+?)/g, '<li>$1</li>') + '</ul>';
  });
  // Ordered lists: # item (support multi-line)
  html = html.replace(/(<br \/># .+)+/g, m => {
    return '<ol>' + m.replace(/<br \/># (.+?)/g, '<li>$1</li>') + '</ol>';
  });
  // Line breaks
  html = html.replace(/\n/g, '<br />');
  return html;
}
