import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import DataTable from '../../components/UI/DataTable';
import { formatDate, STATUS_CONFIG } from '../../utils/helpers';
import { Filter } from 'lucide-react';

export default function DonationHistory() {
  const { user } = useAuth();
  const { getDonationsByDonor } = useData();
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      setDonations(getDonationsByDonor(user.id));
    }
  }, [user, getDonationsByDonor]);

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
      header: 'Food Type',
      accessor: 'foodType',
      render: (row) => <strong>{row.foodType}</strong>
    },
    {
      header: 'Quantity',
      accessor: 'quantity',
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
        <h1>Donation History</h1>
        <p>A complete record of all your food donations.</p>
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
