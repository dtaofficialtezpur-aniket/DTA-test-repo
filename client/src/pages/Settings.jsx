import { useEffect, useState } from 'react';
import { api } from '../api/client';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function Settings() {
  const [profile, setProfile] = useState(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/restaurant').then(setProfile).catch((e) => setError(e.message));
  }, []);

  if (!profile) return <p>Loading...</p>;

  const update = (field, value) => setProfile({ ...profile, [field]: value });
  const updateHours = (day, value) => setProfile({ ...profile, opening_hours: { ...profile.opening_hours, [day]: value } });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const updated = await api.put('/restaurant', profile);
      setProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Restaurant Profile</h1>
      {error && <p className="error">{error}</p>}
      {saved && <p className="success">Saved.</p>}

      <form className="panel" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>Name<input value={profile.name || ''} onChange={(e) => update('name', e.target.value)} /></label>
          <label>Local Name<input value={profile.name_local || ''} onChange={(e) => update('name_local', e.target.value)} /></label>
          <label>Cuisine<input value={profile.cuisine || ''} onChange={(e) => update('cuisine', e.target.value)} /></label>
          <label>Category<input value={profile.category || ''} onChange={(e) => update('category', e.target.value)} /></label>
          <label>Phone<input value={profile.phone || ''} onChange={(e) => update('phone', e.target.value)} /></label>
          <label>Website<input value={profile.website || ''} onChange={(e) => update('website', e.target.value)} /></label>
          <label>Price Range<input value={profile.price_range || ''} onChange={(e) => update('price_range', e.target.value)} /></label>
          <label>Rating<input type="number" step="0.1" value={profile.rating ?? ''} onChange={(e) => update('rating', Number(e.target.value))} /></label>
          <label>Rating Count<input type="number" value={profile.rating_count ?? ''} onChange={(e) => update('rating_count', Number(e.target.value))} /></label>
          <label>Latitude<input type="number" step="0.000001" value={profile.latitude ?? ''} onChange={(e) => update('latitude', Number(e.target.value))} /></label>
          <label>Longitude<input type="number" step="0.000001" value={profile.longitude ?? ''} onChange={(e) => update('longitude', Number(e.target.value))} /></label>
        </div>

        <label className="full">Address
          <textarea value={profile.address || ''} onChange={(e) => update('address', e.target.value)} />
        </label>

        <label className="full">Notes
          <textarea value={profile.notes || ''} onChange={(e) => update('notes', e.target.value)} />
        </label>

        <h2>Opening Hours</h2>
        <div className="form-grid">
          {days.map((d) => (
            <label key={d} style={{ textTransform: 'capitalize' }}>{d}
              <input
                placeholder="09:00-21:00 or Closed"
                value={profile.opening_hours?.[d] || ''}
                onChange={(e) => updateHours(d, e.target.value)}
              />
            </label>
          ))}
        </div>

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}
