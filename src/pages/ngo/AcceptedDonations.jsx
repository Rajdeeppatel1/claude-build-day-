import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import DataTable from '../../components/UI/DataTable';
import StatusTimeline from '../../components/UI/StatusTimeline';
import Modal from '../../components/UI/Modal';
import { formatDate, timeAgo, STATUS_CONFIG } from '../../utils/helpers';
import { Truck, Check, ChevronRight } from 'lucide-react';

export default function AcceptedDonations() {
  const { user } = useAuth();
  const { getDonationsByNGO, updateDonationStatus } = useData();
  const { addToast } = useNotifications();
  const [myDonations, setMyDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    if (user) {
      setMyDonations(getDonationsByNGO(user.id));
    }
  }, [user, getDonationsByNGO]);

  const activeDonations = myDonations.filter(d => 
    ['accepted', 'pickup_scheduled', 'collected'].includes(d.status)
  ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  const completedDonations = myDonations.filter(d => d.status === 'delivered')
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const handleUpdateStatus = (donationId, newStatus) => {
    updateDonationStatus(donationId, newStatus);
    addToast({
      type: 'success',
      title: 'Status Updated',
      message: `Donation marked as ${newStatus.replace('_', ' ')}. Donor notified.`,
    });
    setMyDonations(getDonationsByNGO(user.id));
    setSelectedDonation(null);
  };

  const getNextStatusAction = (status) => {
    switch (status) {
      case 'accepted': return { next: 'pickup_scheduled', label: 'Schedule Pickup' };
      case 'pickup_scheduled': return { next: 'collected', label: 'Mark Collected' };
      case 'collected': return { next: 'delivered', label: 'Mark Delivered' };
      default: return null;
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>My Pickups</h1>
        <p>Manage your accepted donations and update their status.</p>
      </div>

      <div className="two-col-layout" style={{ marginBottom: '32px' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 16px 0' }}>Active Tasks</h3>
          
          {activeDonations.length === 0 ? (
            <div className="glass-card empty-state">
              <div className="empty-state-icon">
                <Check size={32} />
              </div>
              <h3>All caught up!</h3>
              <p>You have no active pickups. Check the Available Donations page to find more food to rescue.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {activeDonations.map(donation => {
                const action = getNextStatusAction(donation.status);
                return (
                  <div key={donation.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                      <div style={{ flex: '1', minWidth: '250px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{donation.foodType}</h4>
                          <span className={`badge ${STATUS_CONFIG[donation.status].badge}`}>
                            {STATUS_CONFIG[donation.status].label}
                          </span>
                        </div>
                        <p style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                          <strong>{donation.quantity}</strong> from {donation.donorOrg}
                        </p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                          Pickup: {donation.pickupLocation} ({donation.area})
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px', alignItems: 'flex-end' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--color-rose)' }}>
                          Expires: {timeAgo(donation.expiryTime)}
                        </div>
                        {action && (
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleUpdateStatus(donation.id, action.next)}
                          >
                            {action.label} <ChevronRight size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ background: 'var(--color-bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                      <StatusTimeline currentStatus={donation.status} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '1.2rem', margin: '0 0 16px 0' }}>Completed Deliveries</h3>
        <DataTable 
          columns={[
            { header: 'Date', accessor: 'updatedAt', render: row => formatDate(row.updatedAt) },
            { header: 'Food Type', accessor: 'foodType', render: row => <strong>{row.foodType}</strong> },
            { header: 'Quantity', accessor: 'quantity' },
            { header: 'Donor', accessor: 'donorOrg' },
            { header: 'Status', accessor: 'status', render: row => <span className="badge badge-green">Delivered</span> }
          ]}
          data={completedDonations}
          emptyMessage="You haven't completed any deliveries yet."
        />
      </div>
    </div>
  );
}
