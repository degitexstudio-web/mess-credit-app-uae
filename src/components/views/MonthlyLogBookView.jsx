import React, { useState } from 'react';
import { useMess } from '../../context/MessContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  BookOpen,
  Calendar,
  User,
  Download,
} from 'lucide-react';

export default function MonthlyLogBookView() {
  const { customers, dailyLogs, payments } = useMess();

  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers.length > 0 ? customers[0].id : '001'
  );

  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStr);

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  const customerLogs = dailyLogs.filter(
    (l) => l.customerId === selectedCustomerId && l.date.startsWith(selectedMonth)
  );

  const customerPayments = payments.filter(
    (p) => p.customerId === selectedCustomerId && p.date.startsWith(selectedMonth)
  );

  const monthTotalConsumption = customerLogs.reduce((sum, l) => sum + l.totalAmount, 0);
  const monthTotalPaid = customerPayments.reduce((sum, p) => sum + p.amount, 0);
  const openingBalance = selectedCustomer ? selectedCustomer.openingBalance || 0 : 0;
  const netBalance = openingBalance + monthTotalConsumption - monthTotalPaid;

  // Generate UAE PDF Invoice / Monthly Statement in Light Mode colors
  const handleExportPDF = () => {
    if (!selectedCustomer) return;

    const doc = new jsPDF();

    // Header Background Header Banner
    doc.setFillColor(245, 158, 11); // Amber
    doc.rect(0, 0, 210, 38, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MESS MONTHLY CREDIT STATEMENT (UAE)', 14, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Statement Period: ${selectedMonth}`, 14, 28);
    doc.text(`Generated Date: ${new Date().toLocaleDateString('en-AE')}`, 140, 28);

    // Customer Info Box
    doc.setFillColor(248, 250, 252); // slate-50
    doc.rect(14, 45, 182, 30, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, 45, 182, 30, 'S');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Customer #${selectedCustomer.id} - ${selectedCustomer.name}`, 20, 56);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Phone: ${selectedCustomer.phone || 'N/A'} | Location: ${selectedCustomer.roomNo || 'N/A'}`, 20, 66);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(180, 83, 9); // amber-700
    doc.text(`Net Payable: AED ${netBalance.toLocaleString()}`, 130, 66);

    // Daily Logs Table
    const tableRows = [];
    customerLogs
      .sort((a, b) => a.date.localeCompare(b.date))
      .forEach((log) => {
        const itemNames = log.items.map((i) => `${i.name} (x${i.qty})`).join(', ');
        tableRows.push([log.date, itemNames, `AED ${log.totalAmount}`]);
      });

    autoTable(doc, {
      startY: 83,
      head: [['Date', 'Meals & Items Consumed', 'Daily Total']],
      body: tableRows.length > 0 ? tableRows : [['-', 'No meal logs recorded for this month', 'AED 0']],
      headStyles: { fillColor: [245, 158, 11], textColor: [255, 255, 255], fontStyle: 'bold' },
      theme: 'grid',
    });

    // Payments Section
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text('Payments Received This Month:', 14, finalY);

    const payRows = customerPayments.map((p) => [p.date, p.method, p.notes || '-', `AED ${p.amount}`]);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Payment Date', 'Method', 'Notes / Ref', 'Amount Paid']],
      body: payRows.length > 0 ? payRows : [['-', '-', 'No payments received', 'AED 0']],
      headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255] },
      theme: 'grid',
    });

    finalY = doc.lastAutoTable.finalY + 18;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text('Thank you for your custom! Please clear monthly dues on or before the 5th of next month.', 14, finalY);

    doc.save(`Mess_Statement_${selectedCustomer.id}_${selectedMonth}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Customer / Month Selector */}
      <div className="bg-white border border-slate-200 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              Monthly Log Book & Ledger
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                Log Book
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review daily meal consumption logs & download PDF monthly statements
            </p>
          </div>
        </div>

        {/* Customer & Month Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-900 font-medium shadow-inner">
            <User className="w-4 h-4 text-amber-600" />
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id} className="bg-white text-slate-900">
                  #{c.id} - {c.name} ({c.roomNo})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-900 font-medium shadow-inner">
            <Calendar className="w-4 h-4 text-blue-600" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold text-slate-900 outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleExportPDF}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            Download PDF Statement
          </button>
        </div>
      </div>

      {/* Customer Monthly Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <p className="text-xs text-slate-500 font-bold">Month Consumption</p>
          <p className="text-xl font-bold font-mono text-amber-700 mt-1">
            AED {monthTotalConsumption.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{customerLogs.length} days logged in {selectedMonth}</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <p className="text-xs text-slate-500 font-bold">Payments Received</p>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-1">
            AED {monthTotalPaid.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">{customerPayments.length} payment entries</p>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
          <p className="text-xs text-slate-500 font-bold">Net Month Dues</p>
          <p className={`text-xl font-bold font-mono mt-1 ${netBalance > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
            AED {netBalance.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Includes opening balance of AED {openingBalance}</p>
        </div>
      </div>

      {/* Log Book Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden p-5 space-y-4 shadow-sm">
        <h3 className="font-bold text-slate-900 text-base">
          Daily Log Entries for #{selectedCustomer?.id} ({selectedCustomer?.name})
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Meals & Items Consumed</th>
                <th className="py-3 px-4 text-center">Items Qty</th>
                <th className="py-3 px-4 text-right">Daily Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {customerLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">
                    No meal logs recorded for this customer in {selectedMonth}.
                  </td>
                </tr>
              ) : (
                customerLogs
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-all">
                      <td className="py-3 px-4 font-mono text-slate-800 font-bold">{log.date}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        <div className="flex flex-wrap gap-1.5">
                          {log.items.map((item, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] text-slate-800"
                            >
                              {item.name} <strong className="text-amber-700">x{item.qty}</strong>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-600 font-bold">
                        {log.items.reduce((s, i) => s + i.qty, 0)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-amber-700 text-sm">
                        AED {log.totalAmount}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
