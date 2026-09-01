import { useEffect, useState } from 'react';
import { api } from '../api/client';

const emptyForm = { name: '', phone: '', email: '', address: '', notes: '' };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = (query = '') => {
    api.get(`/customers${query ? `?q=${encodeURIComponent(query)}` : ''}`).then(setCustomers).catch((e) => setError(e.message));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load(q);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/customers', form);
      setForm(emptyForm);
      load(q);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return;
    await api.del(`/customers/${id}`);
    load(q);
  };

  return (
    <div>
      <h1>Customers</h1>

      <form className="inline-form" onSubmit={handleSearch}>
        <input placeholder="Search by name, phone, or email" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="submit">Search</button>
      </form>

      <section className="panel">
        <h2>Add Customer</h2>
        {error && <p className="error">{error}</p>}
        <form className="form-grid" onSubmit={handleSubmit}>
          <input placeholder="Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button type="submit">Add Customer</button>
        </form>
      </section>

      <table>
        <thead>
          <tr><th>Name</th><th>Phone</th><th>Email</th><th>Visits</th><th>Total Spent</th><th></th></tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
              <td>{c.visit_count}</td>
              <td>₹{c.total_spent}</td>
              <td><button className="link-btn" onClick={() => handleDelete(c.id)}>Delete</button></td>
            </tr>
          ))}
          {customers.length === 0 && <tr><td colSpan={6}>No customers yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
