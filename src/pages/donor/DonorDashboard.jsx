import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getStatusStats, timeAgo } from '../../utils/helpers';
import StatCard from '../../components/UI/StatCard';
import StatusTimeline from '../../components/UI/StatusTimeline';
import { Package, Clock, CheckCircle, PlusCircle, AlertCircle } from 'lucide-react';

export default function DonorDashboard() {
  const { user } = useAuth();
  const { getDonationsByDonor } = useData();
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({ delivered: 0, pending: 0, active: 0 });

  useEffect(() => {
    if (user) {
      const userDonations = getDonationsByDonor(user.id);
      setDonations(userDonations);
      setStats(getStatusStats(userDonations));
    }
  }, [user, getDonationsByDonor]);

  const activeDonations = donations
    .filter(d => ['pending', 'accepted', 'pickup_scheduled', 'collected'].includes(d.status))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  const recentHistory = donations
    .filter(d => ['delivered', 'rejected', 'expired'].includes(d.status))
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div>
      <div className="page-header">
        <h1>Welcome, {user.name}</h1>
        <p>Manage your food donations and track their impact across Bhopal.</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Total Meals Donated" 
          value={donations.length * 20} // Estimate
          icon={CheckCircle} 
          color="teal"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard 
          title="Active Donations" 
          value={stats.active + stats.pending} 
          icon={Package} 
          color="amber"
        />
        <StatCard 
          title="Successful Deliveries" 
          value={stats.delivered} 
          icon={Clock} 
          color="blue"
        />
      </div>

      <div className="two-col-layout">
        <div>
          <div className="page-header-actions" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Active Donations</h3>
            <Link to="/donor/create" className="btn btn-primary btn-sm">
              <PlusCircle size={16} /> New Donation
            </Link>
          </div>

          {activeDonations.length === 0 ? (
            <div className="glass-card empty-state">
              <div className="empty-state-icon">
                <Package size={32} />
              </div>
              <h3>No Active Donations</h3>
              <p>You don't have any ongoing donations. Create one to help reduce food waste.</p>
              <Link to="/donor/create" className="btn btn-primary" style={{ marginTop: '16px' }}>
                Donate Now
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeDonations.map(donation => (
                <div key={donation.id} className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{donation.foodType}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                        {donation.quantity} • {timeAgo(donation.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <StatusTimeline currentStatus={donation.status} />
                  
                  {donation.ngoName && (
                    <div style={{ 
                      marginTop: '16px', 
                      padding: '12px', 
                      background: 'rgba(148, 163, 184, 0.05)', 
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.85rem'
                    }}>
                      Accepted by: <strong style={{ color: 'var(--color-text-primary)' }}>{donation.ngoName}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 16px 0' }}>Recent Activity</h3>
          <div className="glass-card" style={{ padding: '0' }}>
            {recentHistory.length === 0 ? (
              <div className="empty-state" style={{ padding: '32px 16px' }}>
                <p>No recent activity.</p>
              </div>
            ) : (
              <div className="activity-feed">
                {recentHistory.map((item, idx) => (
                  <div key={item.id} className="activity-item" style={{ 
                    padding: '16px',
                    borderBottom: idx === recentHistory.length - 1 ? 'none' : '1px solid var(--color-border)'
                  }}>
                    <div className={`activity-icon ${
                      item.status === 'delivered' ? 'badge-green' : 
                      item.status === 'rejected' ? 'badge-red' : 'badge-rose'
                    }`}>
                      {item.status === 'delivered' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    </div>
                    <div className="activity-content">
                      <div className="activity-text">
                        Your donation of <strong>{item.quantity} {item.foodType}</strong> was {item.status}.
                      </div>
                      <div className="activity-time">{timeAgo(item.updatedAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div style={{ marginTop: '24px' }}>
            <Link to="/donor/history" className="btn btn-secondary" style={{ width: '100%' }}>
              View All History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
