import React, { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WikiManager } from './components/WikiManager';
import { KeyCracker } from './components/KeyCracker';
import { DaredashTracker } from './components/DaredashTracker';
import { FetchLinks } from './components/FetchLinks';
import { MinerList } from './components/MinerList';
import { TRANSLATIONS } from './constants/translations';

// React Grid Layout
import { Responsive, WidthProvider } from 'react-grid-layout/legacy';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DEFAULT_LAYOUTS = {
  lg: [
    { i: 'wiki', x: 0, y: 0, w: 8, h: 10, minW: 5 },
    { i: 'keys', x: 8, y: 0, w: 4, h: 4, minW: 3 },
    { i: 'daredash', x: 8, y: 4, w: 4, h: 4, minW: 3 },
    { i: 'fetch', x: 8, y: 8, w: 4, h: 3, minW: 3 },
    { i: 'miners', x: 8, y: 11, w: 4, h: 4, minW: 3 }
  ],
  md: [
    { i: 'wiki', x: 0, y: 0, w: 6, h: 10, minW: 4 },
    { i: 'keys', x: 6, y: 0, w: 4, h: 4, minW: 3 },
    { i: 'daredash', x: 6, y: 4, w: 4, h: 4, minW: 3 },
    { i: 'fetch', x: 6, y: 8, w: 4, h: 3, minW: 3 },
    { i: 'miners', x: 6, y: 11, w: 4, h: 4, minW: 3 }
  ],
  sm: [
    { i: 'wiki', x: 0, y: 0, w: 6, h: 10, minW: 3 },
    { i: 'keys', x: 0, y: 10, w: 6, h: 4, minW: 3 },
    { i: 'daredash', x: 0, y: 14, w: 6, h: 4, minW: 3 },
    { i: 'fetch', x: 0, y: 18, w: 6, h: 3, minW: 3 },
    { i: 'miners', x: 0, y: 21, w: 6, h: 4, minW: 3 }
  ]
};

function App() {
  const [lang, setLang] = useLocalStorage('wttg3_lang', 'tr'); // Default to TR since user speaks Turkish
  const t = TRANSLATIONS[lang];

  const initialWikiData = [
    { url: '', sites: [] },
    { url: '', sites: [] },
    { url: '', sites: [] }
  ];
  const initialKeyData = Array(8).fill(null).map(() => ({ original: '', cracked: '' }));

  const [wikiData, setWikiData] = useLocalStorage('wttg3_wikis', initialWikiData);
  const [keyData, setKeyData] = useLocalStorage('wttg3_keys', initialKeyData);
  const [daredashData, setDaredashData] = useLocalStorage('wttg3_daredashData', []);
  const [fetchData, setFetchData] = useLocalStorage('wttg3_fetchData', []);
  const [cheatsEnabled, setCheatsEnabled] = useLocalStorage('wttg3_cheatsEnabled', true);
  
  // Layout state
  const [layouts, setLayouts] = useLocalStorage('wttg3_layouts', DEFAULT_LAYOUTS);

  const fileInputRef = React.useRef(null);

  const handleExport = () => {
    const data = { wikiData, keyData, daredashData, fetchData, cheatsEnabled, layouts };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wttg3_save.json';
    a.click();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.wikiData) setWikiData(data.wikiData);
        if (data.keyData) setKeyData(data.keyData);
        if (data.daredashData) setDaredashData(data.daredashData);
        if (data.fetchData) setFetchData(data.fetchData);
        if (data.cheatsEnabled !== undefined) setCheatsEnabled(data.cheatsEnabled);
        if (data.layouts) setLayouts(data.layouts);
      } catch (err) {
        alert('Invalid Save Data');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input so the same file can be selected again
  };

  const handleResetAll = () => {
    if (window.confirm(t.confirmGlobalReset)) {
      setWikiData(initialWikiData);
      setKeyData(initialKeyData);
      setDaredashData([]);
      setFetchData([]);
      setLayouts(DEFAULT_LAYOUTS);
    }
  };

  return (
    <div className="app-container">
      <header>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div></div>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>{t.title}</h1>
            <p className="text-dim">{t.subtitle}</p>
          </div>
          <div>
            <button onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')} style={{ fontWeight: 'bold' }}>
              {lang === 'tr' ? 'EN' : 'TR'}
            </button>
          </div>
        </div>
        
        {/* Settings Bar */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <button onClick={handleExport}>{t.exportData}</button>
          
          <button onClick={handleImportClick}>{t.importData}</button>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          
          <button className="danger" onClick={handleResetAll}>{t.resetAll}</button>
        </div>
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <label style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            <input 
              type="checkbox" 
              checked={cheatsEnabled} 
              onChange={(e) => setCheatsEnabled(e.target.checked)} 
            />
            {t.cheatsEnabled}
          </label>
        </div>
      </header>

      {/* Draggable & Resizable Grid Layout */}
      <ResponsiveGridLayout
        className="layout"
        layouts={layouts}
        onLayoutChange={(currentLayout, allLayouts) => setLayouts(allLayouts)}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
        rowHeight={60}
        draggableHandle=".drag-handle"
        margin={[16, 16]}
      >
        <div key="wiki" className="grid-item">
          <div className="drag-handle">[::] WIKI MANAGER</div>
          <div className="grid-content">
            <WikiManager wikiData={wikiData} updateWikiData={setWikiData} t={t} lang={lang} cheatsEnabled={cheatsEnabled} />
          </div>
        </div>

        <div key="keys" className="grid-item">
          <div className="drag-handle">[::] KEY TRACKER</div>
          <div className="grid-content">
            <KeyCracker keyData={keyData} updateKeyData={setKeyData} t={t} />
          </div>
        </div>

        <div key="daredash" className="grid-item">
          <div className="drag-handle">[::] DAREDASH</div>
          <div className="grid-content">
            <DaredashTracker daredashData={daredashData} updateDaredashData={setDaredashData} t={t} />
          </div>
        </div>

        <div key="fetch" className="grid-item">
          <div className="drag-handle">[::] FETCH</div>
          <div className="grid-content">
            <FetchLinks fetchData={fetchData} updateFetchData={setFetchData} t={t} />
          </div>
        </div>

        <div key="miners" className="grid-item">
          <div className="drag-handle">[::] VIRTMESH MINERS</div>
          <div className="grid-content">
            <MinerList t={t} />
          </div>
        </div>
      </ResponsiveGridLayout>

    </div>
  );
}

export default App;
