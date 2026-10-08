import React, { createContext, useContext, useState, useEffect } from 'react';
import { messService, getTodayDateString } from '../services/messService';
import { db, getFirebaseConfig, saveFirebaseConfig } from '../services/firebase';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

const MessContext = createContext();

export function MessProvider({ children }) {
  const [activeTab, setActiveTab] = useState('daily-entry');
  const [customers, setCustomers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(Boolean(db));

  // Refresh LocalStorage data
  const refreshLocalData = () => {
    setCustomers(messService.getCustomers());
    setMenuItems(messService.getMenuItems());
    setDailyLogs(messService.getDailyLogs());
    setPayments(messService.getPayments());
  };

  useEffect(() => {
    refreshLocalData();
  }, []);

  // Real-Time Firebase Cloud Firestore Multi-Device Sync
  useEffect(() => {
    if (!db) {
      setIsFirebaseConnected(false);
      return;
    }

    setIsFirebaseConnected(true);

    // 1. Customers Realtime Sync
    const unsubCustomers = onSnapshot(
      collection(db, 'customers'),
      (snapshot) => {
        const list = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
        if (list.length > 0) {
          messService.saveCustomers(list);
          setCustomers(list);
        }
      },
      (err) => console.warn('Firestore customers listener error:', err)
    );

    // 2. Menu Items Realtime Sync
    const unsubMenuItems = onSnapshot(
      collection(db, 'menu_items'),
      (snapshot) => {
        const list = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
        if (list.length > 0) {
          messService.saveMenuItems(list);
          setMenuItems(list);
        }
      },
      (err) => console.warn('Firestore menu listener error:', err)
    );

    // 3. Daily Logs Realtime Sync
    const unsubLogs = onSnapshot(
      collection(db, 'daily_logs'),
      (snapshot) => {
        const list = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
        messService.saveDailyLogs(list);
        setDailyLogs(list);
      },
      (err) => console.warn('Firestore daily logs listener error:', err)
    );

    // 4. Payments Realtime Sync
    const unsubPayments = onSnapshot(
      collection(db, 'payments'),
      (snapshot) => {
        const list = [];
        snapshot.forEach((d) => list.push({ id: d.id, ...d.data() }));
        messService.savePayments(list);
        setPayments(list);
      },
      (err) => console.warn('Firestore payments listener error:', err)
    );

    return () => {
      unsubCustomers();
      unsubMenuItems();
      unsubLogs();
      unsubPayments();
    };
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Actions with dual Firebase Cloud + Local persistence
  const handleAddCustomer = async (customerData) => {
    try {
      const created = messService.addCustomer(customerData);

      if (db) {
        await setDoc(doc(db, 'customers', created.id), created);
      }

      refreshLocalData();
      showToast(`Customer #${created.id} (${created.name}) added!`);
      return created;
    } catch (e) {
      showToast(e.message, 'error');
      throw e;
    }
  };

  const handleUpdateCustomer = async (id, updatedFields) => {
    try {
      const updated = messService.updateCustomer(id, updatedFields);

      if (db) {
        await setDoc(doc(db, 'customers', id), updated, { merge: true });
      }

      refreshLocalData();
      showToast(`Customer #${id} updated.`);
      return updated;
    } catch (e) {
      showToast(e.message, 'error');
      throw e;
    }
  };

  const handleLogDailyEntry = async (entryData) => {
    try {
      const logged = messService.logDailyEntry(entryData);

      if (db) {
        await setDoc(doc(db, 'daily_logs', logged.id), logged);
      }

      refreshLocalData();
      showToast(`Logged AED ${logged.totalAmount} for Customer #${logged.customerId}`);
      return logged;
    } catch (e) {
      showToast(e.message, 'error');
      throw e;
    }
  };

  const handleAddPayment = async (paymentData) => {
    try {
      const pay = messService.addPayment(paymentData);

      if (db) {
        await setDoc(doc(db, 'payments', pay.id), pay);
      }

      refreshLocalData();
      showToast(`Recorded payment of AED ${pay.amount} for Customer #${pay.customerId}`);
      return pay;
    } catch (e) {
      showToast(e.message, 'error');
      throw e;
    }
  };

  const handleAddMenuItem = async (itemData) => {
    try {
      const item = messService.addMenuItem(itemData);

      if (db) {
        await setDoc(doc(db, 'menu_items', item.id), item);
      }

      refreshLocalData();
      showToast(`Added meal option "${item.name}"`);
      return item;
    } catch (e) {
      showToast(e.message, 'error');
      throw e;
    }
  };

  const handleUpdateMenuItem = async (id, fields) => {
    try {
      const item = messService.updateMenuItem(id, fields);

      if (db) {
        await setDoc(doc(db, 'menu_items', id), item, { merge: true });
      }

      refreshLocalData();
      showToast(`Updated meal option "${item.name}"`);
      return item;
    } catch (e) {
      showToast(e.message, 'error');
      throw e;
    }
  };

  const handleDeleteMenuItem = async (id) => {
    try {
      messService.deleteMenuItem(id);

      if (db) {
        await deleteDoc(doc(db, 'menu_items', id));
      }

      refreshLocalData();
      showToast('Meal option removed');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleResetDefaults = () => {
    messService.resetToDefaults();
    refreshLocalData();
    showToast('Reset all data to default sample records', 'info');
  };

  const handleImportBackup = (backupObj) => {
    try {
      messService.importBackup(backupObj);
      refreshLocalData();
      showToast('Backup data imported successfully!');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

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
    refreshData: refreshLocalData,
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
    isFirebaseConnected,
    getFirebaseConfig,
    saveFirebaseConfig,
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
