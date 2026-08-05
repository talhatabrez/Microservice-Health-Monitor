import { useState, useEffect } from 'react';

function App() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState('');
  const [endpoint, setEndpoint] = useState('');

  // 1. Fetch services from backend on load
  const fetchServices = () => {
    fetch('http://localhost:8010/api/services')
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error('API Error:', err));
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // 2. Submit new service to backend
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !endpoint) return;

    fetch('http://localhost:8010/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, endpoint, status: 'Healthy' }),
    })
      .then(() => {
        setName('');
        setEndpoint('');
        fetchServices(); // Refresh list
      })
      .catch((err) => console.error('Error saving:', err));
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      <h2>Microservice Health Monitor</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Service Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '8px', flex: 1 }}
        />
        <input
          type="text"
          placeholder="Endpoint URL"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          style={{ padding: '8px', flex: 1 }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Add
        </button>
      </form>

      {/* List */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {services.map((s) => (
          <li key={s.ID || s.id} style={{ padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between' }}>
            <span><strong>{s.NAME || s.name}</strong> ({s.ENDPOINT || s.endpoint})</span>
            <span style={{ color: 'green', fontWeight: 'bold' }}>{s.status || s.STATUS}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;