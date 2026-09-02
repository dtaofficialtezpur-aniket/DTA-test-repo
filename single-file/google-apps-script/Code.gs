/**
 * Spring Valley CRM — Google Apps Script backend.
 *
 * Deploy this as a Web App (Deploy > New deployment > Web app,
 * "Execute as: Me", "Who has access: Anyone") bound to a Google Sheet.
 * It turns that Sheet into the CRM's database: one tab per entity.
 * The single-file CRM (spring-valley-crm.html) calls this script's
 * web app URL instead of using browser localStorage.
 */

const SHEETS = {
  PROFILE: 'Profile',
  CUSTOMERS: 'Customers',
  CATEGORIES: 'Categories',
  MENU_ITEMS: 'MenuItems',
  ORDERS: 'Orders',
  RESERVATIONS: 'Reservations',
};

const CUSTOMER_HEADERS = ['id', 'name', 'phone', 'email', 'address', 'notes', 'visitCount', 'totalSpent', 'lastVisitAt', 'createdAt'];
const MENU_ITEM_HEADERS = ['id', 'category', 'name', 'description', 'price', 'isVeg', 'isAvailable'];
const ORDER_HEADERS = ['id', 'customerId', 'orderType', 'tableNumber', 'status', 'itemsJson', 'total', 'createdAt'];
const RESERVATION_HEADERS = ['id', 'customerId', 'partySize', 'time', 'status', 'notes', 'createdAt'];
const PROFILE_KEYS = [
  'name', 'name_local', 'cuisine', 'category', 'address', 'phone', 'website',
  'price_range', 'rating', 'rating_count', 'service_options', 'opening_hours',
  'latitude', 'longitude', 'notes',
];

function newId() {
  return Date.now() + '-' + Math.floor(Math.random() * 1e6);
}

function getSs() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getOrCreateSheet(name, headers) {
  const ss = getSs();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    if (headers) sheet.appendRow(headers);
  } else if (headers && sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
  return sheet;
}

function rowsToObjects(sheet, headers) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return [];
  const values = sheet.getRange(2, 1, lastRow - 1, headers.length).getValues();
  return values
    .filter((row) => row[0] !== '' && row[0] !== null)
    .map((row) => {
      const obj = {};
      headers.forEach((h, i) => { obj[h] = row[i]; });
      return obj;
    });
}

function findRowIndexById(sheet, id) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;
  const ids = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) {
    if (String(ids[i][0]) === String(id)) return i + 2; // sheet row number
  }
  return -1;
}

/* ---------- Profile ---------- */

function ensureProfile() {
  const sheet = getOrCreateSheet(SHEETS.PROFILE, ['key', 'value']);
  const existing = rowsToObjects(sheet, ['key', 'value']);
  if (existing.length > 0) return;

  const defaults = {
    name: 'Spring Valley',
    name_local: 'স্প্রিং ভ্যালী',
    cuisine: 'Assamese',
    category: 'Assamese restaurant',
    address: 'JQFX+V95, NC Rd, Mahabhairab, Tezpur, Assam 784001',
    phone: '03712 220 643',
    website: 'lahkar.com',
    price_range: '₹1–200',
    rating: 4.0,
    rating_count: 1922,
    service_options: JSON.stringify(['Order online', 'Dine-in', 'Takeaway', 'Delivery']),
    opening_hours: JSON.stringify({
      monday: '09:00-21:00', tuesday: '09:00-21:00', wednesday: '09:00-21:00',
      thursday: '09:00-21:00', friday: '09:00-21:00', saturday: '09:00-21:00', sunday: '09:00-21:00',
    }),
    latitude: 26.624646,
    longitude: 92.7984868,
    notes: 'Seeded from the Google Maps listing. Verify and update exact opening times per day.',
  };
  PROFILE_KEYS.forEach((k) => sheet.appendRow([k, defaults[k]]));
}

