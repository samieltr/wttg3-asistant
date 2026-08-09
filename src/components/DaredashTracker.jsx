import React, { useState } from 'react';

export function DaredashTracker({ daredashData, updateDaredashData, t }) {
  const [storeNumber, setStoreNumber] = useState('');
  const [storeName, setStoreName] = useState('');

  const addStore = (e) => {
    e.preventDefault();
    if (!storeNumber.trim()) return;

    const newData = [...daredashData, {
      id: Date.now(),
      number: storeNumber.trim(),
      name: storeName.trim()
    }];
    updateDaredashData(newData);
    setStoreNumber('');
    setStoreName('');
  };

  const removeStore = (id) => {
    const newData = daredashData.filter(s => s.id !== id);
    updateDaredashData(newData);
  };

  return (
    <div className="glass-panel">
      <h2>{t.daredashTitle}</h2>
      <form onSubmit={addStore} className="flex-row mt-1">
        <input 
          type="text" 
          placeholder={t.storeNumPlaceholder} 
          value={storeNumber}
          onChange={(e) => setStoreNumber(e.target.value)}
          required
        />
        <input 
          type="text" 
          placeholder={t.storeNamePlaceholder} 
          value={storeName}
          onChange={(e) => setStoreName(e.target.value)}
          style={{ flex: 1 }}
        />
        <button type="submit">{t.addStore}</button>
      </form>

      <div className="mt-1 flex-col">
        {daredashData.length === 0 ? (
          <p className="text-dim">{t.noStores}</p>
        ) : (
          daredashData.map(store => (
            <div key={store.id} className="flex-row space-between" style={{ background: 'rgba(0,0,0,0.4)', padding: '0.5rem', borderRadius: '4px' }}>
              <div>
                <span style={{ color: 'var(--neon-green)', fontFamily: 'var(--font-mono)' }}>{store.number}</span>
                {store.name && <span className="text-dim" style={{ marginLeft: '1rem' }}>- {store.name}</span>}
              </div>
              <button className="danger" onClick={() => removeStore(store.id)}>X</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
