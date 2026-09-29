import React, { createContext, useContext, useState, useEffect } from 'react';
import { messService, getTodayDateString } from '../services/messService';

const MessContext = createContext();

export function MessProvider({ children }) {
  const [activeTab, setActiveTab] = useState('daily-entry'); // default to night-entry as per requirement
  const [customers, setCustomers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Load state from service
  const refreshData = () => {
    setCustomers(messService.getCustomers());
    setMenuItems(messService.getMenuItems());
    setDailyLogs(messService.getDailyLogs());
    setPayments(messService.getPayments());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Actions
  const handleAddCustomer = (customerData) => {
    try {
      const created = messService.addCustomer(customerData);
      refreshData();
      showToast(`Customer #${created.id} (${created.name}) added successfully!`);
      return created;
    } catch (e) {
      showToast(e.message, 'error');
      throw e;
    }
  };

  const handleUpdateCustomer = (id, updatedFields) => {
    try {
      const updated = messService.updateCustomer(id, updatedFields);
      refreshData();
      showToast(`Customer #${id} updated.`);
      return updated;
    } catch (e) {
      showToast(e.message, 'error');
      throw e;
    }
  };

  const handleLogDailyEntry = (entryData) => {
    try {
      const logged = messService.logDailyEntry(entryData);
      refreshData();
      showToast(`Logged AED ${logged.totalAmount} for Customer #${logged.customerId}`);
      return logged;
    } catch (e) {
      showToast(e.message, 'error');
      throw e;
    }
  };

  const handleAddPayment = (paymentData) => {
    try {
      const pay = messService.addPayment(paymentData);
      refreshData();
      showToast(`Recorded payment of AED ${pay.amount} for Customer #${pay.customerId}`);
      return pay;
    } catch (e) {
      showToast(e.message, 'error');
      throw e;
    }
  };

  const handleAddMenuItem = (itemData) => {
    try {
      const item = messService.addMenuItem(itemData);
      refreshData();
      showToast(`Added menu item "${item.name}"`);
      return item;
    } catch (e) {
      showToast(e.message, 'error');
      throw e;
    }
  };

  const handleUpdateMenuItem = (id, fields) => {
    try {
      const item = messService.updateMenuItem(id, fields);
      refreshData();
      showToast(`Updated menu item "${item.name}"`);
      return item;
    } catch (e) {
      showToast(e.message, 'error');
      throw e;
    }
  };

  const handleDeleteMenuItem = (id) => {
    try {
      messService.deleteMenuItem(id);
      refreshData();
      showToast('Menu item removed');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleResetDefaults = () => {
    messService.resetToDefaults();
    refreshData();
    showToast('Reset all data to default sample records', 'info');
  };

  const handleImportBackup = (backupObj) => {
    try {
      messService.importBackup(backupObj);
      refreshData();
      showToast('Backup data imported successfully!');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  // Utility calculations
  const getCustomerBalance = (customerId) => messService.getCustomerBalance(customerId);
  const getNextCustomerCode = () => messService.getNextCustomerCode();

  const value = {
    activeTab,
    setActiveTab,
    customers,
    menuItems,
    dailyLogs,
    payments,
    searchQuery,
    setSearchQuery,
    toastMessage,
    showToast,
    refreshData,
    addCustomer: handleAddCustomer,
    updateCustomer: handleUpdateCustomer,
    logDailyEntry: handleLogDailyEntry,
    addPayment: handleAddPayment,
    addMenuItem: handleAddMenuItem,
    updateMenuItem: handleUpdateMenuItem,
    deleteMenuItem: handleDeleteMenuItem,
    resetDefaults: handleResetDefaults,
    exportBackup: () => messService.exportBackup(),
    importBackup: handleImportBackup,
    getCustomerBalance,
    getNextCustomerCode,
    todayDate: getTodayDateString(),
  };

  return <MessContext.Provider value={value}>{children}</MessContext.Provider>;
}

export function useMess() {
  const context = useContext(MessContext);
  if (!context) {
    throw new Error('useMess must be used within a MessProvider');
  }
  return context;
}
