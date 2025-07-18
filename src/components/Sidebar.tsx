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
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 shadow-lg`}
        style={{
          width: open ? openWidth : '0px',
          overflow: 'hidden',
          background: theme === 'light'
            ? 'linear-gradient(135deg, #f8fafc 0%, #cfe7fa 60%, #a8edea 100%)'
            : 'linear-gradient(135deg, #23272f 0%, #2d3748 100%)',
          boxShadow: '0 2px 16px 0 rgba(0,0,0,0.04)',
          borderRight: theme === 'light' ? '1px solid #e0e7ef' : '1px solid #2d3748',
        }}
        aria-label="Sidebar"
      >
        <div
          className="flex items-center justify-between px-8 py-6"
          style={{
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
            transition: 'opacity 0.3s',
            fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
          }}
        >
          <span className={`font-extrabold text-xl tracking-wide ${theme === 'light' ? 'text-gray-700' : 'text-gray-100'}`}>Menu</span>
          <button
            onClick={onToggle}
            aria-label="Close sidebar"
            className={`text-xl rounded-full transition shadow border ${theme === 'light' ? 'bg-white text-gray-800 border-gray-300 hover:bg-blue-100' : 'bg-gray-700 text-gray-100 border-gray-600 hover:bg-gray-600'}`}
            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
          >
            ✖
          </button>
        </div>
        <nav
          className="mt-8 px-4"
          style={{
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
            transition: 'opacity 0.3s',
          }}
        >
          <ul className="space-y-4">
            <li><a href="#" className={`block rounded-lg px-4 py-2 font-semibold text-base transition ${theme === 'light' ? 'bg-white/60 text-blue-700 hover:bg-blue-100' : 'bg-gray-700/60 text-blue-200 hover:bg-gray-700/80'}`}>Dashboard</a></li>
            <li><a href="#" className={`block rounded-lg px-4 py-2 font-semibold text-base transition ${theme === 'light' ? 'bg-white/60 text-blue-700 hover:bg-blue-100' : 'bg-gray-700/60 text-blue-200 hover:bg-gray-700/80'}`}>Tasks</a></li>
            <li><a href="#" className={`block rounded-lg px-4 py-2 font-semibold text-base transition ${theme === 'light' ? 'bg-white/60 text-blue-700 hover:bg-blue-100' : 'bg-gray-700/60 text-blue-200 hover:bg-gray-700/80'}`}>Settings</a></li>
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
