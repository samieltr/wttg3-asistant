import React, { useState } from 'react';
import { WTTG3_SITES, WTTG3_SITE_DATA } from '../constants/sites';

const parseSiteBadges = (info, t) => {
  if (!info) return [];
  const badges = [];
  const lower = info.toLowerCase();
  
  if (lower.includes('always down')) badges.push({ icon: '💀', title: t.legendAlwaysDown, color: 'var(--neon-red)' });
  if (lower.includes('fake')) badges.push({ icon: '🤡', title: t.legendFake, color: 'var(--neon-red)' });
  if (lower.includes('siezed') || lower.includes('seized')) badges.push({ icon: '🚔', title: t.legendSeized, color: 'var(--neon-red)' });
  if (lower.includes('aup') || lower.includes('always up')) badges.push({ icon: '🟢', title: t.legendAUP, color: 'var(--neon-green)' });
  else if (/\d{1,2}[:-]\d{2}/.test(lower) || lower.includes('timed')) badges.push({ icon: '🕒', title: t.legendTimed, color: 'var(--neon-blue)' });
  if (lower.includes('fetch')) badges.push({ icon: '📦', title: t.legendFetch, color: '#ffb300' });
  if (lower.includes('key')) badges.push({ icon: '🔑', title: t.legendKey, color: '#ffea00' });
  if (lower.includes('force hack') || lower.includes('h87') || lower.includes('h40')) badges.push({ icon: '⚡', title: t.legendHack, color: '#ff00ff' });
  if (lower.includes('bomb')) badges.push({ icon: '💣', title: t.legendBomb, color: 'var(--neon-red)' });
  
  return badges;
};

const translateInfo = (info, lang) => {
  if (lang !== 'tr' || !info) return info;
  let tr = info;
  tr = tr.replace(/ALWAYS DOWN/g, "Sürekli Kapalı");
  tr = tr.replace(/SEIZED/g, "El Konulmuş (FBI)");
  tr = tr.replace(/AUP/g, "Sürekli Açık");
  tr = tr.replace(/TIMED/g, "Saatli");
  tr = tr.replace(/FORCE HACK/g, "Zorla Hack");
  tr = tr.replace(/Cooldown/g, "Soğuma");
  tr = tr.replace(/WILL SPAWN BOMBS/g, "BOMBA ÇIKABİLİR");
  tr = tr.replace(/Fetch File\/Code \(source code\)/g, "Dosya/Kod Al (Kaynak Kodu)");
  tr = tr.replace(/Fetch File/g, "Dosya Al");
  tr = tr.replace(/Fetch/g, "Fetch (Görev)");
  tr = tr.replace(/Click on words in upper left \(key bottom right square\)/g, "Sol üstteki kelimelere tıkla (şifre sağ alt karede)");
  tr = tr.replace(/Clicking on a picture/g, "Bir resme tıklayarak");
  tr = tr.replace(/Timing could be every hour/g, "Zamanlama her saat başı olabilir");
  tr = tr.replace(/Key on word/g, "Şifre şu kelimede:");
  tr = tr.replace(/Open 30 mins into hour \(fetch and File found\. Clickable picture\.\)/g, "Saatin 30. dakikasında açılır (Görev ve Dosya. Tıklanabilir resim.)");
  tr = tr.replace(/Source Code/g, "Kaynak Kodu");
  tr = tr.replace(/Video click on word 'remain'/g, "Videoda 'remain' kelimesine tıkla");
  tr = tr.replace(/key - click on word 'Rate'/g, "Şifre - 'Rate' kelimesine tıkla");
  tr = tr.replace(/\(Key\)/g, "(Şifre)");
  return tr;
};

