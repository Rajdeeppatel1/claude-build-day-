export default function StatCard({ title, value, icon: Icon, color = "teal", trend }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className={`stat-icon ${color}`}>
        {Icon && <Icon size={24} />}
      </div>
      <div className="stat-info">
        <div className="stat-label">{title}</div>
        <div className="stat-value">{value}</div>
        {trend && (
          <div className={`stat-change ${trend.isPositive ? 'positive' : 'negative'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last month
          </div>
        )}
      </div>
    </div>
  );
}
