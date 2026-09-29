// Storage key constants
const STORAGE_KEYS = {
  CUSTOMERS: 'mess_app_customers',
  MENU_ITEMS: 'mess_app_menu_items',
  DAILY_LOGS: 'mess_app_daily_logs',
  PAYMENTS: 'mess_app_payments',
};

// Standard Meals (Breakfast, Lunch, Dinner, Others)
const DEFAULT_MENU_ITEMS = [
  { id: 'm_breakfast', name: 'Breakfast', category: 'Meal', icon: '🥣' },
  { id: 'm_lunch', name: 'Lunch', category: 'Meal', icon: '🍲' },
  { id: 'm_dinner', name: 'Dinner', category: 'Meal', icon: '🍱' },
  { id: 'm_others', name: 'Others', category: 'Extra', icon: '☕' },
];

const DEFAULT_CUSTOMERS = [
  { id: '001', name: 'Rahul Sharma', phone: '+971 50 123 4567', roomNo: 'Flat 102, Bur Dubai', joinDate: '2026-08-01', status: 'active', openingBalance: 0 },
  { id: '002', name: 'Mohammed Ali', phone: '+971 55 987 6543', roomNo: 'Room 205, Deira', joinDate: '2026-08-05', status: 'active', openingBalance: 40 },
  { id: '003', name: 'Amit Kumar', phone: '+971 52 456 7890', roomNo: 'Camp B3, Al Quoz', joinDate: '2026-08-10', status: 'active', openingBalance: 0 },
  { id: '004', name: 'Vikram Singh', phone: '+971 54 321 0987', roomNo: 'Flat 404, Sharjah', joinDate: '2026-08-15', status: 'active', openingBalance: 0 },
  { id: '005', name: 'Sajid Khan', phone: '+971 56 112 2334', roomNo: 'Room 108, Muhaisnah', joinDate: '2026-09-01', status: 'active', openingBalance: 0 },
];

export const getTodayDateString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Sample daily logs
const generateSampleLogs = () => {
  const logs = [];
  const today = new Date();

  for (let i = 10; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    // Customer 001
    logs.push({
      id: `log_001_${dateStr}`,
      date: dateStr,
      customerId: '001',
      items: [
        { itemId: 'm_breakfast', name: 'Breakfast' },
        { itemId: 'm_lunch', name: 'Lunch' },
        { itemId: 'm_dinner', name: 'Dinner' }
      ],
      totalAmount: 50,
      notes: ''
    });

    // Customer 002
    logs.push({
      id: `log_002_${dateStr}`,
      date: dateStr,
      customerId: '002',
      items: [
        { itemId: 'm_lunch', name: 'Lunch' },
        { itemId: 'm_dinner', name: 'Dinner' }
      ],
      totalAmount: 40,
      notes: ''
    });

    // Customer 003
    if (i % 2 === 0) {
      logs.push({
        id: `log_003_${dateStr}`,
        date: dateStr,
        customerId: '003',
        items: [
          { itemId: 'm_breakfast', name: 'Breakfast' },
          { itemId: 'm_dinner', name: 'Dinner' }
        ],
        totalAmount: 30,
        notes: ''
      });
    }
  }

  return logs;
};

const DEFAULT_PAYMENTS = [
  { id: 'pay_1', date: '2026-09-01', customerId: '001', amount: 500, method: 'Bank Transfer', notes: 'Advance payment' },
  { id: 'pay_2', date: '2026-09-05', customerId: '002', amount: 300, method: 'Cash', notes: 'Partial Cash Payment' },
  { id: 'pay_3', date: '2026-09-10', customerId: '003', amount: 250, method: 'Card', notes: 'Mid month payment' },
];