export function WikiManager({ wikiData, updateWikiData, t, lang, cheatsEnabled }) {
  const [activeTab, setActiveTab] = useState(0);
  const [filterStatus, setFilterStatus] = useState('All');
  const [hideDead, setHideDead] = useState(false);
  const [previewId, setPreviewId] = useState(null);

  const handleUrlChange = (e) => {
    const newData = [...wikiData];
    newData[activeTab].url = e.target.value;
    updateWikiData(newData);
  };

  const addSite = () => {
    const newData = [...wikiData];
    newData[activeTab].sites.unshift({
      id: Date.now(),
      name: '',
      status: 'Pending',
      annUrl: ''
    });
    updateWikiData(newData);
  };

  const updateSite = (siteId, field, value) => {
    const newData = [...wikiData];
    const siteIndex = newData[activeTab].sites.findIndex(s => s.id === siteId);
    if (siteIndex > -1) {
      newData[activeTab].sites[siteIndex][field] = value;
      updateWikiData(newData);
    }
  };

  const removeSite = (siteId) => {
    const newData = [...wikiData];
    newData[activeTab].sites = newData[activeTab].sites.filter(s => s.id !== siteId);
    updateWikiData(newData);
  };

  const clearAllSites = () => {
    if (window.confirm(t.confirmClearSites)) {
      const newData = [...wikiData];
      newData[activeTab].sites = [];
      updateWikiData(newData);
    }
  };

  const currentWiki = wikiData[activeTab];

  return (
    <div className="glass-panel">
      <div className="tabs">
        {wikiData.map((wiki, index) => (
          <button 
            key={index} 
            className={`tab ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
          >
            Wiki {index + 1}
          </button>
        ))}
      </div>

      <div className="flex-col mb-1">
        <label className="text-dim">{t.wikiUrl}</label>
        <input 
          type="text" 
          value={currentWiki.url} 
          onChange={handleUrlChange}
          placeholder={t.wikiPlaceholder} 
          style={{ width: '100%' }}
        />
      </div>

      <div className="legend-bar" style={{ padding: '0.5rem', gap: '0.75rem', marginBottom: '1.5rem', background: 'transparent', border: '1px dashed var(--border-color)', justifyContent: 'center' }}>
        <div className="legend-item"><span className="badge">💀</span> {t.legendAlwaysDown}</div>
        <div className="legend-item"><span className="badge">🤡</span> {t.legendFake}</div>
        <div className="legend-item"><span className="badge">🚔</span> {t.legendSeized}</div>
        <div className="legend-item"><span className="badge">🟢</span> {t.legendAUP}</div>
        <div className="legend-item"><span className="badge">🕒</span> {t.legendTimed}</div>
        <div className="legend-item"><span className="badge">📦</span> {t.legendFetch}</div>
        <div className="legend-item"><span className="badge">🔑</span> {t.legendKey}</div>
        <div className="legend-item"><span className="badge" style={{ borderColor: '#ff00ff', color: '#ff00ff' }}>⚡</span> {t.legendHack}</div>
        <div className="legend-item"><span className="badge" style={{ borderColor: 'var(--neon-red)' }}>💣</span> {t.legendBomb}</div>
      </div>

      <div className="flex-row space-between mb-1" style={{ alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ color: 'var(--text-main)', margin: 0 }}>{t.sites}</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ fontSize: '0.85rem', padding: '0.3rem 0.5rem' }}
          >
            <option value="All">{t.filterAll}</option>
            <option value="Pending">{t.filterPending}</option>
            <option value="Visited">{t.filterVisited}</option>
            <option value="Offline">{t.filterOffline}</option>
          </select>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', cursor: 'pointer', color: 'var(--text-dim)' }}>
            <input 
              type="checkbox" 
              checked={hideDead} 
              onChange={(e) => setHideDead(e.target.checked)} 
              style={{ width: 'auto', margin: 0, padding: 0 }}
            />
            {t.filterHideDead}
          </label>
          
          <button onClick={addSite}>{t.addSite}</button>
          {currentWiki.sites.length > 0 && (
            <button className="danger" onClick={clearAllSites}>{t.clearSites}</button>
          )}
        </div>
      </div>

      <div className="flex-col">
        <datalist id="wttg3-site-suggestions">
          {WTTG3_SITES.map(s => <option key={s} value={s} />)}
        </datalist>
        
        {(() => {
          const filteredSites = currentWiki.sites.filter(site => {
            if (filterStatus !== 'All' && site.status !== filterStatus) return false;
            if (hideDead) {
              const siteData = WTTG3_SITE_DATA[site.name];
              const info = siteData?.info || (typeof siteData === 'string' ? siteData : '');
              const lower = info.toLowerCase();
              if (lower.includes('always down') || lower.includes('siezed') || lower.includes('seized')) {
                return false;
              }
            }
            return true;
          });

          if (filteredSites.length === 0) {
            return <p className="text-dim text-center" style={{ padding: '2rem' }}>{t.noSites}</p>;
          }

          return filteredSites.map(site => {
            const siteData = WTTG3_SITE_DATA[site.name];
            const siteInfo = siteData?.info || (typeof siteData === 'string' ? siteData : '');
            const subpages = siteData?.subpages || [];
            const badges = parseSiteBadges(siteInfo, t);

            return (
              <div 
                key={site.id} 
                style={{ 
                  background: 'rgba(0,0,0,0.3)', 
                  padding: '0.75rem', 
                  borderRadius: '6px', 
                  marginBottom: '0.5rem', 
                  borderLeft: site.status === 'Visited' ? '4px solid var(--neon-green)' : site.status === 'Offline' ? '4px solid var(--neon-red)' : '4px solid var(--border-color)',
                  transition: 'all 0.2s'
                }}
              >
                
                {/* Clean Grid Layout for Inputs */}
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: cheatsEnabled ? 'minmax(200px, 1.5fr) 120px minmax(200px, 2fr) 40px 40px' : 'minmax(200px, 1.5fr) 120px minmax(200px, 2fr) 40px', 
                  gap: '0.5rem', 
                  alignItems: 'center' 
                }}>
                  <input 
                    type="text"
                    list="wttg3-site-suggestions"
                    value={site.name} 
                    onChange={(e) => updateSite(site.id, 'name', e.target.value)}
                    placeholder={t.siteNamePlaceholder}
                    style={{ width: '100%', borderColor: 'transparent', background: 'rgba(255,255,255,0.05)' }}
                  />

                  <select 
                    value={site.status} 
                    onChange={(e) => updateSite(site.id, 'status', e.target.value)}
                    style={{ 
                      width: '100%',
                      color: site.status === 'Visited' ? 'var(--neon-green)' : site.status === 'Offline' ? 'var(--neon-red)' : 'var(--text-main)',
                      borderColor: 'transparent',
                      background: 'rgba(255,255,255,0.05)'
                    }}
                  >
                    <option value="Pending">{t.statusPending}</option>
                    <option value="Visited">{t.statusVisited}</option>
                    <option value="Offline">{t.statusOffline}</option>
                  </select>

                  <input 
                    type="text" 
                    placeholder={t.annPlaceholder} 
                    value={site.annUrl} 
                    onChange={(e) => updateSite(site.id, 'annUrl', e.target.value)}
                    style={{ width: '100%', borderColor: 'transparent', background: 'rgba(255,255,255,0.05)' }}
                  />

                  {cheatsEnabled && (
                    <button 
                      title="Preview Guide"
                      onClick={() => siteData?.id && setPreviewId(siteData.id)}
                      style={{ width: '100%', padding: '0.5rem 0', background: siteData?.id ? 'rgba(57, 255, 20, 0.1)' : 'rgba(255,255,255,0.05)', borderColor: siteData?.id ? 'var(--neon-green)' : 'transparent', cursor: siteData?.id ? 'pointer' : 'not-allowed' }}
                      disabled={!siteData?.id}
                    >
                      👁️
                    </button>
                  )}

                  <button className="danger" onClick={() => removeSite(site.id)} style={{ width: '100%', padding: '0.5rem 0' }}>X</button>
                </div>

                {/* Sub-row for Badges and Info, tucked neatly underneath */}
                {siteInfo && (
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.75rem', paddingLeft: '0.2rem' }}>
                    {badges.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.2rem' }}>
                        {badges.map((b, i) => (
                          <span key={i} className="badge" title={b.title} style={{ borderColor: b.color, color: b.color, padding: '0.1rem 0.3rem', fontSize: '1rem' }}>
                            {b.icon}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                      {translateInfo(siteInfo, lang)}
                    </div>
                  </div>
                )}

                {/* Subpages Section */}
                {subpages.length > 0 && (
                  <div style={{ 
                    paddingLeft: '0.75rem', 
                    marginTop: '0.75rem', 
                    borderLeft: '2px solid rgba(57, 255, 20, 0.3)', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '0.4rem' 
                  }}>
                    {subpages.map((sub, index) => (
                      <div 
                        key={sub} 
                        onClick={() => { if (cheatsEnabled && siteData?.id) setPreviewId(siteData.id + index + 1); }}
                        style={{ 
                          fontSize: '0.85rem', 
                          color: (cheatsEnabled && sub.includes('FH')) ? '#ff00ff' : 'var(--neon-green)', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.4rem', 
                          cursor: (cheatsEnabled && siteData?.id) ? 'pointer' : 'default', 
                          padding: '0.2rem', 
                          borderRadius: '4px', 
                          transition: 'background 0.2s' 
                        }}
                        onMouseOver={(e) => { if (cheatsEnabled && siteData?.id) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                        onMouseOut={(e) => { if (cheatsEnabled && siteData?.id) e.currentTarget.style.background = 'transparent' }}
                      >
                        <span style={{ color: 'var(--text-dim)' }}>└─</span> 
                        {cheatsEnabled ? sub : sub.replace(/ \(.*\)/, '')}
                        {(cheatsEnabled && sub.includes('FH')) && <span className="badge" style={{ padding: '0.1rem 0.2rem', borderColor: '#ff00ff', color: '#ff00ff', fontSize: '0.85rem' }}>⚡</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          });
        })()}
      </div>

      {/* Preview Modal */}
      {previewId && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', 
          justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            position: 'relative', width: '90%', maxWidth: '1200px', height: '90%', 
            background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px',
            boxShadow: '0 0 40px rgba(0,0,0,0.9)'
          }}>
            <button 
              onClick={() => setPreviewId(null)} 
              style={{ position: 'absolute', top: '10px', right: '10px', padding: '0.5rem 1rem', background: 'rgba(255, 0, 0, 0.3)', color: 'white', border: '1px solid red', borderRadius: '4px', cursor: 'pointer', zIndex: 10000, fontWeight: 'bold' }}
            >
              CLOSE PREVIEW
            </button>
            <iframe 
              src={`Clickpoint Guides/${previewId}.html`} 
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }} 
            />
          </div>
        </div>
      )}
    </div>
  );
}
