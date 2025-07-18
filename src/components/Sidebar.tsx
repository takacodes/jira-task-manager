import React from 'react';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
  theme: 'light' | 'dark';
}

const Sidebar: React.FC<SidebarProps> = ({ open, onToggle, theme }) => {
  // Sidebar width: 256px (w-64), 10% of viewport is about 10vw
  const openWidth = '256px';
  return (
    <>
      {/* Sidebar: fully hidden when closed */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 ${theme === 'light' ? 'bg-blue-100' : 'bg-gray-800'} shadow-lg`}
        style={{ width: open ? openWidth : '0px', overflow: 'hidden' }}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-300 dark:border-gray-700" style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
          <span className={`font-bold text-lg ${theme === 'light' ? 'text-gray-800' : 'text-gray-100'}`}>Menu</span>
          <button
            onClick={onToggle}
            aria-label="Close sidebar"
          className={`text-xl rounded-full transition shadow border ${theme === 'light' ? 'bg-white text-gray-800 border-gray-300 hover:bg-blue-200' : 'bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600'}`}
          style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ✖
          </button>
        </div>
        <nav className="mt-6 px-6" style={{ opacity: open ? 1 : 0, pointerEvents: open ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
          <ul className="space-y-4">
            <li><a href="#" className="hover:underline">Dashboard</a></li>
            <li><a href="#" className="hover:underline">Tasks</a></li>
            <li><a href="#" className="hover:underline">Settings</a></li>
          </ul>
        </nav>
      </aside>
      {/* Center open button when sidebar is closed */}
      {!open && (
        <button
          onClick={onToggle}
          aria-label="Open sidebar"
          className={`fixed top-1/2 left-0 -translate-y-1/2 rounded-r-lg px-2 py-4 shadow border transition z-50 ${theme === 'light' ? 'bg-blue-200 text-gray-800 border-gray-300 hover:bg-blue-300' : 'bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600'}`}
          style={{ width: '32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'auto' }}
        >
          ☰
        </button>
      )}
    </>
  );
};

export default Sidebar;
