import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { getStatusStats, timeAgo } from '../../utils/helpers';
import StatCard from '../../components/UI/StatCard';
import { Users, Building, Package, CheckCircle, Activity, AlertTriangle } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { getUsers, getDonations } = useData();
  
  const [stats, setStats] = useState({
    donors: 0,
    ngos: 0,
    totalDonations: 0,
    delivered: 0,
    successRate: 0,
    pendingVerifications: 0
  });

  const [recentDonations, setRecentDonations] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  useEffect(() => {
    const users = getUsers();
    const donations = getDonations();
    
    const donors = users.filter(u => u.role === 'donor').length;
    const ngos = users.filter(u => u.role === 'ngo').length;
    const pendingVerifications = users.filter(u => u.role === 'ngo' && !u.verified).length;
    
    const donationStats = getStatusStats(donations);
    const delivered = donationStats.delivered;
    const totalDonations = donations.length;
    const completed = delivered + donationStats.rejected;
    const successRate = completed > 0 ? Math.round((delivered / completed) * 100) : 0;
    
    setStats({
      donors,
      ngos,
      totalDonations,
      delivered,
      successRate,
      pendingVerifications
    });

    setRecentDonations(donations.slice(0, 5));
    
    const alerts = [];
    if (pendingVerifications > 0) {
      alerts.push({ id: 1, type: 'warning', message: `${pendingVerifications} NGO(s) pending verification.` });
    }
    const expiredCount = donations.filter(d => d.status === 'expired').length;
    if (expiredCount > 0) {
      alerts.push({ id: 2, type: 'error', message: `${expiredCount} donations expired without pickup recently.` });
    }
    setSystemAlerts(alerts);
    
  }, [getUsers, getDonations]);

  return (
    <div>
      <div className="page-header">
        <h1>Admin Dashboard</h1>
        <p>System overview for the AnnaSetu platform in Bhopal.</p>
      </div>

      {systemAlerts.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
          {systemAlerts.map(alert => (
            <div key={alert.id} className={`glass-card`} style={{ 
              padding: '12px 16px', 
              borderLeft: `4px solid ${alert.type === 'warning' ? 'var(--color-amber)' : 'var(--color-red)'}`,
              display: 'flex', alignItems: 'center', gap: '12px'
            }}>
              <AlertTriangle size={18} color={alert.type === 'warning' ? 'var(--color-amber)' : 'var(--color-red)'} />
              <span style={{ fontSize: '0.9rem' }}>{alert.message}</span>
            </div>
          ))}
        </div>
      )}

      <div className="stats-grid">
        <StatCard 
          title="Total Users" 
          value={stats.donors + stats.ngos} 
          icon={Users} 
          color="blue"
        />
        <StatCard 
          title="Active NGOs" 
          value={stats.ngos} 
          icon={Building} 
          color="violet"
        />
        <StatCard 
          title="Total Donations" 
          value={stats.totalDonations} 
          icon={Package} 
          color="teal"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard 
          title="Success Rate" 
          value={`${stats.successRate}%`} 
          icon={CheckCircle} 
          color="green"
        />
      </div>

      <div className="two-col-layout">
        <div>
          <div className="page-header-actions" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Recent Donations</h3>
            <Link to="/admin/donations" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          
          <div className="glass-card" style={{ padding: 0 }}>
            {recentDonations.map((donation, idx) => (
              <div key={donation.id} style={{ 
                padding: '16px', 
                borderBottom: idx === recentDonations.length - 1 ? 'none' : '1px solid var(--color-border)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontWeight: '600' }}>{donation.foodType}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                    {donation.donorOrg} • {timeAgo(donation.createdAt)}
                  </div>
                </div>
                <div className={`badge ${
                  donation.status === 'delivered' ? 'badge-green' : 
                  donation.status === 'pending' ? 'badge-amber' : 
                  donation.status === 'rejected' ? 'badge-red' : 'badge-blue'
                }`}>
                  {donation.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 16px 0' }}>Quick Actions</h3>
          <div className="quick-actions">
            <Link to="/admin/users" className="quick-action">
              <div className="stat-icon violet"><Building size={20} /></div>
              <div>
                <div style={{ fontWeight: '600' }}>Verify NGOs</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>Review pending applications</div>
              </div>
            </Link>
            <Link to="/admin/analytics" className="quick-action">
              <div className="stat-icon blue"><Activity size={20} /></div>
              <div>
                <div style={{ fontWeight: '600' }}>View Analytics</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>See platform performance</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
