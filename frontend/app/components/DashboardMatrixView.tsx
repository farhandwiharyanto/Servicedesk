'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch, endpoints } from '@/lib/api';

export function DashboardMatrixView() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    "Helpdesk",
    "Problem & Change",
    "Assets",
    "Ticket Monitoring This Month",
    "Ticket Reporting Last Month",
    "ITBP L1 Performance"
  ];

  useEffect(() => {
    async function loadData() {
      try {
        const response = await apiFetch(endpoints.tickets);
        if (response && response.requests) {
          setData(response.requests);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const apsTechNames = ['Adelia Maulanie Fedilla', 'Annisa Nur Lutfiyya', 'Farhan Dwi'];
  const infraTechNames = ['Angga Septian Cahya', 'Dafa Asmana', 'Dio Dimas Fauzi'];

  const getStatsForTech = (techName: string, monthIndex: number) => {
    const stats = { closed: 0, open: 0, rejected: 0, stopclock: 0, count: 0, resolved: 0 };
    
    data.forEach(ticket => {
      const ticketDate = new Date(ticket.created_at);
      if (ticketDate.getMonth() === monthIndex && ticket.technician?.name === techName) {
        stats.count++;
        const status = ticket.status?.type;
        if (status === 'CLOSED') stats.closed++;
        else if (status === 'OPEN' || status === 'IN_PROGRESS') stats.open++;
        else if (status === 'RESOLVED') stats.resolved++;
        else if (status === 'ON_HOLD') stats.stopclock++;
        // Add more mappings if needed
      }
    });

    return stats;
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>🔄 Memuat data dashboard...</div>;

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100vh', padding: '0 8px' }}>
      
      {/* Sub Header tabs for Dashboard */}
      <div className="legacy-sub-nav">
        {tabs.map(tab => (
          <div key={tab} className={`legacy-sub-tab ${tab === 'ITBP L1 Performance' ? 'active' : ''}`}>
            {tab}
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
             <button className="legacy-btn" style={{ padding: '2px 4px' }}>🔄</button>
             <button className="legacy-btn" style={{ fontWeight: 'bold' }}>+ New</button>
             <button className="legacy-btn">☰</button>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        
        {/* Matrix Aps Section */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>Matrix Aps Initial-requeststatus 2026</h4>
          <div className="table-legacy-wrap" style={{ margin: 0 }}>
            <table className="table-legacy">
              <thead>
                <tr style={{ background: '#eef3f7' }}>
                  <th rowSpan={2} style={{ width: '200px' }}>2026</th>
                  <th colSpan={5} style={{ textAlign: 'center', background: '#e1f0ff' }}>Jan</th>
                  <th colSpan={5} style={{ textAlign: 'center', background: '#e1f0ff' }}>Feb</th>
                  <th colSpan={6} style={{ textAlign: 'center', background: '#e1f0ff' }}>Mar</th>
                </tr>
                <tr style={{ background: '#f2f5f7' }}>
                  <th>Closed</th><th>Open</th><th>Rejected</th><th>StopClock</th><th>Count</th>
                  <th>Closed</th><th>Open</th><th>Rejected</th><th>StopClock</th><th>Count</th>
                  <th>Closed</th><th>Open</th><th>Rejected</th><th>Resolved</th><th>StopClock</th><th>Count</th>
                </tr>
              </thead>
              <tbody>
                {apsTechNames.map(name => {
                  const jan = getStatsForTech(name, 0);
                  const feb = getStatsForTech(name, 1);
                  const mar = getStatsForTech(name, 2);
                  return (
                    <tr key={name}>
                      <td style={{ fontWeight: 'bold', color: '#0076c8' }}>{name}</td>
                      <td>{jan.closed}</td><td>{jan.open}</td><td>{jan.rejected}</td><td>{jan.stopclock}</td><td style={{ background: '#f9f9f9', fontWeight: 'bold' }}>{jan.count}</td>
                      <td>{feb.closed}</td><td>{feb.open}</td><td>{feb.rejected}</td><td>{feb.stopclock}</td><td style={{ background: '#f9f9f9', fontWeight: 'bold' }}>{feb.count}</td>
                      <td>{mar.closed}</td><td>{mar.open}</td><td>{mar.rejected}</td><td>{mar.resolved}</td><td>{mar.stopclock}</td><td style={{ background: '#f9f9f9', fontWeight: 'bold' }}>{mar.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Matrix Infra Section */}
        <div>
          <h4 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '12px', color: '#333' }}>Matrix Infra Initial-requeststatus 2026</h4>
          <div className="table-legacy-wrap" style={{ margin: 0 }}>
            <table className="table-legacy">
              <thead>
                <tr style={{ background: '#eef3f7' }}>
                  <th rowSpan={2} style={{ width: '200px' }}>2026</th>
                  <th colSpan={4} style={{ textAlign: 'center', background: '#e1f0ff' }}>Jan</th>
                  <th colSpan={4} style={{ textAlign: 'center', background: '#e1f0ff' }}>Feb</th>
                  <th colSpan={5} style={{ textAlign: 'center', background: '#e1f0ff' }}>Mar</th>
                  <th colSpan={4} style={{ textAlign: 'center', background: '#e1f0ff' }}>Apr</th>
                </tr>
                <tr style={{ background: '#f2f5f7' }}>
                  <th>Closed</th><th>Rejected</th><th>StopClock</th><th>Count</th>
                  <th>Closed</th><th>Rejected</th><th>StopClock</th><th>Count</th>
                  <th>Closed</th><th>Rejected</th><th>Resolved</th><th>StopClock</th><th>Count</th>
                  <th>Closed</th><th>Open</th><th>Rejected</th><th>Count</th>
                </tr>
              </thead>
              <tbody>
                {infraTechNames.map(name => {
                  const jan = getStatsForTech(name, 0);
                  const feb = getStatsForTech(name, 1);
                  const mar = getStatsForTech(name, 2);
                  const apr = getStatsForTech(name, 3);
                  return (
                    <tr key={name}>
                      <td style={{ fontWeight: 'bold', color: '#0076c8' }}>{name}</td>
                      <td>{jan.closed}</td><td>{jan.rejected}</td><td>{jan.stopclock}</td><td style={{ background: '#f9f9f9', fontWeight: 'bold' }}>{jan.count}</td>
                      <td>{feb.closed}</td><td>{feb.rejected}</td><td>{feb.stopclock}</td><td style={{ background: '#f9f9f9', fontWeight: 'bold' }}>{feb.count}</td>
                      <td>{mar.closed}</td><td>{mar.rejected}</td><td>{mar.resolved}</td><td>{mar.stopclock}</td><td style={{ background: '#f9f9f9', fontWeight: 'bold' }}>{mar.count}</td>
                      <td>{apr.closed}</td><td>{apr.open}</td><td>{apr.rejected}</td><td style={{ background: '#f9f9f9', fontWeight: 'bold' }}>{apr.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

