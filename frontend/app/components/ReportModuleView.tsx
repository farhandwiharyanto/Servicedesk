'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch, endpoints } from '@/lib/api';
import { NavIcon } from './NavIcon';

export function ReportModuleView() {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiFetch('/reports');
        setFolders(res);
        // Set 'Farhan' as the default selected folder
        const farhanFolder = res.find((f: any) => f.name === 'Farhan');
        if (farhanFolder) setSelectedFolderId(farhanFolder.id);
        
        const initialOpen: Record<string, boolean> = {};
        res.forEach((f: any) => { 
          initialOpen[f.id] = true; // Open all by default now for better visibility
        });
        setOpenFolders(initialOpen);
      } catch (err) {
        console.error("Failed to load reports:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toggleFolder = (id: string) => {
    setOpenFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--primary)', fontWeight: 700 }}>🔄 Loading Reports Module...</div>;

  const filteredFolders = selectedFolderId 
    ? folders.filter(f => f.id === selectedFolderId)
    : folders;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: 'calc(100vh - 64px)', background: '#fff' }}>
      
      {/* Sidebar Folders - Left Narrow Column */}
      <aside style={{ borderRight: '1px solid #e1e9f1', background: '#fcfdfe' }}>
        <div style={{ padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #edf2f7' }}>
          <h3 style={{ fontSize: '11px', fontWeight: 700, margin: 0, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Folder</h3>
          <button style={{ border: 'none', background: 'none', color: '#64748b', fontSize: '10px', fontWeight: 600, cursor: 'pointer' }}>Manage</button>
        </div>

        <div className="zoho-folder-tree" style={{ padding: '4px 0' }}>
          <div 
            className={`zoho-folder-node ${selectedFolderId === null ? 'active' : ''}`}
            onClick={() => setSelectedFolderId(null)}
            style={{ padding: '6px 14px', fontSize: '11px' }}
          >
            <div className="zoho-folder-name" style={{ gap: '8px' }}>
              <span style={{ fontSize: '13px' }}>📋</span>
              <span>All Folders</span>
            </div>
          </div>
          {folders.map(folder => (
            <div
              key={folder.id}
              className={`zoho-folder-node ${selectedFolderId === folder.id ? 'active' : ''}`}
              onClick={() => setSelectedFolderId(folder.id)}
              style={{ padding: '6px 14px', fontSize: '11px' }}
            >
              <div className="zoho-folder-name" style={{ gap: '8px' }}>
                <span style={{ fontSize: '13px', opacity: 0.7 }}>📁</span>
                <span>{folder.name}</span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ padding: '0', background: '#fff', display: 'flex', flexDirection: 'column' }}>
        
        {/* ribbon-header-zoho style */}
        <div style={{ padding: '10px 20px', borderBottom: '1px solid #e1e9f1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#1e293b' }}>All Reports</h2>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ position: 'relative', width: '380px' }}>
              <input 
                type="text" 
                placeholder="Search Reports..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', padding: '5px 12px', borderRadius: '2px', 
                  border: '1px solid #d1d9e6', fontSize: '12px', outline: 'none'
                }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>Showing</span>
              <select style={{ border: '1px solid #d1d9e6', padding: '3px 6px', fontSize: '11px', borderRadius: '2px', background: '#fff', fontWeight: 600 }}>
                 <option>All Reports</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 20px', overflowY: 'auto' }}>
          {/* Info Box - Zoho Style */}
          <div style={{ 
            background: '#f0f9ff', border: '1px solid #bae6fd', padding: '10px 14px', borderRadius: '2px', 
            marginBottom: '16px', fontSize: '11px', color: '#0369a1', lineHeight: 1.5, position: 'relative'
          }}>
            <button style={{ position: 'absolute', right: '10px', top: '8px', border: 'none', background: 'none', fontSize: '10px', color: '#0369a1', cursor: 'pointer' }}>Do not show this again [x]</button>
            <div style={{ fontWeight: 700, marginBottom: '4px' }}>Note: Application might face stability / performance issues, when reports that return huge number of records, are executed. To ensure application stability, we have restricted reports to return:</div>
            <div style={{ paddingLeft: '12px' }}>- a maximum of 30000 records only</div>
            <div style={{ paddingLeft: '12px' }}>- a maximum of 5000 records when request description / resolution columns are selected</div>
          </div>

          {/* Action Button Group */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
             <button style={{ border: '1px solid #ccc', background: '#fff', padding: '5px 10px', fontSize: '12px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, color: '#333', cursor: 'pointer' }}>
               <span style={{ fontSize: '16px', fontWeight: 400 }}>+</span> New Report <span style={{ fontSize: '8px' }}>▼</span>
             </button>
             <button style={{ border: '1px solid #d1d9e6', background: '#fff', padding: '5px 10px', fontSize: '12px', borderRadius: '2px', fontWeight: 500, color: '#444', cursor: 'pointer' }}>Drill Down Analysis</button>
             <button style={{ border: '1px solid #d1d9e6', background: '#fff', padding: '5px 10px', fontSize: '12px', borderRadius: '2px', fontWeight: 500, color: '#444', cursor: 'pointer' }}>Advanced Analytics</button>
             <button style={{ border: '1px solid #d1d9e6', background: '#fff', padding: '5px 8px', fontSize: '12px', borderRadius: '2px', fontWeight: 500, color: '#444', cursor: 'pointer' }}>?</button>
             <button style={{ border: '1px solid #d1d9e6', background: '#fff', padding: '5px 10px', fontSize: '12px', borderRadius: '2px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 500, color: '#444', cursor: 'pointer' }}>
               <span style={{ fontSize: '14px' }}>✥</span> Reorder
             </button>
          </div>

        {/* Accordion List Content */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filteredFolders.map(folder => (
            <div key={folder.id} style={{ marginBottom: '4px' }}>
                <div 
                  onClick={() => toggleFolder(folder.id)}
                  style={{ 
                    background: '#f8fafc', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '10px', 
                    cursor: 'pointer', border: '1px solid #eef2f7'
                  }}
                >
                   <span style={{ color: '#94a3b8', fontSize: '14px' }}>{openFolders[folder.id] ? '▼' : '▶'}</span>
                   <span style={{ color: '#475569', fontSize: '13px', opacity: 0.8 }}>📁</span>
                   <span style={{ fontSize: '13px', fontWeight: 600, color: '#2563eb' }}>{folder.name}</span>
                </div>
              
                {openFolders[folder.id] && (
                  <div style={{ padding: '0 0 0 38px', background: '#fff' }}>
                     {folder.reports && folder.reports.length > 0 ? (
                       folder.reports.map((report: any) => (
                         <div key={report.id} style={{ padding: '10px 0', borderTop: '1px solid #f8fafc', display: 'flex', alignItems: 'center', gap: '12px', transition: 'background 0.2s' }}>
                            <span style={{ fontSize: '15px', color: '#64748b' }}>🖋️</span>
                            <span style={{ fontSize: '13px', color: '#314159', fontWeight: 500, cursor: 'pointer' }}>{report.name}</span>
                         </div>
                       ))
                     ) : (
                       <div style={{ padding: '10px 0', fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>
                         No reports in this folder.
                       </div>
                     )}
                  </div>
                )}
            </div>
          ))}
          </div>
        </div>
      </main>
    </div>
  );
}
