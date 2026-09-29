import React from 'react';
import { useMess } from '../../context/MessContext';
import {
  LayoutDashboard,
  Users,
  Utensils,
  Wallet,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function DashboardView() {
  const { customers, dailyLogs, payments, getCustomerBalance, todayDate, setActiveTab } = useMess();

  const activeCustomers = customers.filter((c) => c.status === 'active');

  const todayLogs = dailyLogs.filter((l) => l.date === todayDate);
  const todayMealsCount = todayLogs.reduce((sum, l) => {
    return sum + l.items.reduce((s, i) => s + i.qty, 0);
  }, 0);
  const todayRevenue = todayLogs.reduce((sum, l) => sum + l.totalAmount, 0);

  const totalOutstandingDues = activeCustomers.reduce((sum, c) => {
    const bal = getCustomerBalance(c.id);
    return sum + (bal > 0 ? bal : 0);
  }, 0);

  const customersWithDues = activeCustomers
    .map((c) => ({ ...c, balance: getCustomerBalance(c.id) }))
    .filter((c) => c.balance > 0)
    .sort((a, b) => b.balance - a.balance);

  const past7Days = [];
  const todayObj = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(todayObj);
    d.setDate(d.getDate() - i);
    past7Days.push(d.toISOString().split('T')[0]);
  }

  const consumptionPerDay = past7Days.map((dateStr) => {
    return dailyLogs
      .filter((l) => l.date === dateStr)
      .reduce((sum, l) => sum + l.totalAmount, 0);
  });

  const paymentsPerDay = past7Days.map((dateStr) => {
    return payments
      .filter((p) => p.date === dateStr)
      .reduce((sum, p) => sum + p.amount, 0);
  });

  const chartData = {
    labels: past7Days.map((d) => d.slice(5)),
    datasets: [
      {
        label: 'Meal Consumption (AED)',
        data: consumptionPerDay,
        backgroundColor: '#f59e0b',
        borderColor: '#d97706',
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label: 'Payments Received (AED)',
        data: paymentsPerDay,
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#334155', font: { size: 12, weight: 'bold' } },
      },
    },
    scales: {
      x: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
      y: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
    },
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Mess Dashboard & Dues (UAE)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Real-time daily log overview, credit analytics & top pending dues in AED
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('daily-entry')}
          className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all"
        >
          Go to Daily Log Entry
        </button>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Total Outstanding Dues</span>
            <Wallet className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-700">
            AED {totalOutstandingDues.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">Across {customersWithDues.length} customers</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Today's Meals Logged</span>
            <Utensils className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-blue-600">
            {todayMealsCount} <span className="text-xs text-slate-500 font-normal">items</span>
          </p>
          <p className="text-[11px] text-slate-500">Recorded on {todayDate}</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Today's Credit Value</span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-600">
            AED {todayRevenue.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500">Logged tonight</p>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">Active Customers</span>
            <Users className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-600">
            {activeCustomers.length}
          </p>
          <p className="text-[11px] text-slate-500">With 3-digit IDs</p>
        </div>
      </div>

      {/* Chart & Top Dues Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-900 text-base">Weekly Credit Consumption vs Payments (AED)</h3>
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="lg:col-span-5 bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Highest Pending Dues
            </h3>
            <button
              onClick={() => setActiveTab('customers')}
              className="text-xs text-amber-700 hover:underline flex items-center gap-1 font-bold"
            >
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {customersWithDues.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No outstanding dues! All clear.</p>
            ) : (
              customersWithDues.slice(0, 5).map((customer) => (
                <div
                  key={customer.id}
                  className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-inner"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono font-bold text-amber-800 bg-white border border-slate-200 px-2 py-1 rounded-lg shadow-xs">
                      #{customer.id}
                    </span>
                    <div>
                      <p className="font-bold text-slate-900">{customer.name}</p>
                      <p className="text-[11px] text-slate-500">{customer.roomNo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-rose-600 text-sm">
                      AED {customer.balance.toLocaleString()}
                    </p>
                    <span className="text-[10px] text-slate-500 font-medium">Outstanding</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
