import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Toast from '../UI/Toast';

export default function DashboardLayout({ title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <Navbar
          title={title}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="page-content fade-in">
          <Outlet />
        </div>
      </main>
      <Toast />
    </div>
  );
}
