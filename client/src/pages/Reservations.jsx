import { useEffect, useState } from 'react';
import { api } from '../api/client';

const emptyForm = { customer_id: '', party_size: 2, reservation_time: '', notes: '' };
const statuses = ['confirmed', 'seated', 'cancelled', 'completed', 'no-show'];

export default function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/reservations').then(setReservations).catch((e) => setError(e.message));
    api.get('/customers').then(setCustomers).catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/reservations', {
        ...form,
        customer_id: form.customer_id ? Number(form.customer_id) : null,
        party_size: Number(form.party_size),
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const updateStatus = async (id, status) => {
    await api.put(`/reservations/${id}/status`, { status });
    load();
  };

  return (
    <div>
      <h1>Reservations</h1>

      <section className="panel">
        <h2>New Reservation</h2>
        {error && <p className="error">{error}</p>}
        <form className="form-grid" onSubmit={handleSubmit}>
          <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
            <option value="">Walk-in / no customer</option>
            {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input type="number" min="1" placeholder="Party size" value={form.party_size} onChange={(e) => setForm({ ...form, party_size: e.target.value })} />
          <input type="datetime-local" required value={form.reservation_time} onChange={(e) => setForm({ ...form, reservation_time: e.target.value })} />
          <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button type="submit">Book</button>
        </form>
      </section>

      <table>
        <thead>
          <tr><th>Time</th><th>Party</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td>{new Date(r.reservation_time).toLocaleString()}</td>
              <td>{r.party_size}</td>
              <td><span className={`badge status-${r.status}`}>{r.status}</span></td>
              <td>
                <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value)}>
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {reservations.length === 0 && <tr><td colSpan={4}>No reservations yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
