import { useEffect, useState } from 'react';
import { api } from '../api/client';

const emptyForm = { name: '', description: '', price: '', category_id: '', is_veg: 1 };

export default function Menu() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/menu/items').then(setItems).catch((e) => setError(e.message));
    api.get('/menu/categories').then(setCategories).catch((e) => setError(e.message));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/menu/items', {
        ...form,
        price: Number(form.price),
        category_id: form.category_id ? Number(form.category_id) : null,
        is_veg: Number(form.is_veg),
      });
      setForm(emptyForm);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleAvailable = async (item) => {
    await api.put(`/menu/items/${item.id}`, { is_available: item.is_available ? 0 : 1 });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this menu item?')) return;
    await api.del(`/menu/items/${id}`);
    load();
  };

  return (
    <div>
      <h1>Menu</h1>

      <section className="panel">
        <h2>Add Menu Item</h2>
        {error && <p className="error">{error}</p>}
        <form className="form-grid" onSubmit={handleSubmit}>
          <input placeholder="Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Price *" type="number" min="0" step="1" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
            <option value="">No category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={form.is_veg} onChange={(e) => setForm({ ...form, is_veg: e.target.value })}>
            <option value={1}>Veg</option>
            <option value={0}>Non-Veg</option>
          </select>
          <button type="submit">Add Item</button>
        </form>
      </section>

      <table>
        <thead>
          <tr><th>Name</th><th>Category</th><th>Price</th><th>Type</th><th>Available</th><th></th></tr>
        </thead>
        <tbody>
          {items.map((i) => (
            <tr key={i.id}>
              <td>{i.name}</td>
              <td>{i.category_name || '-'}</td>
              <td>₹{i.price}</td>
              <td>{i.is_veg ? 'Veg' : 'Non-Veg'}</td>
              <td>
                <button className="link-btn" onClick={() => toggleAvailable(i)}>
                  {i.is_available ? 'Yes' : 'No'}
                </button>
              </td>
              <td><button className="link-btn" onClick={() => handleDelete(i.id)}>Delete</button></td>
            </tr>
          ))}
          {items.length === 0 && <tr><td colSpan={6}>No menu items yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
