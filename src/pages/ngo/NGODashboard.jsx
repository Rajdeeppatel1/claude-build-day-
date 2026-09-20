import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useNotifications } from '../../context/NotificationContext';
import { timeAgo } from '../../utils/helpers';
import StatCard from '../../components/UI/StatCard';
import MapView from '../../components/UI/MapView';
import { Package, Truck, CheckCircle, MapPin, Map } from 'lucide-react';

export default function NGODashboard() {
  const { user } = useAuth();
  const { getDonationsByNGO, getAvailableDonations, updateDonationStatus } = useData();
  const { addToast } = useNotifications();
  const [myDonations, setMyDonations] = useState([]);
  const [availableDonations, setAvailableDonations] = useState([]);

  useEffect(() => {
    if (user) {
      setMyDonations(getDonationsByNGO(user.id));
      
      // Get pending donations in NGO's service areas
      const pending = getAvailableDonations();
      const inArea = pending.filter(d => 
        user.serviceAreas?.includes(d.area) || d.area === user.area
      );
      setAvailableDonations(inArea);
    }
  }, [user, getDonationsByNGO, getAvailableDonations]);

  const activePickups = myDonations.filter(d => 
    ['accepted', 'pickup_scheduled', 'collected'].includes(d.status)
  );

  const completed = myDonations.filter(d => d.status === 'delivered').length;

  const handleAccept = (donation) => {
    updateDonationStatus(donation.id, 'accepted', user.id, user.name);
    addToast({
      type: 'success',
      title: 'Donation Accepted',
      message: `You accepted ${donation.quantity} of ${donation.foodType} from ${donation.donorOrg}.`,
    });
    // Refresh local state
    setMyDonations(getDonationsByNGO(user.id));
    const pending = getAvailableDonations();
    setAvailableDonations(pending.filter(d => user.serviceAreas?.includes(d.area) || d.area === user.area));
  };

  const mapMarkers = availableDonations.map(d => ({
    id: d.id,
    lat: d.lat,
    lng: d.lng,
    color: 'teal',
    popup: { title: d.foodType, description: d.donorOrg }
  }));

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard - {user.organization}</h1>
        <p>Monitor available donations in your area and manage active pickups.</p>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Active Pickups" 
          value={activePickups.length} 
          icon={Truck} 
          color="amber"
        />
        <StatCard 
          title="Available Nearby" 
          value={availableDonations.length} 
          icon={Package} 
          color="teal"
        />
        <StatCard 
          title="Total Delivered" 
          value={completed} 
          icon={CheckCircle} 
          color="green"
        />
      </div>

      <div className="two-col-layout">
        <div>
          <div className="page-header-actions" style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Available in Your Area</h3>
            <Link to="/ngo/available" className="btn btn-secondary btn-sm">
              View All
            </Link>
          </div>

          {availableDonations.length === 0 ? (
            <div className="glass-card empty-state" style={{ padding: '32px' }}>
              <div className="empty-state-icon">
                <MapPin size={32} />
              </div>
              <h4>No Available Donations</h4>
              <p>There are currently no pending donations in your service areas.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {availableDonations.slice(0, 3).map(donation => (
                <div key={donation.id} className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{donation.foodType}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
                        {donation.quantity} • {donation.donorOrg}
                      </p>
                      <div className="badge badge-teal"><MapPin size={12} style={{ marginRight: '4px' }}/> {donation.area}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: '8px' }}>
                        Posted {timeAgo(donation.createdAt)}
                      </div>
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAccept(donation)}
                      >
                        Accept Pickup
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', margin: '0 0 16px 0' }}>Map View</h3>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            <MapView 
              center={mapMarkers.length > 0 ? [mapMarkers[0].lat, mapMarkers[0].lng] : null}
              markers={mapMarkers} 
              height="300px" 
            />
          </div>

          <h3 style={{ fontSize: '1.2rem', margin: '24px 0 16px 0' }}>My Active Pickups</h3>
          {activePickups.length === 0 ? (
            <div className="glass-card empty-state" style={{ padding: '24px' }}>
              <p>No active pickups right now.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activePickups.slice(0, 2).map(donation => (
                <div key={donation.id} className="glass-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600' }}>{donation.foodType}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>From {donation.donorOrg}</div>
                    </div>
                    <span className={`badge ${
                      donation.status === 'accepted' ? 'badge-blue' : 
                      donation.status === 'pickup_scheduled' ? 'badge-violet' : 'badge-teal'
                    }`}>
                      {donation.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
              <Link to="/ngo/accepted" className="btn btn-secondary" style={{ width: '100%', marginTop: '8px' }}>
                Manage Pickups
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
