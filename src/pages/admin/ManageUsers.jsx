import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import DataTable from '../../components/UI/DataTable';
import { formatDate } from '../../utils/helpers';
import { Shield, ShieldAlert, Trash2 } from 'lucide-react';

export default function ManageUsers() {
  const { getUsers, verifyUser, deleteUser } = useData();
  const { addToast } = useNotifications();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setUsers(getUsers().filter(u => u.role !== 'admin'));
  }, [getUsers]);

  const filteredUsers = users.filter(u => {
    if (filter === 'all') return true;
    if (filter === 'pending') return u.role === 'ngo' && !u.verified;
    return u.role === filter;
  });

  const handleVerify = (userId, name) => {
    verifyUser(userId);
    setUsers(getUsers().filter(u => u.role !== 'admin'));
    addToast({
      type: 'success',
      title: 'NGO Verified',
      message: `${name} has been verified and can now accept donations.`,
    });
  };

  const handleDelete = (userId, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      deleteUser(userId);
      setUsers(getUsers().filter(u => u.role !== 'admin'));
      addToast({
        type: 'info',
        title: 'User Deleted',
        message: `${name} has been removed from the system.`,
      });
    }
  };

  const columns = [
    {
      header: 'Name / Organization',
      accessor: 'name',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600' }}>{row.organization || row.name}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{row.email}</div>
        </div>
      )
    },
    {
      header: 'Role',
      accessor: 'role',
      render: (row) => (
        <span className={`badge ${row.role === 'donor' ? 'badge-blue' : 'badge-violet'}`}>
          {row.role.toUpperCase()}
        </span>
      )
    },
    {
      header: 'Area',
      accessor: 'area',
    },
    {
      header: 'Joined',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt)
    },
    {
      header: 'Status',
      accessor: 'verified',
      render: (row) => (
        row.verified ? 
          <span className="badge badge-green">Verified</span> : 
          <span className="badge badge-amber">Pending</span>
      )
    },
    {
      header: 'Actions',
      accessor: 'actions',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          {!row.verified && row.role === 'ngo' && (
            <button 
              className="btn btn-primary btn-sm" 
              onClick={() => handleVerify(row.id, row.organization)}
              title="Verify NGO"
            >
              <Shield size={14} /> Verify
            </button>
          )}
          <button 
            className="btn btn-danger btn-sm" 
            onClick={() => handleDelete(row.id, row.organization || row.name)}
            title="Delete User"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
      style: { width: '150px' }
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Manage Users</h1>
        <p>View, verify, and manage donors and NGOs on the platform.</p>
      </div>

      <div className="filter-bar fade-in">
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Users
          </button>
          <button 
            className={`filter-tab ${filter === 'donor' ? 'active' : ''}`}
            onClick={() => setFilter('donor')}
          >
            Donors
          </button>
          <button 
            className={`filter-tab ${filter === 'ngo' ? 'active' : ''}`}
            onClick={() => setFilter('ngo')}
          >
            NGOs
          </button>
          <button 
            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending Verification
          </button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredUsers} 
        emptyMessage="No users found matching this filter."
      />
    </div>
  );
}
