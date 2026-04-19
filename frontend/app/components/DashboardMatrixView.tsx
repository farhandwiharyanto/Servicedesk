'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch, endpoints } from '@/lib/api';
import { DashboardActionModal } from './DashboardActionModal';
import { NavIcon } from './NavIcon';

export function DashboardMatrixView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tab yang dipertahankan sesuai permintaan user
  const tabs = ["ITBP L1 Performance"];

  useEffect(() => {
    async function loadData() {
      try {
        const response = await apiFetch(endpoints.dashboard);
        setData(response);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatsForTech = (techName: string, monthNumber: number) => {
    const stats = { closed: 0, open: 0, rejected: 0, stopclock: 0, count: 0, resolved: 0 };
    if (!data?.performance_matrix) return stats;

    const techStats = data.performance_matrix.filter((m: any) => m.technician_name === techName && m.month === monthNumber);
    
    techStats.forEach((s: any) => {
      stats.count += parseInt(s.total);
      if (s.status_type === 'CLOSED') stats.closed = parseInt(s.total);
      else if (s.status_type === 'OPEN' || s.status_type === 'IN_PROGRESS') stats.open += parseInt(s.total);
      else if (s.status_type === 'RESOLVED') stats.resolved = parseInt(s.total);
      else if (s.status_type === 'ON_HOLD') stats.stopclock = parseInt(s.total);
      else if (s.status_type === 'REJECTED') stats.rejected = parseInt(s.total);
    });

    return stats;
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: 'var(--primary)', fontWeight: 700 }}>🔄 Memuat Smart Dashboard...</div>;

  const realTechnicians = data?.technicians || [];

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* Premium Dashboard Header */}
      <div className="sub-header-modern" style={{ padding: '16px 24px 0 24px', borderRadius: '0', borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--grad-primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)' }}>
              <NavIcon name="dashboard" color="#fff" size={22} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>IT Portal Management Dashboard</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Performance Monitoring</span>
                <span style={{ width: '6px', height: '6px', background: '#10b981', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <button className="action-icon-btn" style={{ width: '36px', height: '36px' }}>
                 <NavIcon name="history" size={16} />
               </button>
               <button 
                  onClick={() => setIsModalOpen(true)}
                  className="btn btn-primary" 
                  style={{ padding: '8px 20px', borderRadius: '10px' }}
               >
                  <NavIcon name="plus" size={14} color="#fff" />
                  Generate Report
               </button>
          </div>
        </div>

        {/* Sub Tabs restored as per screenshot */}
        <div style={{ display: 'flex', gap: '32px' }}>
          <div style={{ 
            padding: '0 4px 12px 4px', fontSize: '14px', fontWeight: 800, color: 'var(--primary)', 
            borderBottom: '3px solid var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
          }}>
            <NavIcon name="history" size={16} />
            My View
          </div>
          <div style={{ 
            padding: '0 4px 12px 4px', fontSize: '14px', fontWeight: 600, color: 'var(--text-muted)', 
            borderBottom: '3px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' 
          }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}>
            <NavIcon name="assets" size={16} />
            Scheduler
          </div>
        </div>
      </div>

      <div style={{ padding: '32px' }}>
        
        {/* Performance Matrix Card */}
        <div className="modern-card" style={{ marginBottom: '32px' }}>
          <div className="modern-card-header" style={{ background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <NavIcon name="requests" size={18} color="var(--primary)" />
              <h2 className="modern-card-title">ServiceDesk KPIs • Q1 2026</h2>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ padding: '4px 12px', background: '#f1f5f9', borderRadius: '6px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>ITBP L1 GROUP</span>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="modern-grid-table" style={{ width: '100%', border: 'none' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '16px 24px', borderRight: '1px solid #f1f5f9', width: '250px' }}>Lead Technician</th>
                  <th colSpan={5} style={{ textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)', borderRight: '1px solid #f1f5f9' }}>JANUARY</th>
                  <th colSpan={5} style={{ textAlign: 'center', background: 'rgba(59, 130, 246, 0.02)', borderRight: '1px solid #f1f5f9' }}>FEBRUARY</th>
                  <th colSpan={6} style={{ textAlign: 'center', background: 'rgba(59, 130, 246, 0.05)' }}>MARCH (CURRENT)</th>
                </tr>
                <tr style={{ background: '#fafafa', fontSize: '10px' }}>
                  <th style={{ borderRight: '1px solid #f1f5f9' }}></th>
                  {/* JAN */}
                  <th style={{ color: '#059669' }}>CLS</th><th style={{ color: '#2563eb' }}>OPN</th><th style={{ color: '#dc2626' }}>REJ</th><th style={{ color: '#d97706' }}>HLD</th><th style={{ background: '#f1f5f9', fontWeight: 800 }}>TTL</th>
                  {/* FEB */}
                  <th style={{ color: '#059669' }}>CLS</th><th style={{ color: '#2563eb' }}>OPN</th><th style={{ color: '#dc2626' }}>REJ</th><th style={{ color: '#d97706' }}>HLD</th><th style={{ background: '#f1f5f9', fontWeight: 800 }}>TTL</th>
                  {/* MAR */}
                  <th style={{ color: '#059669' }}>CLS</th><th style={{ color: '#2563eb' }}>OPN</th><th style={{ color: '#dc2626' }}>REJ</th><th style={{ color: '#0891b2' }}>RES</th><th style={{ color: '#d97706' }}>HLD</th><th style={{ background: '#f1f5f9', fontWeight: 800 }}>TTL</th>
                </tr>
              </thead>
              <tbody>
                {realTechnicians.map((tech: any) => {
                  const jan = getStatsForTech(tech.name, 1);
                  const feb = getStatsForTech(tech.name, 2);
                  const mar = getStatsForTech(tech.name, 3);
                  return (
                    <tr key={tech.id}>
                      <td style={{ fontWeight: 700, color: 'var(--text-main)', padding: '16px 24px', borderRight: '1px solid #f1f5f9', background: '#fff' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary-glow)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{tech.name[0]}</div>
                          {tech.name}
                        </div>
                      </td>
                      {/* JAN */}
                      <td style={{ color: '#059669', fontWeight: 600 }}>{jan.closed}</td><td>{jan.open}</td><td>{jan.rejected}</td><td>{jan.stopclock}</td><td style={{ background: '#f8fafc', fontWeight: 800, color: 'var(--text-main)' }}>{jan.count}</td>
                      {/* FEB */}
                      <td style={{ color: '#059669', fontWeight: 600 }}>{feb.closed}</td><td>{feb.open}</td><td>{feb.rejected}</td><td>{feb.stopclock}</td><td style={{ background: '#f8fafc', fontWeight: 800, color: 'var(--text-main)' }}>{feb.count}</td>
                      {/* MAR */}
                      <td style={{ color: '#059669', fontWeight: 600 }}>{mar.closed}</td><td>{mar.open}</td><td>{mar.rejected}</td><td style={{ color: '#0891b2', fontWeight: 600 }}>{mar.resolved}</td><td>{mar.stopclock}</td><td style={{ background: '#f8fafc', fontWeight: 800, color: 'var(--text-main)' }}>{mar.count}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Info Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #1e293b, #0f172a)', padding: '24px', 
          borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '24px'
        }}>
           <div style={{ width: '56px', height: '56px', background: 'rgba(255,255,255,0.1)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <NavIcon name="solutions" size={28} color="#3b82f6" />
           </div>
           <div style={{ flex: 1 }}>
             <h5 style={{ margin: '0 0 4px 0', fontSize: '16px', fontWeight: 800 }}>Insight & Analytics Dashboard</h5>
             <p style={{ margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>
               Matrix performa di atas diambil langsung dari repositori **ServiceDesk Reports**. 
               Sistem kini secara otomatis menghitung SLA dan resolusi level 3 untuk setiap teknisi ITBP L1.
             </p>
           </div>
           <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}>
             Explore Detailed Analytics
           </button>
        </div>
      </div>

      <DashboardActionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        folders={data?.report_folders || []} 
      />
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
}
