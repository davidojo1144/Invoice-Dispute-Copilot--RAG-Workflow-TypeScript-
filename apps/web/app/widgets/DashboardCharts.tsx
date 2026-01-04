'use client';

import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

export default function DashboardCharts({
  statusCounts,
  disputesByDay
}: {
  statusCounts: Record<string, number>;
  disputesByDay: Record<string, number>;
}) {
  const donutData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Invoices',
        data: Object.values(statusCounts),
        backgroundColor: ['#4c8bf5', '#2ecc71', '#e74c3c', '#f1c40f']
      }
    ]
  };
  const lineLabels = Object.keys(disputesByDay).sort();
  const lineData = {
    labels: lineLabels,
    datasets: [
      {
        label: 'Disputes per day',
        data: lineLabels.map((k) => disputesByDay[k]),
        borderColor: '#4c8bf5',
        backgroundColor: 'rgba(76,139,245,0.2)',
        tension: 0.3
      }
    ]
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="max-w-sm">
        <Doughnut data={donutData} />
      </div>
      <div className="w-full">
        <Line data={lineData} />
      </div>
    </div>
  );
}
