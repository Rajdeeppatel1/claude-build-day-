import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { timeAgo } from '../../utils/helpers';
import { MapPin, Clock, Info, Check } from 'lucide-react';
import Modal from '../../components/UI/Modal';

export default function AvailableDonations() {
  const { user } = useAuth();
  const { getAvailableDonations, updateDonationStatus } = useData();
  const { addToast } = useNotifications();
  const [availableDonations, setAvailableDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);

  useEffect(() => {
    if (user) {
      const pending = getAvailableDonations();
      // Show donations in NGO's service areas, or all if no specific areas set
      const relevant = user.serviceAreas && user.serviceAreas.length > 0 
        ? pending.filter(d => user.serviceAreas.includes(d.area))
        : pending;
      setAvailableDonations(relevant.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    }
  }, [user, getAvailableDonations]);

  const handleAccept = (donation) => {
    updateDonationStatus(donation.id, 'accepted', user.id, user.name);
    addToast({
      type: 'success',
      title: 'Donation Accepted!',
      message: `You have accepted ${donation.foodType} from ${donation.donorOrg}. Please coordinate pickup.`,
    });
    setSelectedDonation(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Available Donations</h1>
        <p>Pending food donations from donors in your service areas in Bhopal.</p>
      </div>

      {availableDonations.length === 0 ? (
        <div className="glass-card empty-state">
          <div className="empty-state-icon">
            <MapPin size={32} />
          </div>
          <h3>No donations right now</h3>
          <p>There are currently no available donations in your service areas. We'll notify you when new donations are posted.</p>
        </div>
      ) : (
        <div className="donation-grid">
          {availableDonations.map((donation, idx) => (
            <div key={donation.id} className="donation-card fade-in" style={{ animationDelay: `${idx * 0.05}s` }}>
              <div className="donation-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div className="badge badge-amber">Pending</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                    Posted {timeAgo(donation.createdAt)}
                  </div>
                </div>
                
                <h3 className="donation-card-title">{donation.foodType}</h3>
                
                <div className="donation-card-meta">
                  <div className="donation-card-meta-item">
                    <PackageIcon /> <strong>Quantity:</strong> {donation.quantity}
                  </div>
                  <div className="donation-card-meta-item">
                    <MapPin /> <strong>Area:</strong> {donation.area}
                  </div>
                  <div className="donation-card-meta-item">
                    <Clock /> <strong>Expires:</strong> {timeAgo(donation.expiryTime)}
                  </div>
                </div>
                
                <div style={{ 
                  padding: '12px', 
                  background: 'rgba(148, 163, 184, 0.05)', 
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                  color: 'var(--color-text-secondary)',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', color: 'var(--color-text-primary)' }}>
                    <BuildingIcon /> {donation.donorOrg}
                  </div>
                  <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {donation.pickupLocation}
                  </div>
                </div>
                
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => setSelectedDonation(donation)}
                >
                  View Details & Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      <Modal
        isOpen={!!selectedDonation}
        onClose={() => setSelectedDonation(null)}
        title="Donation Details"
        footer={
          <>
            <button className="btn btn-ghost" onClick={() => setSelectedDonation(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => handleAccept(selectedDonation)}>
              <Check size={16} /> Accept Donation
            </button>
          </>
        }
      >
        {selectedDonation && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0' }}>{selectedDonation.foodType}</h3>
                <span className="badge badge-amber">Pending</span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600' }}>{selectedDonation.quantity}</div>
              </div>
            </div>
            
            <div style={{ background: 'var(--color-bg-primary)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Description</h4>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>{selectedDonation.description}</p>
            </div>
            
            <div className="two-col-layout" style={{ gap: '12px' }}>
              <div style={{ background: 'var(--color-bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Donor</h4>
                <div style={{ fontWeight: '500' }}>{selectedDonation.donorOrg}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Contact: {selectedDonation.donorName}</div>
              </div>
              <div style={{ background: 'var(--color-bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Timing</h4>
                <div style={{ fontSize: '0.85rem' }}>Posted: {timeAgo(selectedDonation.createdAt)}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--color-rose)' }}>Expires: {timeAgo(selectedDonation.expiryTime)}</div>
              </div>
            </div>
            
            <div style={{ background: 'var(--color-bg-primary)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>Pickup Location</h4>
              <div style={{ fontWeight: '500' }}>{selectedDonation.area}, Bhopal</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{selectedDonation.pickupLocation}</div>
            </div>
            
            <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: 'var(--radius-md)', display: 'flex', gap: '12px' }}>
              <Info size={20} color="var(--color-blue)" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                By accepting this donation, you commit to picking it up before the expiry time. The donor will be notified of your acceptance immediately.
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// Simple icons for the cards
function PackageIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>; }
function BuildingIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg>; }
