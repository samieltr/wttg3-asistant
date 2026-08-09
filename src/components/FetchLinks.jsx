import React, { useState } from 'react';

export function FetchLinks({ fetchData, updateFetchData, t }) {
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');

  const addLink = (e) => {
    e.preventDefault();
    if (!url.trim()) return;

    const newData = [...fetchData, {
      id: Date.now(),
      url: url.trim(),
      desc: desc.trim(),
      price: price.trim()
    }];
    updateFetchData(newData);
    setUrl('');
    setDesc('');
    setPrice('');
  };

  const removeLink = (id) => {
    const newData = fetchData.filter(s => s.id !== id);
    updateFetchData(newData);
  };

  return (
    <div className="glass-panel">
      <h2>{t.fetchTitle}</h2>
      <form onSubmit={addLink} className="flex-row mt-1 flex-wrap" style={{ flexWrap: 'wrap', gap: '0.5rem' }}>
        <input 
          type="text" 
          placeholder={t.fetchUrlPlaceholder} 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          style={{ flex: 2, minWidth: '200px' }}
        />
        <input 
          type="text" 
          placeholder={t.fetchFilePlaceholder} 
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={{ flex: 1, minWidth: '150px' }}
        />
        <input 
          type="number" 
          placeholder={t.fetchPricePlaceholder} 
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ width: '120px' }}
        />
        <button type="submit">{t.addFetch}</button>
      </form>

      <div className="mt-1 flex-col">
        {fetchData.length === 0 ? (
          <p className="text-dim">{t.noFetch}</p>
        ) : (
          fetchData.map(link => (
            <div key={link.id} className="flex-col" style={{ background: 'rgba(0,0,0,0.4)', padding: '0.5rem', borderRadius: '4px', borderLeft: '3px solid var(--neon-blue)' }}>
              <div className="flex-row space-between">
                <span style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)', wordBreak: 'break-all' }}>{link.url}</span>
                <button className="danger text-sm" onClick={() => removeLink(link.id)}>X</button>
              </div>
              <div className="text-dim flex-row space-between mt-1" style={{ fontSize: '0.9rem' }}>
                <span>File: {link.desc || t.unknown}</span>
                {link.price && <span style={{ color: 'var(--neon-green)' }}>{link.price} DOS</span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