class MessStorageService {
  getItem(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error(`Error reading ${key} from localStorage:`, e);
      return defaultValue;
    }
  }

  setItem(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error writing ${key} to localStorage:`, e);
    }
  }

  init() {
    if (!localStorage.getItem(STORAGE_KEYS.CUSTOMERS)) {
      this.setItem(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MENU_ITEMS)) {
      this.setItem(STORAGE_KEYS.MENU_ITEMS, DEFAULT_MENU_ITEMS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DAILY_LOGS)) {
      this.setItem(STORAGE_KEYS.DAILY_LOGS, generateSampleLogs());
    }
    if (!localStorage.getItem(STORAGE_KEYS.PAYMENTS)) {
      this.setItem(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);
    }
  }

  getCustomers() {
    return this.getItem(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
  }

  saveCustomers(customers) {
    this.setItem(STORAGE_KEYS.CUSTOMERS, customers);
  }

  getNextCustomerCode() {
    const customers = this.getCustomers();
    const numericIds = customers
      .map((c) => parseInt(c.id, 10))
      .filter((num) => !isNaN(num));
    const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
    const nextNum = maxId + 1;
    return String(nextNum).padStart(3, '0');
  }

  addCustomer(customerData) {
    const customers = this.getCustomers();
    let code = customerData.id ? String(customerData.id).padStart(3, '0') : this.getNextCustomerCode();
    
    if (customers.some((c) => c.id === code)) {
      throw new Error(`Customer code "${code}" already exists! Please use a unique 3-digit code.`);
    }

    const newCustomer = {
      id: code,
      name: customerData.name || 'Unnamed Customer',
      phone: customerData.phone || '',
      roomNo: customerData.roomNo || '',
      joinDate: customerData.joinDate || getTodayDateString(),
      status: customerData.status || 'active',
      openingBalance: parseFloat(customerData.openingBalance || 0),
    };

    customers.push(newCustomer);
    this.saveCustomers(customers);
    return newCustomer;
  }

  updateCustomer(id, updatedFields) {
    const customers = this.getCustomers();
    const index = customers.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Customer not found');

    customers[index] = { ...customers[index], ...updatedFields };
    this.saveCustomers(customers);
    return customers[index];
  }

  getMenuItems() {
    return this.getItem(STORAGE_KEYS.MENU_ITEMS, DEFAULT_MENU_ITEMS);
  }

  saveMenuItems(items) {
    this.setItem(STORAGE_KEYS.MENU_ITEMS, items);
  }

  getDailyLogs() {
    return this.getItem(STORAGE_KEYS.DAILY_LOGS, []);
  }

  saveDailyLogs(logs) {
    this.setItem(STORAGE_KEYS.DAILY_LOGS, logs);
  }

  logDailyEntry({ date, customerId, items, totalAmount, notes = '' }) {
    const logs = this.getDailyLogs();
    const customerCode = String(customerId).padStart(3, '0');

    const existingIndex = logs.findIndex((l) => l.date === date && l.customerId === customerCode);

    const logEntry = {
      id: existingIndex >= 0 ? logs[existingIndex].id : `log_${customerCode}_${date}`,
      date,
      customerId: customerCode,
      items,
      totalAmount: parseFloat(totalAmount) || 0,
      notes,
    };

    if (existingIndex >= 0) {
      logs[existingIndex] = logEntry;
    } else {
      logs.push(logEntry);
    }

    this.saveDailyLogs(logs);
    return logEntry;
  }

  deleteDailyLog(id) {
    let logs = this.getDailyLogs();
    logs = logs.filter((l) => l.id !== id);
    this.saveDailyLogs(logs);
  }

  getPayments() {
    return this.getItem(STORAGE_KEYS.PAYMENTS, []);
  }

  savePayments(payments) {
    this.setItem(STORAGE_KEYS.PAYMENTS, payments);
  }

  addPayment({ date, customerId, amount, method = 'Cash', notes = '' }) {
    const payments = this.getPayments();
    const customerCode = String(customerId).padStart(3, '0');

    const newPayment = {
      id: `pay_${Date.now()}`,
      date: date || getTodayDateString(),
      customerId: customerCode,
      amount: parseFloat(amount),
      method,
      notes,
    };

    payments.push(newPayment);
    this.savePayments(payments);
    return newPayment;
  }

  deletePayment(id) {
    let payments = this.getPayments();
    payments = payments.filter((p) => p.id !== id);
    this.savePayments(payments);
  }

  getCustomerBalance(customerId) {
    const customerCode = String(customerId).padStart(3, '0');
    const customers = this.getCustomers();
    const customer = customers.find((c) => c.id === customerCode);
    if (!customer) return 0;

    const openingBalance = customer.openingBalance || 0;
    const logs = this.getDailyLogs().filter((l) => l.customerId === customerCode);
    const totalConsumption = logs.reduce((sum, l) => sum + (l.totalAmount || 0), 0);
    const payments = this.getPayments().filter((p) => p.customerId === customerCode);
    const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return openingBalance + totalConsumption - totalPaid;
  }

  resetToDefaults() {
    this.setItem(STORAGE_KEYS.CUSTOMERS, DEFAULT_CUSTOMERS);
    this.setItem(STORAGE_KEYS.MENU_ITEMS, DEFAULT_MENU_ITEMS);
    this.setItem(STORAGE_KEYS.DAILY_LOGS, generateSampleLogs());
    this.setItem(STORAGE_KEYS.PAYMENTS, DEFAULT_PAYMENTS);
  }

  exportBackup() {
    return {
      version: '1.0',
      region: 'UAE',
      currency: 'AED',
      exportDate: new Date().toISOString(),
      customers: this.getCustomers(),
      menuItems: this.getMenuItems(),
      dailyLogs: this.getDailyLogs(),
      payments: this.getPayments(),
    };
  }

  importBackup(backupData) {
    if (!backupData || !backupData.customers) {
      throw new Error('Invalid backup file structure.');
    }
    this.saveCustomers(backupData.customers);
    this.saveDailyLogs(backupData.dailyLogs || []);
    this.savePayments(backupData.payments || []);
  }
}

export const messService = new MessStorageService();
messService.init();
