'use client';

import React from 'react';

export function LegacyCalendarSidebar() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dates = [
    [30, 31, 1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24, 25, 26],
    [27, 28, 29, 30, 1, 2, 3]
  ];

  return (
    <aside className="legacy-sidebar-tree" style={{ padding: '0' }}>
      <div className="legacy-panel" style={{ border: 'none', background: 'transparent' }}>
        <div className="legacy-panel-header" style={{ justifyContent: 'space-between' }}>
          <span>Mini Calendar</span>
          <span>&lt;</span>
        </div>
        <div style={{ padding: '12px' }}>
          <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
            <span>April 2026</span>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>&lt;</button>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>&gt;</button>
            </div>
          </div>
          <table style={{ width: '100%', fontSize: '10px', textAlign: 'center', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {days.map(d => <th key={d} style={{ padding: '4px 0', fontSize: '9px', color: '#666' }}>{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {dates.map((week, i) => (
                <tr key={i}>
                  {week.map((date, j) => (
                    <td 
                      key={j} 
                      style={{ 
                        padding: '6px 0', 
                        cursor: 'pointer',
                        color: (i === 0 && date > 20) || (i === 4 && date < 10) ? '#ccc' : '#333',
                        background: date === 15 ? '#e1f0ff' : 'none',
                        border: date === 15 ? '1px solid #0076c8' : 'none',
                        fontWeight: date === 15 ? 'bold' : 'normal'
                      }}
                    >
                      {date}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ borderTop: '1px solid #eee', marginTop: '16px', paddingTop: '12px' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '8px' }}>Wednesday, April 15</div>
            <div style={{ fontSize: '11px', color: '#888' }}>No Changes scheduled</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