function getProfile() {
  ensureProfile();
  const sheet = getOrCreateSheet(SHEETS.PROFILE);
  const rows = rowsToObjects(sheet, ['key', 'value']);
  const profile = {};
  rows.forEach((r) => { profile[r.key] = r.value; });
  profile.rating = Number(profile.rating);
  profile.rating_count = Number(profile.rating_count);
  profile.latitude = Number(profile.latitude);
  profile.longitude = Number(profile.longitude);
  try { profile.service_options = JSON.parse(profile.service_options); } catch (e) { profile.service_options = []; }
  try { profile.opening_hours = JSON.parse(profile.opening_hours); } catch (e) { profile.opening_hours = {}; }
  return profile;
}

function saveProfile(payload) {
  const sheet = getOrCreateSheet(SHEETS.PROFILE, ['key', 'value']);
  ensureProfile();
  const lastRow = sheet.getLastRow();
  const keys = sheet.getRange(2, 1, lastRow - 1, 1).getValues().map((r) => r[0]);

  PROFILE_KEYS.forEach((key) => {
    if (!(key in payload)) return;
    let value = payload[key];
    if (key === 'service_options' || key === 'opening_hours') value = JSON.stringify(value);
    const rowIdx = keys.indexOf(key);
    if (rowIdx === -1) {
      sheet.appendRow([key, value]);
    } else {
      sheet.getRange(rowIdx + 2, 2).setValue(value);
    }
  });
  return getProfile();
}

/* ---------- Categories ---------- */

function ensureCategories() {
  const sheet = getOrCreateSheet(SHEETS.CATEGORIES, ['name']);
  if (sheet.getLastRow() < 2) {
    ['Starters', 'Assamese Thali', 'Rice & Curry', 'Beverages', 'Desserts'].forEach((c) => sheet.appendRow([c]));
  }
}

function getCategories() {
  ensureCategories();
  const sheet = getOrCreateSheet(SHEETS.CATEGORIES);
  return rowsToObjects(sheet, ['name']).map((r) => r.name);
}

/* ---------- Customers ---------- */

function ensureCustomersSheet() { return getOrCreateSheet(SHEETS.CUSTOMERS, CUSTOMER_HEADERS); }

function getCustomers() {
  const sheet = ensureCustomersSheet();
  return rowsToObjects(sheet, CUSTOMER_HEADERS);
}

function addCustomer(payload) {
  const sheet = ensureCustomersSheet();
  const customers = getCustomers();
  if (payload.phone && customers.some((c) => c.phone === payload.phone)) {
    throw new Error('A customer with this phone already exists');
  }
  const customer = {
    id: newId(),
    name: payload.name,
    phone: payload.phone || '',
    email: payload.email || '',
    address: payload.address || '',
    notes: payload.notes || '',
    visitCount: 0,
    totalSpent: 0,
    lastVisitAt: '',
    createdAt: new Date().toISOString(),
  };
  sheet.appendRow(CUSTOMER_HEADERS.map((h) => customer[h]));
  return customer;
}

function deleteCustomer(payload) {
  const sheet = ensureCustomersSheet();
  const rowIdx = findRowIndexById(sheet, payload.id);
  if (rowIdx === -1) throw new Error('Customer not found');
  sheet.deleteRow(rowIdx);
  return { id: payload.id };
}

function bumpCustomerStats(customerId, total) {
  const sheet = ensureCustomersSheet();
  const rowIdx = findRowIndexById(sheet, customerId);
  if (rowIdx === -1) return;
  const visitCountCol = CUSTOMER_HEADERS.indexOf('visitCount') + 1;
  const totalSpentCol = CUSTOMER_HEADERS.indexOf('totalSpent') + 1;
  const lastVisitCol = CUSTOMER_HEADERS.indexOf('lastVisitAt') + 1;
  const visitCount = sheet.getRange(rowIdx, visitCountCol).getValue() || 0;
  const totalSpent = sheet.getRange(rowIdx, totalSpentCol).getValue() || 0;
  sheet.getRange(rowIdx, visitCountCol).setValue(visitCount + 1);
  sheet.getRange(rowIdx, totalSpentCol).setValue(totalSpent + total);
  sheet.getRange(rowIdx, lastVisitCol).setValue(new Date().toISOString());
}

