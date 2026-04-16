'use client';

import React from 'react';

export function SchedulerView() {
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

  return (
    <div style={{ background: 'white', border: '1px solid #ddd', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fcfcfc' }}>
        <div style={{ fontWeight: 'bold', fontSize: '13px' }}>April 2026</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="legacy-btn">Day</button>
          <button className="legacy-btn active">Week</button>
          <button className="legacy-btn">Month</button>
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)', gridAutoRows: '50px' }}>
        {/* Header Row */}
        <div style={{ borderBottom: '1px solid #ddd', borderRight: '1px solid #ddd' }} />
        {['Mon 13', 'Tue 14', 'Wed 15', 'Thu 16', 'Fri 17', 'Sat 18', 'Sun 19'].map(day => (
          <div key={day} style={{ borderBottom: '1px solid #ddd', borderRight: '1px solid #ddd', padding: '8px', fontSize: '11px', textAlign: 'center', background: '#f5f5f5' }}>
            {day}
          </div>
        ))}

        {/* Time Slots */}
        {hours.map(hour => (
          <React.Fragment key={hour}>
            <div style={{ borderBottom: '1px solid #eee', borderRight: '1px solid #ddd', fontSize: '10px', color: '#888', textAlign: 'center', padding: '4px' }}>
              {hour}:00
            </div>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ borderBottom: '1px solid #eee', borderRight: '1px solid #ddd', background: i > 4 ? '#fafafa' : 'white' }} />
            ))}
          </React.Fragment>
        ))}
      </div>
      
      <div style={{ padding: '40px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
         <p>No scheduled tasks for this week.</p>
      </div>
    </div>
  );
}
