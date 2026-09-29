import React from 'react';
import { useMess } from '../../context/MessContext';
import { Utensils, Search, Users, Wallet, PlusCircle, Globe } from 'lucide-react';

export default function Header() {
  const { customers, searchQuery, setSearchQuery, getCustomerBalance, setActiveTab } = useMess();

  const activeCustomers = customers.filter((c) => c.status === 'active');
  const totalDues = activeCustomers.reduce((sum, c) => {
    const bal = getCustomerBalance(c.id);
    return sum + (bal > 0 ? bal : 0);
  }, 0);

  const formattedDate = new Date().toLocaleDateString('en-AE', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2 sm:gap-4 shadow-sm">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 shrink-0">
          <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h1 className="font-bold text-base sm:text-lg text-slate-900 leading-none tracking-tight flex items-center gap-1.5 sm:gap-2">
            Mess Credit Manager
            <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-semibold">
              UAE AED
            </span>
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
            <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
            3-Digit Log Book • {formattedDate}
          </p>
        </div>
      </div>

      {/* Quick 3-Digit Code Search */}
      <div className="flex-1 max-w-[200px] sm:max-w-xs md:max-w-sm relative order-3 sm:order-2">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search 3-digit ID (001)..."
          className="w-full bg-slate-50 border border-slate-200 focus:border-amber-500 focus:bg-white text-slate-900 text-xs sm:text-sm rounded-xl pl-9 pr-3 py-1.5 sm:py-2 outline-none transition-all placeholder:text-slate-400 shadow-inner"
        />
      </div>

      {/* Dues Summary Badges & Quick Action */}
      <div className="flex items-center gap-2 sm:gap-3 order-2 sm:order-3">
        <div className="hidden md:flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs shadow-inner">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Users className="w-4 h-4 text-blue-600" />
            <span><strong className="text-slate-900">{activeCustomers.length}</strong> Customers</span>
          </div>
          <div className="w-px h-4 bg-slate-300" />
          <div className="flex items-center gap-1.5 text-slate-700">
            <Wallet className="w-4 h-4 text-amber-600" />
            <span>Pending Dues: <strong className="text-amber-700 font-mono">AED {totalDues.toLocaleString()}</strong></span>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('daily-entry')}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all active:scale-95 touch-manipulation"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden xs:inline">Daily Log Entry</span>
        </button>
      </div>
    </header>
  );
}
