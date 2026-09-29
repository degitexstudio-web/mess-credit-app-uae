import React, { useState, useEffect, useRef } from 'react';
import { useMess } from '../../context/MessContext';
import {
  Moon,
  Search,
  CheckCircle2,
  Calendar,
  User,
  Clock,
} from 'lucide-react';

export default function NightEntryView() {
  const {
    customers,
    dailyLogs,
    logDailyEntry,
    todayDate,
    getCustomerBalance,
  } = useMess();

  const [selectedDate, setSelectedDate] = useState(todayDate);

  // Standard meals configuration
  const mealOptions = [
    { id: 'm_breakfast', name: 'Breakfast', icon: '🥣', defaultRate: 10 },
    { id: 'm_lunch', name: 'Lunch', icon: '🍲', defaultRate: 20 },
    { id: 'm_dinner', name: 'Dinner', icon: '🍱', defaultRate: 20 },
    { id: 'm_others', name: 'Others', icon: '☕', defaultRate: 5 },
  ];

  // Auto-detect default meal selection based on current local time
  const getTimeBasedDefaultMeal = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { meals: ['m_breakfast'], amount: '10' };
    } else if (hour >= 12 && hour < 17) {
      return { meals: ['m_lunch'], amount: '20' };
    } else {
      // 5 PM to 5 AM (Night logging time) -> Default to Dinner
      return { meals: ['m_dinner'], amount: '20' };
    }
  };

  const timeDefault = getTimeBasedDefaultMeal();

  // Quick 3-Digit Entry state
  const [codeQuery, setCodeQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedMeals, setSelectedMeals] = useState(timeDefault.meals);
  const [manualTotalAmount, setManualTotalAmount] = useState(timeDefault.amount);
  const [notes, setNotes] = useState('');
  
  const codeInputRef = useRef(null);

  useEffect(() => {
    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }
  }, []);

  const handleCodeChange = (e) => {
    const val = e.target.value;
    setCodeQuery(val);
    
    const padded = val.padStart(3, '0');
    const matched = customers.find(
      (c) => c.id === val || c.id === padded
    );

    if (matched) {
      setSelectedCustomer(matched);
      const existing = dailyLogs.find(
        (l) => l.date === selectedDate && l.customerId === matched.id
      );

      if (existing) {
        setSelectedMeals(existing.items.map((i) => i.itemId));
        setManualTotalAmount(String(existing.totalAmount || 0));
        setNotes(existing.notes || '');
      } else {
        const currentDefault = getTimeBasedDefaultMeal();
        setSelectedMeals(currentDefault.meals);
        setManualTotalAmount(currentDefault.amount);
        setNotes('');
      }
    } else {
      setSelectedCustomer(null);
      const currentDefault = getTimeBasedDefaultMeal();
      setSelectedMeals(currentDefault.meals);
      setManualTotalAmount(currentDefault.amount);
    }
  };

  const toggleMeal = (mealId) => {
    setSelectedMeals((prev) => {
      let updated;
      if (prev.includes(mealId)) {
        updated = prev.filter((id) => id !== mealId);
      } else {
        updated = [...prev, mealId];
      }

      const suggestedTotal = updated.reduce((sum, id) => {
        const option = mealOptions.find((m) => m.id === id);
        return sum + (option ? option.defaultRate : 0);
      }, 0);
      setManualTotalAmount(String(suggestedTotal));

      return updated;
    });
  };

  const handleSaveQuickEntry = (e) => {
    if (e) e.preventDefault();
    if (!selectedCustomer) return;

    if (selectedMeals.length === 0) {
      alert('Please select at least one meal option.');
      return;
    }

    if (!manualTotalAmount || parseFloat(manualTotalAmount) < 0) {
      alert('Please enter a valid total amount in AED.');
      return;
    }

    const itemsPayload = selectedMeals.map((id) => {
      const option = mealOptions.find((m) => m.id === id);
      return {
        itemId: id,
        name: option ? option.name : 'Meal',
      };
    });

    logDailyEntry({
      date: selectedDate,
      customerId: selectedCustomer.id,
      items: itemsPayload,
      totalAmount: parseFloat(manualTotalAmount),
      notes,
    });

    // Reset for next customer code
    const nextDefault = getTimeBasedDefaultMeal();
    setCodeQuery('');
    setSelectedCustomer(null);
    setSelectedMeals(nextDefault.meals);
    setManualTotalAmount(nextDefault.amount);
    setNotes('');
    if (codeInputRef.current) {
      codeInputRef.current.focus();
    }
  };

  const currentHour = new Date().getHours();
  const timeMealLabel =
    currentHour >= 5 && currentHour < 12
      ? 'Breakfast'
      : currentHour >= 12 && currentHour < 17
      ? 'Lunch'
      : 'Dinner (Night)';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
            <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              Daily Night Log Book
              <span className="text-[10px] sm:text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                Auto: {timeMealLabel}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select 3-digit customer code, check meals eaten & enter total AED bill
            </p>
          </div>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs text-slate-900 font-bold shadow-inner w-full md:w-auto justify-center md:justify-start">
          <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-slate-900 outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Main 3-Digit Customer Code Night Entry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        {/* Left Column: 3-Digit Code Input & Customer Details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm">
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
              Enter 3-Digit Customer Code
            </label>
            <div className="relative">
              <Search className="w-5 h-5 text-amber-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                ref={codeInputRef}
                type="text"
                maxLength={3}
                inputMode="numeric"
                pattern="[0-9]*"
                value={codeQuery}
                onChange={handleCodeChange}
                placeholder="e.g. 001"
                className="w-full bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:bg-white text-slate-900 font-mono text-2xl font-bold rounded-xl pl-11 pr-4 py-3 outline-none transition-all placeholder:text-slate-400 tracking-widest shadow-inner min-h-[52px]"
              />
            </div>

            {/* Customer Quick Select Chips */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 block mb-2">Quick Tap Customer Code:</span>
              <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1">
                {customers
                  .filter((c) => c.status === 'active')
                  .map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => handleCodeChange({ target: { value: c.id } })}
                      className={`font-mono text-xs sm:text-sm min-h-[38px] min-w-[50px] px-3 py-1.5 rounded-xl border font-bold transition-all touch-manipulation ${
                        codeQuery === c.id || (selectedCustomer && selectedCustomer.id === c.id)
                          ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/50'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      #{c.id}
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* Matched Customer Info */}
          {selectedCustomer ? (
            <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl animate-fade-in space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-mono font-bold text-amber-700 text-lg shadow-inner shrink-0">
                    #{selectedCustomer.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{selectedCustomer.name}</h3>
                    <p className="text-xs text-slate-500">{selectedCustomer.roomNo} • {selectedCustomer.phone}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Active
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs shadow-inner">
                <span className="text-slate-600 font-bold">Current Dues Balance:</span>
                <span className={`font-bold font-mono text-sm ${
                  getCustomerBalance(selectedCustomer.id) > 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}>
                  AED {getCustomerBalance(selectedCustomer.id).toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white/60 border border-dashed border-slate-300 p-6 sm:p-8 rounded-2xl text-center text-slate-500 text-xs">
              <User className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              Select or type a 3-digit code above to record tonight's entry.
            </div>
          )}
        </div>

        {/* Right Column: Meal Checkboxes & Manual Total Amount */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900">1. Select Meals Eaten</h3>
                <p className="text-xs text-slate-500">Auto-selected <strong>{timeMealLabel}</strong> based on local time ({new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})</p>
              </div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Auto-Selected
              </span>
            </div>

            {/* 4 Core Meal Touch Cards */}
            <div className="grid grid-cols-2 gap-3">
              {mealOptions.map((meal) => {
                const isChecked = selectedMeals.includes(meal.id);

                return (
                  <div
                    key={meal.id}
                    onClick={() => toggleMeal(meal.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between touch-manipulation min-h-[64px] ${
                      isChecked
                        ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-400/40'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{meal.icon}</span>
                      <span className="font-bold text-slate-900 text-sm sm:text-base">{meal.name}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-5 h-5 accent-amber-600 rounded-md cursor-pointer shrink-0"
                    />
                  </div>
                );
              })}
            </div>

            {/* Manual Total Amount Input Field */}
            <div className="bg-amber-50/60 border-2 border-amber-300 rounded-2xl p-4 space-y-2">
              <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider">
                2. Enter Total Amount Manually (AED) *
              </label>
              <div className="relative">
                <span className="font-mono font-bold text-amber-700 text-lg absolute left-3.5 top-1/2 -translate-y-1/2">
                  AED
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  step="any"
                  value={manualTotalAmount}
                  onChange={(e) => setManualTotalAmount(e.target.value)}
                  placeholder="e.g. 20"
                  required
                  className="w-full bg-white border-2 border-amber-400 focus:border-amber-600 text-amber-900 font-mono text-2xl font-bold rounded-xl pl-16 pr-4 py-3 outline-none transition-all shadow-inner min-h-[52px]"
                />
              </div>
              <p className="text-[11px] text-amber-800 font-medium">
                Type the total bill amount manually for this customer's entry.
              </p>
            </div>

            {/* Optional Notes */}
            <div>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes (e.g. parcel / special instruction)..."
                className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl px-3 py-2.5 text-slate-900 outline-none focus:border-amber-500"
              />
            </div>

            {/* Save Button */}
            <button
              type="button"
              disabled={!selectedCustomer || selectedMeals.length === 0}
              onClick={handleSaveQuickEntry}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3.5 sm:py-4 rounded-xl text-sm sm:text-base shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] touch-manipulation min-h-[52px]"
            >
              <CheckCircle2 className="w-5 h-5" />
              Save Daily Log (Enter ↵)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
