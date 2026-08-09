import React, { useState } from 'react';

const MINERS = [
  // Tier 1 (Default)
  { name: 'WebTyk', rate: 1.84, tier: 1 },
  { name: 'UserJyx', rate: 1.80, tier: 1 },
  { name: 'NetVorn', rate: 1.45, tier: 1 },
  { name: 'CloudFuz', rate: 0.88, tier: 1 },
  { name: 'SysBlip', rate: 0.87, tier: 1 },
  { name: 'DevQuix', rate: 0.64, tier: 1 },
  { name: 'IT_Kwez', rate: 0.42, tier: 1 },
  { name: 'DataRax', rate: 0.32, tier: 1 },
  { name: 'WorkZap', rate: 0.31, tier: 1 },
  { name: 'CodePlix', rate: 0.30, tier: 1 },
  
  // Tier 2 (50 DOS)
  { name: 'OpsHax', rate: 3.23, tier: 2 },
  { name: 'SecCrux', rate: 2.73, tier: 2 },
  { name: 'GameDrux', rate: 2.57, tier: 2 },
  { name: 'PrintYiv', rate: 2.43, tier: 2 },
  { name: 'FileNuz', rate: 1.88, tier: 2 },
  { name: 'ProdGlin', rate: 1.80, tier: 2 },
  { name: 'VM_Wekl', rate: 1.74, tier: 2 },
  { name: 'BackSkiv', rate: 1.49, tier: 2 },
  { name: 'TestXor', rate: 1.36, tier: 2 },
  { name: 'LabBzop', rate: 0.48, tier: 2 },
  
  // Tier 3 (125 DOS)
  { name: 'Phoenix', rate: 4.79, tier: 3 },
  { name: 'MediaVlu', rate: 3.93, tier: 3 },
  { name: 'QA_Pivz', rate: 3.58, tier: 3 },
  { name: 'HR_Treq', rate: 3.42, tier: 3 },
  { name: 'FinLoxu', rate: 3.38, tier: 3 },
  { name: 'VPN_Qwer', rate: 3.38, tier: 3 },
  { name: 'SalesMiv', rate: 3.21, tier: 3 },
  { name: 'ChatEzk', rate: 3.17, tier: 3 },
  { name: 'EngZolp', rate: 2.63, tier: 3 },
  { name: 'LogJuk', rate: 0.30, tier: 3 },
];

export function MinerList({ t }) {
  const [search, setSearch] = useState('');

  const filteredMiners = MINERS.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="glass-panel">
      <h2>{t.minerTitle}</h2>
      
      <div className="mt-1 flex-col">
        <input 
          type="text" 
          placeholder={t.minerSearch} 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '1rem', padding: '0 0.5rem' }}>
          <span>T2 Upgrade: <span style={{ color: 'var(--neon-blue)' }}>50 DOS</span></span>
          <span>T3 Upgrade: <span style={{ color: 'var(--neon-green)' }}>125 DOS</span></span>
        </div>
        
        <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
          {filteredMiners.map(miner => (
            <div 
              key={miner.name} 
              className="flex-row space-between" 
              style={{ 
                background: 'rgba(0,0,0,0.4)', 
                padding: '0.75rem', 
                borderRadius: '4px', 
                marginBottom: '0.5rem',
                borderLeft: `4px solid ${miner.tier === 1 ? 'var(--text-main)' : miner.tier === 2 ? 'var(--neon-blue)' : 'var(--neon-green)'}`
              }}
            >
              <div className="flex-col" style={{ gap: '0.2rem' }}>
                <span style={{ color: 'var(--text-main)', fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>
                  {miner.name}
                </span>
                <span className="text-dim text-sm">{t.tier} {miner.tier}</span>
              </div>
              <div style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>
                {miner.rate.toFixed(2)} DOS/min
              </div>
            </div>
          ))}
          {filteredMiners.length === 0 && (
            <p className="text-dim text-center mt-1">No results found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
