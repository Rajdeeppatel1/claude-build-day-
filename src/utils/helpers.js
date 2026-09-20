export function formatDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(isoString) {
  if (!isoString) return '';
  const now = new Date();
  const date = new Date(isoString);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return formatDate(isoString);
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
}

export function isExpired(expiryTime) {
  return new Date(expiryTime) < new Date();
}

export function getStatusSteps() {
  return [
    { key: 'pending', label: 'Posted' },
    { key: 'accepted', label: 'Accepted' },
    { key: 'pickup_scheduled', label: 'Pickup Scheduled' },
    { key: 'collected', label: 'Collected' },
    { key: 'delivered', label: 'Delivered' },
  ];
}

export function getStatusIndex(status) {
  const order = ['pending', 'accepted', 'pickup_scheduled', 'collected', 'delivered'];
  return order.indexOf(status);
}

export function getMonthlyStats(donations) {
  const months = {};
  donations.forEach((d) => {
    const date = new Date(d.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    months[key] = (months[key] || 0) + 1;
  });
  return months;
}

export function getFoodTypeStats(donations) {
  const types = {};
  donations.forEach((d) => {
    types[d.foodType] = (types[d.foodType] || 0) + 1;
  });
  return types;
}

export function getAreaStats(donations) {
  const areas = {};
  donations.forEach((d) => {
    areas[d.area] = (areas[d.area] || 0) + 1;
  });
  return areas;
}

export function getStatusStats(donations) {
  const stats = { delivered: 0, pending: 0, rejected: 0, active: 0 };
  donations.forEach((d) => {
    if (d.status === 'delivered') stats.delivered++;
    else if (d.status === 'pending') stats.pending++;
    else if (d.status === 'rejected' || d.status === 'expired') stats.rejected++;
    else stats.active++;
  });
  return stats;
}

export const STATUS_CONFIG = {
  pending: { label: 'Pending', badge: 'badge-amber' },
  accepted: { label: 'Accepted', badge: 'badge-blue' },
  pickup_scheduled: { label: 'Scheduled', badge: 'badge-violet' },
  collected: { label: 'Collected', badge: 'badge-teal' },
  delivered: { label: 'Delivered', badge: 'badge-green' },
  rejected: { label: 'Rejected', badge: 'badge-red' },
  expired: { label: 'Expired', badge: 'badge-rose' },
};
