import { useEffect, useState } from 'react';
import { api } from '../api/client';

const statuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cart, setCart] = useState([]); // [{menu_item_id, quantity}]
  const [orderType, setOrderType] = useState('dine-in');
  const [tableNumber, setTableNumber] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    api.get('/orders').then(setOrders).catch((e) => setError(e.message));
    api.get('/menu/items').then((items) => setMenuItems(items.filter((i) => i.is_available))).catch(() => {});
    api.get('/customers').then(setCustomers).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const addToCart = (menuItemId) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menu_item_id === menuItemId);
      if (existing) {
        return prev.map((c) => (c.menu_item_id === menuItemId ? { ...c, quantity: c.quantity + 1 } : c));
      }
      return [...prev, { menu_item_id: menuItemId, quantity: 1 }];
    });
  };

  const removeFromCart = (menuItemId) => {
    setCart((prev) => prev.filter((c) => c.menu_item_id !== menuItemId));
  };

  const cartTotal = cart.reduce((sum, c) => {
    const item = menuItems.find((m) => m.id === c.menu_item_id);
    return sum + (item ? item.price * c.quantity : 0);
  }, 0);

  const submitOrder = async () => {
    if (cart.length === 0) return;
    setError('');
    try {
      await api.post('/orders', {
        customer_id: customerId ? Number(customerId) : null,
        order_type: orderType,
        table_number: tableNumber || null,
        items: cart,
      });
      setCart([]);
      setTableNumber('');
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateStatus = async (id, status) => {
    await api.put(`/orders/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <h1>Orders</h1>
      {error && <p className="error">{error}</p>}

      <section className="panel">
        <h2>New Order</h2>
        <div className="form-grid">
          <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            <option value="dine-in">Dine-in</option>
            <option value="takeaway">Takeaway</option>
            <option value="delivery">Delivery</option>
          </select>
          {orderType === 'dine-in' && (
            <input placeholder="Table number" value={tableNumber} onChange={(e) => setTableNumber(e.target.value)} />
          )}
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Walk-in / no customer</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>)}
          </select>
        </div>

        <div className="grid-2">
          <div>
            <h3>Menu</h3>
            <ul className="pick-list">
              {menuItems.map((m) => (
                <li key={m.id}>
                  <span>{m.name} · ₹{m.price}</span>
                  <button type="button" onClick={() => addToCart(m.id)}>Add</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Cart</h3>
            <ul className="pick-list">
              {cart.map((c) => {
                const item = menuItems.find((m) => m.id === c.menu_item_id);
                return (
                  <li key={c.menu_item_id}>
                    <span>{item?.name} x{c.quantity}</span>
                    <button type="button" className="link-btn" onClick={() => removeFromCart(c.menu_item_id)}>Remove</button>
                  </li>
                );
              })}
              {cart.length === 0 && <li>No items yet</li>}
            </ul>
            <p><strong>Total: ₹{cartTotal}</strong></p>
            <button type="button" onClick={submitOrder} disabled={cart.length === 0}>Place Order</button>
          </div>
        </div>
      </section>

      <table>
        <thead>
          <tr><th>#</th><th>Type</th><th>Table</th><th>Total</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.order_type}</td>
              <td>{o.table_number || '-'}</td>
              <td>₹{o.total_amount}</td>
              <td><span className={`badge status-${o.status}`}>{o.status}</span></td>
              <td>
                <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {orders.length === 0 && <tr><td colSpan={6}>No orders yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