/* ---------- Menu items ---------- */

function ensureMenuSheet() {
  const sheet = getOrCreateSheet(SHEETS.MENU_ITEMS, MENU_ITEM_HEADERS);
  if (sheet.getLastRow() < 2) {
    const seed = [
      ['Starters', 'Veg Pakora', 'Assorted vegetable fritters', 80, true],
      ['Starters', 'Chicken Pakora', 'Spiced fried chicken bites', 130, false],
      ['Assamese Thali', 'Assamese Veg Thali', 'Rice, dal, seasonal vegetables, pickle', 150, true],
      ['Assamese Thali', 'Assamese Fish Thali', 'Rice, dal, fish curry, pickle', 190, false],
      ['Rice & Curry', 'Duck Curry with Rice', 'Traditional duck curry, steamed rice', 180, false],
      ['Rice & Curry', 'Egg Curry with Rice', 'Egg curry, steamed rice', 110, false],
      ['Beverages', 'Red Tea (Xah)', 'Traditional Assamese red tea', 20, true],
      ['Beverages', 'Lemon Soda', 'Fresh lemon soda', 40, true],
      ['Desserts', 'Payas', 'Assamese rice pudding', 60, true],
    ];
    seed.forEach(([category, name, description, price, isVeg]) => {
      sheet.appendRow([newId(), category, name, description, price, isVeg, true]);
    });
  }
  return sheet;
}

function getMenuItems() {
  const sheet = ensureMenuSheet();
  return rowsToObjects(sheet, MENU_ITEM_HEADERS);
}

function addMenuItem(payload) {
  const sheet = ensureMenuSheet();
  const item = {
    id: newId(),
    category: payload.category || '',
    name: payload.name,
    description: payload.description || '',
    price: Number(payload.price),
    isVeg: !!payload.isVeg,
    isAvailable: true,
  };
  sheet.appendRow(MENU_ITEM_HEADERS.map((h) => item[h]));
  return item;
}

function updateMenuItem(payload) {
  const sheet = ensureMenuSheet();
  const rowIdx = findRowIndexById(sheet, payload.id);
  if (rowIdx === -1) throw new Error('Menu item not found');
  if ('isAvailable' in payload) {
    const col = MENU_ITEM_HEADERS.indexOf('isAvailable') + 1;
    sheet.getRange(rowIdx, col).setValue(!!payload.isAvailable);
  }
  return { id: payload.id };
}

function deleteMenuItem(payload) {
  const sheet = ensureMenuSheet();
  const rowIdx = findRowIndexById(sheet, payload.id);
  if (rowIdx === -1) throw new Error('Menu item not found');
  sheet.deleteRow(rowIdx);
  return { id: payload.id };
}

/* ---------- Orders ---------- */

function ensureOrdersSheet() { return getOrCreateSheet(SHEETS.ORDERS, ORDER_HEADERS); }

function getOrders() {
  const sheet = ensureOrdersSheet();
  return rowsToObjects(sheet, ORDER_HEADERS).map((o) => {
    let items = [];
    try { items = JSON.parse(o.itemsJson); } catch (e) { items = []; }
    return { id: o.id, customerId: o.customerId, orderType: o.orderType, tableNumber: o.tableNumber, status: o.status, items, total: o.total, createdAt: o.createdAt };
  });
}

