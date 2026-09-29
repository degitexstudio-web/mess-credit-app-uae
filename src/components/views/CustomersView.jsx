import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import {
  Users,
  Search,
  Phone,
  Home,
  Calendar,
  X,
  CreditCard,
  UserPlus,
} from 'lucide-react';

export default function CustomersView() {
  const {
    customers,
    searchQuery,
    setSearchQuery,
    addCustomer,
    addPayment,
    getCustomerBalance,
    getNextCustomerCode,
    todayDate,
  } = useMess();

  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(null);

  // Add customer form state
  const [newCustomerCode, setNewCustomerCode] = useState('');
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerRoom, setNewCustomerRoom] = useState('');
  const [newCustomerOpeningBal, setNewCustomerOpeningBal] = useState('0');

  // Record payment form state
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Cash');
  const [payNotes, setPayNotes] = useState('');

  const openAddModal = () => {
    setNewCustomerCode(getNextCustomerCode());
    setNewCustomerName('');
    setNewCustomerPhone('');
    setNewCustomerRoom('');
    setNewCustomerOpeningBal('0');
    setShowAddModal(true);
  };

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!newCustomerName.trim()) {
      alert('Customer name is required');
      return;
    }

    try {
      addCustomer({
        id: newCustomerCode,
        name: newCustomerName,
        phone: newCustomerPhone,
        roomNo: newCustomerRoom,
        openingBalance: newCustomerOpeningBal,
      });
      setShowAddModal(false);
    } catch (err) {
      // Toast displayed
    }
  };

  const handleSavePayment = (e) => {
    e.preventDefault();
    if (!payAmount || parseFloat(payAmount) <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    addPayment({
      date: todayDate,
      customerId: showPaymentModal.id,
      amount: parseFloat(payAmount),
      method: payMethod,
      notes: payNotes,
    });

    setShowPaymentModal(null);
    setPayAmount('');
    setPayNotes('');
  };

  const filteredCustomers = customers.filter((c) => {
    const balance = getCustomerBalance(c.id);
    const matchesSearch =
      c.id.includes(searchQuery) ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    if (!matchesSearch) return false;

    if (filterStatus === 'active') return c.status === 'active';
    if (filterStatus === 'dues') return balance > 0;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Customer Directory
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                3-Digit Codes
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage mess customers, 3-digit IDs, contact details & payments
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-amber-500/20 transition-all active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Add Customer (3-Digit)
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterStatus === 'all'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({customers.length})
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterStatus === 'active'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active ({customers.filter((c) => c.status === 'active').length})
          </button>
          <button
            onClick={() => setFilterStatus('dues')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              filterStatus === 'dues'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Has Dues ({customers.filter((c) => getCustomerBalance(c.id) > 0).length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search code, name, phone..."
            className="w-full bg-white border border-slate-200 text-xs text-slate-900 rounded-xl pl-9 pr-3 py-2 outline-none focus:border-amber-500 shadow-inner"
          />
        </div>
      </div>

      {/* Customers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCustomers.map((customer) => {
          const balance = getCustomerBalance(customer.id);
          const hasDues = balance > 0;

          return (
            <div
              key={customer.id}
              className="bg-white border border-slate-200 hover:border-slate-300 p-5 rounded-2xl space-y-4 shadow-sm transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center font-mono font-bold text-amber-700 text-lg shadow-inner">
                    #{customer.id}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">{customer.name}</h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Home className="w-3 h-3 text-slate-400" />
                      {customer.roomNo || 'No Room Specified'}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    customer.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border-slate-300'
                  }`}
                >
                  {customer.status}
                </span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    Phone:
                  </span>
                  <span className="font-mono font-bold text-slate-800">{customer.phone || 'N/A'}</span>
                </div>

                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    Joined:
                  </span>
                  <span className="text-slate-800 font-medium">{customer.joinDate}</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between mt-2 shadow-inner">
                  <span className="text-slate-600 font-medium text-xs">Current Balance:</span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      hasDues ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {hasDues ? `AED ${balance.toLocaleString()} Due` : 'AED 0 Clear'}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(customer)}
                  className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Record Payment
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL 1: ADD NEW CUSTOMER */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 space-y-5 animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-600" />
                Add New Customer
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Unique 3-Digit Customer Code *
                </label>
                <input
                  type="text"
                  maxLength={3}
                  value={newCustomerCode}
                  onChange={(e) => setNewCustomerCode(e.target.value)}
                  placeholder="e.g. 006"
                  required
                  className="w-full bg-slate-50 border border-slate-300 text-amber-700 font-mono text-base font-bold rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500"
                />
                <span className="text-[11px] text-slate-500 mt-1 block font-medium">
                  Auto-assigned next available code. You can customize if needed.
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  placeholder="e.g. Mohammed Ali"
                  required
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number (UAE)</label>
                  <input
                    type="text"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="+971 50 123 4567"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Room / Address</label>
                  <input
                    type="text"
                    value={newCustomerRoom}
                    onChange={(e) => setNewCustomerRoom(e.target.value)}
                    placeholder="Room 101, Deira"
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Opening Dues Balance (AED)</label>
                <input
                  type="number"
                  value={newCustomerOpeningBal}
                  onChange={(e) => setNewCustomerOpeningBal(e.target.value)}
                  placeholder="0"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold rounded-xl px-3.5 py-2.5 outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/20"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RECORD PAYMENT */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl p-6 space-y-5 animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                Record Credit Payment
              </h3>
              <button
                type="button"
                onClick={() => setShowPaymentModal(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex items-center justify-between shadow-inner">
              <div>
                <p className="font-bold text-slate-900 text-sm">#{showPaymentModal.id} - {showPaymentModal.name}</p>
                <p className="text-slate-500">{showPaymentModal.roomNo}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 font-medium">Current Dues:</p>
                <p className="font-mono font-bold text-rose-600">
                  AED {getCustomerBalance(showPaymentModal.id).toLocaleString()}
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Amount (AED) *</label>
                <input
                  type="number"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  placeholder="e.g. 100"
                  required
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-300 text-emerald-700 font-mono text-xl font-bold rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Cash', 'Bank Transfer', 'Card'].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPayMethod(m)}
                      className={`py-2 rounded-xl font-bold border text-xs transition-all ${
                        payMethod === m
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Notes / Ref Number</label>
                <input
                  type="text"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                  placeholder="e.g. Cash received or bank ref"
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-emerald-600/20"
                >
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
