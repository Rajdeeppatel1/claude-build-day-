import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icon in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map center updates when props change
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapView({ center, zoom = 12, markers = [], height = '300px' }) {
  return (
    <div className="map-container" style={{ height }}>
      <MapContainer 
        center={center || [23.2599, 77.4126]} // Default to Bhopal
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={center || [23.2599, 77.4126]} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, idx) => (
          <Marker 
            key={marker.id || idx} 
            position={[marker.lat, marker.lng]}
            icon={marker.color === 'green' ? customIcon : new L.Icon.Default()}
          >
            {marker.popup && (
              <Popup>
                <div style={{ padding: '4px' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>{marker.popup.title}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{marker.popup.description}</p>
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
