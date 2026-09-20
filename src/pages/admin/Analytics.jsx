import { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { getMonthlyStats, getFoodTypeStats, getAreaStats, getStatusStats } from '../../utils/helpers';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement,
  Title, Tooltip, Legend, Filler
);

// Chart Theme Config
const themeColorPrimary = '#00d4aa';
const themeColorSecondary = '#7c5cfc';
const themeColorAmber = '#ffb547';
const themeColorRose = '#ff6b8a';
const themeColorBlue = '#3b82f6';
const textColor = '#f1f5f9';
const gridColor = 'rgba(148, 163, 184, 0.1)';

const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  color: textColor,
  plugins: {
    legend: { labels: { color: textColor } },
  },
  scales: {
    x: { grid: { color: gridColor }, ticks: { color: textColor } },
    y: { grid: { color: gridColor }, ticks: { color: textColor } }
  }
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  color: textColor,
  plugins: {
    legend: { position: 'right', labels: { color: textColor } },
  }
};

export default function Analytics() {
  const { getDonations } = useData();
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    setDonations(getDonations());
  }, [getDonations]);

  // Data processing
  const monthlyData = getMonthlyStats(donations);
  const foodTypeData = getFoodTypeStats(donations);
  const areaData = getAreaStats(donations);
  const statusData = getStatusStats(donations);

  // Chart Data Configurations
  const lineChartData = {
    labels: Object.keys(monthlyData).sort(),
    datasets: [{
      label: 'Donations Over Time',
      data: Object.keys(monthlyData).sort().map(k => monthlyData[k]),
      borderColor: themeColorPrimary,
      backgroundColor: 'rgba(0, 212, 170, 0.2)',
      fill: true,
      tension: 0.4,
    }]
  };

  const doughnutChartData = {
    labels: Object.keys(foodTypeData),
    datasets: [{
      data: Object.values(foodTypeData),
      backgroundColor: [themeColorPrimary, themeColorSecondary, themeColorAmber, themeColorRose, themeColorBlue, '#22c55e', '#a855f7'],
      borderWidth: 0,
    }]
  };

  const barChartData = {
    labels: Object.keys(areaData).sort((a,b) => areaData[b] - areaData[a]).slice(0, 7), // Top 7 areas
    datasets: [{
      label: 'Donations by Area',
      data: Object.keys(areaData).sort((a,b) => areaData[b] - areaData[a]).slice(0, 7).map(k => areaData[k]),
      backgroundColor: themeColorSecondary,
      borderRadius: 4,
    }]
  };

  const pieChartData = {
    labels: ['Delivered', 'Pending/Active', 'Rejected/Expired'],
    datasets: [{
      data: [statusData.delivered, statusData.pending + statusData.active, statusData.rejected],
      backgroundColor: ['#22c55e', themeColorAmber, themeColorRose],
      borderWidth: 0,
    }]
  };

  return (
    <div>
      <div className="page-header">
        <h1>Analytics Dashboard</h1>
        <p>Insights and metrics for the AnnaSetu platform.</p>
      </div>

      <div className="charts-grid fade-in">
        <div className="chart-container">
          <h3>Donation Trends</h3>
          <div style={{ height: '300px' }}>
            <Line options={commonOptions} data={lineChartData} />
          </div>
        </div>
        
        <div className="chart-container" style={{ animationDelay: '0.1s' }}>
          <h3>Top Areas in Bhopal</h3>
          <div style={{ height: '300px' }}>
            <Bar options={commonOptions} data={barChartData} />
          </div>
        </div>

        <div className="chart-container" style={{ animationDelay: '0.2s' }}>
          <h3>Food Category Distribution</h3>
          <div style={{ height: '300px' }}>
            <Doughnut options={pieOptions} data={doughnutChartData} />
          </div>
        </div>
        
        <div className="chart-container" style={{ animationDelay: '0.3s' }}>
          <h3>Overall Success Rate</h3>
          <div style={{ height: '300px' }}>
            <Pie options={pieOptions} data={pieChartData} />
          </div>
        </div>
      </div>
    </div>
  );
}