function placeOrder(payload) {
  const menuItems = getMenuItems();
  let total = 0;
  const items = (payload.items || []).map((it) => {
    const menuItem = menuItems.find((m) => String(m.id) === String(it.menuItemId));
    if (!menuItem) throw new Error('Menu item ' + it.menuItemId + ' not found');
    const quantity = it.quantity || 1;
    total += menuItem.price * quantity;
    return { menuItemId: menuItem.id, name: menuItem.name, price: menuItem.price, quantity };
  });
  if (items.length === 0) throw new Error('items array is required');

  const order = {
    id: newId(),
    customerId: payload.customerId || '',
    orderType: payload.orderType || 'dine-in',
    tableNumber: payload.tableNumber || '',
    status: 'pending',
    itemsJson: JSON.stringify(items),
    total: total,
    createdAt: new Date().toISOString(),
  };
  ensureOrdersSheet().appendRow(ORDER_HEADERS.map((h) => order[h]));

  if (payload.customerId) bumpCustomerStats(payload.customerId, total);

  return { id: order.id, customerId: order.customerId, orderType: order.orderType, tableNumber: order.tableNumber, status: order.status, items, total: order.total, createdAt: order.createdAt };
}

function updateOrderStatus(payload) {
  const sheet = ensureOrdersSheet();
  const rowIdx = findRowIndexById(sheet, payload.id);
  if (rowIdx === -1) throw new Error('Order not found');
  const col = ORDER_HEADERS.indexOf('status') + 1;
  sheet.getRange(rowIdx, col).setValue(payload.status);
  return { id: payload.id, status: payload.status };
}

/* ---------- Reservations ---------- */

function ensureReservationsSheet() { return getOrCreateSheet(SHEETS.RESERVATIONS, RESERVATION_HEADERS); }

function getReservations() {
  const sheet = ensureReservationsSheet();
  return rowsToObjects(sheet, RESERVATION_HEADERS);
}

function addReservation(payload) {
  const sheet = ensureReservationsSheet();
  const reservation = {
    id: newId(),
    customerId: payload.customerId || '',
    partySize: Number(payload.partySize) || 1,
    time: payload.time,
    status: 'confirmed',
    notes: payload.notes || '',
    createdAt: new Date().toISOString(),
  };
  sheet.appendRow(RESERVATION_HEADERS.map((h) => reservation[h]));
  return reservation;
}

function updateReservationStatus(payload) {
  const sheet = ensureReservationsSheet();
  const rowIdx = findRowIndexById(sheet, payload.id);
  if (rowIdx === -1) throw new Error('Reservation not found');
  const col = RESERVATION_HEADERS.indexOf('status') + 1;
  sheet.getRange(rowIdx, col).setValue(payload.status);
  return { id: payload.id, status: payload.status };
}

/* ---------- Aggregate read ---------- */

function getAll() {
  return {
    profile: getProfile(),
    categories: getCategories(),
    customers: getCustomers(),
    menuItems: getMenuItems(),
    orders: getOrders(),
    reservations: getReservations(),
  };
}

/* ---------- Router ---------- */

const ACTIONS = {
  ping: () => ({ ok: true, time: new Date().toISOString() }),
  getAll: () => getAll(),
  saveProfile: (p) => saveProfile(p),
  addCustomer: (p) => addCustomer(p),
  deleteCustomer: (p) => deleteCustomer(p),
  addMenuItem: (p) => addMenuItem(p),
  updateMenuItem: (p) => updateMenuItem(p),
  deleteMenuItem: (p) => deleteMenuItem(p),
  placeOrder: (p) => placeOrder(p),
  updateOrderStatus: (p) => updateOrderStatus(p),
  addReservation: (p) => addReservation(p),
  updateReservationStatus: (p) => updateReservationStatus(p),
};

function handleRequest(action, payload) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  try {
    const fn = ACTIONS[action];
    if (!fn) throw new Error('Unknown action: ' + action);
    const result = fn(payload || {});
    output.setContent(JSON.stringify({ ok: true, result: result }));
  } catch (err) {
    output.setContent(JSON.stringify({ ok: false, error: err.message }));
  }
  return output;
}

function doGet(e) {
  const action = (e.parameter && e.parameter.action) || 'ping';
  return handleRequest(action, e.parameter);
}

function doPost(e) {
  let body = {};
  try { body = JSON.parse(e.postData.contents); } catch (err) { /* ignore */ }
  return handleRequest(body.action, body.payload);
}
