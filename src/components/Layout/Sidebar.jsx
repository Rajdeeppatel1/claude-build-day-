import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import {
  LayoutDashboard, PlusCircle, History, User, Bell,
  Package, CheckCircle, ClipboardList, Users, BarChart3,
  FileText, LogOut, Leaf
} from 'lucide-react';

const donorLinks = [
  { to: '/donor', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/donor/create', icon: PlusCircle, label: 'New Donation' },
  { to: '/donor/history', icon: History, label: 'My Donations' },
  { to: '/donor/profile', icon: User, label: 'Profile' },
];

const ngoLinks = [
  { to: '/ngo', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/ngo/available', icon: Package, label: 'Available Donations' },
  { to: '/ngo/accepted', icon: CheckCircle, label: 'My Pickups' },
  { to: '/ngo/profile', icon: User, label: 'Profile' },
];

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Manage Users' },
  { to: '/admin/donations', icon: ClipboardList, label: 'Manage Donations' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/reports', icon: FileText, label: 'Reports' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const links =
    user.role === 'donor'
      ? donorLinks
      : user.role === 'ngo'
      ? ngoLinks
      : adminLinks;

  const roleLabel =
    user.role === 'donor'
      ? 'Donor'
      : user.role === 'ngo'
      ? 'NGO Partner'
      : 'Administrator';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Leaf size={22} color="white" />
          </div>
          <div>
            <div className="sidebar-title">AnnaSetu</div>
            <div className="sidebar-subtitle">Bhopal, MP</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-label">
            {user.role === 'admin' ? 'Administration' : 'Navigation'}
          </div>
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/donor' || link.to === '/ngo' || link.to === '/admin'}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{getInitials(user.name)}</div>
            <div>
              <div className="sidebar-user-name">{user.name}</div>
              <div className="sidebar-user-role">{roleLabel}</div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ width: '100%', marginTop: '8px', justifyContent: 'flex-start' }}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
