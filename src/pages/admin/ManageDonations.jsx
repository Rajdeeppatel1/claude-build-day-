import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/UI/DataTable';
import { formatDate, STATUS_CONFIG } from '../../utils/helpers';
import { Filter } from 'lucide-react';

export default function ManageDonations() {
  const { getDonations } = useData();
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setDonations(getDonations());
  }, [getDonations]);

  const filteredDonations = donations.filter(d => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['pending', 'accepted', 'pickup_scheduled', 'collected'].includes(d.status);
    if (filter === 'completed') return d.status === 'delivered';
    return d.status === filter;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const columns = [
    {
      header: 'Date',
      accessor: 'createdAt',
      render: (row) => formatDate(row.createdAt),
      style: { width: '120px' }
    },
    {
      header: 'Details',
      accessor: 'details',
      render: (row) => (
        <div>
          <div style={{ fontWeight: '600' }}>{row.foodType}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{row.quantity}</div>
        </div>
      )
    },
    {
      header: 'Donor',
      accessor: 'donorOrg',
      render: (row) => (
        <div>
          <div>{row.donorOrg}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{row.area}</div>
        </div>
      )
    },
    {
      header: 'Assigned NGO',
      accessor: 'ngoName',
      render: (row) => row.ngoName || <span style={{ color: 'var(--color-text-muted)' }}>Unassigned</span>
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (row) => {
        const config = STATUS_CONFIG[row.status] || STATUS_CONFIG.pending;
        return <span className={`badge ${config.badge}`}>{config.label}</span>;
      }
    }
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Manage Donations</h1>
        <p>Monitor all food donations across the platform.</p>
      </div>

      <div className="filter-bar fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)' }}>
          <Filter size={18} /> Filters:
        </div>
        <div className="filter-tabs">
          <button 
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            Active
          </button>
          <button 
            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Delivered
          </button>
          <button 
            className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            Rejected/Expired
          </button>
        </div>
      </div>

      <DataTable 
        columns={columns} 
        data={filteredDonations} 
        emptyMessage="No donations found matching this filter."
      />
    </div>
  );
}
