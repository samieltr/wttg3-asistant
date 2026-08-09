import React from 'react';

export function KeyCracker({ keyData, updateKeyData, t }) {
  const handleOriginalChange = (index, value) => {
    const newData = [...keyData];
    newData[index].original = value;
    updateKeyData(newData);
  };

  const handleCrackedChange = (index, value) => {
    const newData = [...keyData];
    // Automatically strip key prefix (like "1 - ") if followed by character
    newData[index].cracked = value.replace(/^\d+\s*-\s*(?=\w)/, '');
    updateKeyData(newData);
  };

  const finalKey = keyData.map(k => k.cracked.replace(/^\d+\s*-\s*/, '').trim()).join('');

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(finalKey).then(() => {
        alert("Copied!");
      });
    } else {
      alert(`${t.finalKey}\n${finalKey}`);
    }
  };

  return (
    <div className="glass-panel">
      <h2>{t.keysTitle}</h2>
      <div className="mt-1 flex-col">
        {keyData.map((k, index) => (
          <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ width: '60px', color: 'var(--neon-blue)', fontWeight: 'bold' }}>Key {index + 1}</span>
            <input 
              type="text" 
              placeholder="e.g. 1 - f7ae8599" 
              value={k.original}
              onChange={(e) => handleOriginalChange(index, e.target.value)}
              style={{ flex: 1 }}
            />
            <input 
              type="text" 
              placeholder="Cracked: e.g. bf37" 
              value={k.cracked}
              onChange={(e) => handleCrackedChange(index, e.target.value)}
              onBlur={(e) => {
                const cleaned = e.target.value.replace(/^\d+\s*-\s*/, '').trim();
                if (cleaned !== e.target.value) {
                  handleCrackedChange(index, cleaned);
                }
              }}
              style={{ flex: 1, borderColor: k.cracked ? 'var(--neon-green)' : 'var(--border-color)' }}
            />
          </div>
        ))}
      </div>

      <div className="mt-1 flex-col" style={{ background: 'rgba(0,0,0,0.6)', padding: '1rem', borderRadius: '4px', marginTop: '1.5rem', border: '1px dashed var(--neon-green)' }}>
        <h4 className="text-dim">{t.finalKey}</h4>
        <div className="flex-row space-between" style={{ marginTop: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', color: 'var(--neon-green)', wordBreak: 'break-all' }}>
            {finalKey || t.waitingKeys}
          </span>
          <button onClick={copyToClipboard} disabled={!finalKey}>{t.copy}</button>
        </div>
      </div>
    </div>
  );
}
