'use client';

import React, { useState } from 'react';
import { apiFetch } from '@/lib/api';
import { NavIcon } from './NavIcon';
import { FormattedDate } from './FormattedDate';
import Link from 'next/link';

interface ProblemInvestigationTabsProps {
  problem: any;
  user: any;
}

export function ProblemInvestigationTabs({ problem: initialProblem, user }: ProblemInvestigationTabsProps) {
  const [activeTab, setActiveTab] = useState('investigation');
  const [problem, setProblem] = useState(initialProblem);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  
  // Local form state
  const [formData, setFormData] = useState({
    root_cause: problem.root_cause || '',
    workaround: problem.workaround || '',
    permanent_solution: problem.permanent_solution || '',
    symptoms: problem.symptoms || '',
    impact_analysis: problem.impact_analysis || '',
  });

  const isTechnician = user?.role === 'technician';

  const handleSave = async () => {
    setLoading(true);
    try {
      const updated = await apiFetch(`/tickets/problem/${problem.id}`, {
        method: 'PATCH',
        body: JSON.stringify(formData)
      });
      setProblem({ ...problem, ...updated });
      setEditing(false);
    } catch (err) {
      alert('Gagal menyimpan data investigasi.');
    } finally {
      setLoading(false);
    }
  };

  const publishToKb = async () => {
    if (!problem.workaround) {
      alert('Harap isi Workaround terlebih dahulu sebelum publikasi.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch(`/tickets/problem/${problem.id}/publish`, { method: 'POST' });
      alert(res.message || 'Berhasil dipublikasikan!');
    } catch (err: any) {
      alert(err.message || 'Gagal publikasi ke KB.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card glass-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(59,130,246,0.1)' }}>
      {/* Tabs Header */}
      <div style={{ display: 'flex', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
        {['investigation', 'incidents'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              padding: '16px 24px', fontSize: '13px', fontWeight: 700, border: 'none',
              background: activeTab === t ? '#fff' : 'transparent',
              color: activeTab === t ? 'var(--primary)' : '#64748b',
              borderBottom: activeTab === t ? '2px solid var(--primary)' : 'none',
              cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.5px'
            }}
          >
            {t === 'investigation' ? '🔬 Investigation' : `🔗 Linked Incidents (${problem.requests?.length || 0})`}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px' }}>
        {activeTab === 'investigation' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Action Bar for Technicians */}
            {isTechnician && (
               <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  {!editing ? (
                    <>
                      <button onClick={publishToKb} disabled={loading} className="btn btn-secondary" style={{ fontSize: '12px', padding: '8px 16px' }}>
                        🌐 Mark as Known Error
                      </button>
                      <button onClick={() => setEditing(true)} className="btn btn-primary" style={{ fontSize: '12px', padding: '8px 16px' }}>
                        ✏️ Edit Analysis
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => setEditing(false)} className="btn btn-muted" style={{ fontSize: '12px', padding: '8px 16px' }}>Cancel</button>
                      <button onClick={handleSave} disabled={loading} className="btn btn-primary" style={{ fontSize: '12px', padding: '8px 16px' }}>
                        {loading ? 'Saving...' : '💾 Save Investigation'}
                      </button>
                    </>
                  )}
               </div>
            )}

            {/* Analysis Fields */}
            <div style={{ display: 'grid', gap: '20px' }}>
              <InvestigationField 
                label="Symptoms" 
                value={formData.symptoms} 
                editing={editing} 
                onChange={v => setFormData({...formData, symptoms: v})} 
                placeholder="Describe current symptoms..." 
              />
              <InvestigationField 
                label="Impact Analysis" 
                value={formData.impact_analysis} 
                editing={editing} 
                onChange={v => setFormData({...formData, impact_analysis: v})} 
                placeholder="Business impact details..." 
              />
              <InvestigationField 
                label="Root Cause" 
                value={formData.root_cause} 
                editing={editing} 
                onChange={v => setFormData({...formData, root_cause: v})} 
                placeholder="Identify the underlying cause..." 
                important
              />
              <InvestigationField 
                label="Workaround (Solusi Sementara)" 
                value={formData.workaround} 
                editing={editing} 
                onChange={v => setFormData({...formData, workaround: v})} 
                placeholder="Temporary fix for users..." 
                highlight
              />
              <InvestigationField 
                label="Permanent Solution" 
                value={formData.permanent_solution} 
                editing={editing} 
                onChange={v => setFormData({...formData, permanent_solution: v})} 
                placeholder="Final structural fix..." 
              />
            </div>
          </div>
        )}

        {activeTab === 'incidents' && (
          <div className="animate-fade-in">
             <table className="table-legacy">
                <thead style={{ background: '#f8fafc' }}>
                  <tr><th>Ticket ID</th><th>Subject</th><th>Requester</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {problem.requests?.map((req: any) => (
                    <tr key={req.id}><td style={{ fontWeight: 700, color: 'var(--primary)' }}>#{req.id.slice(-5).toUpperCase()}</td><td><Link href={`/it/requests/${req.id}`} style={{ textDecoration: 'none', color: '#1e293b' }}>{req.subject}</Link></td><td>{req.requester?.name}</td><td><span className={`premium-pill premium-pill-${req.status?.type.toLowerCase() === 'open' ? 'primary' : 'success'}`}>{req.status?.name}</span></td></tr>
                  ))}
                  {(!problem.requests || problem.requests.length === 0) && (
                    <tr><td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>No incidents linked to this problem.</td></tr>
                  )}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
}

function InvestigationField({ label, value, editing, onChange, placeholder, important = false, highlight = false }: any) {
  return (
    <div style={{ padding: highlight ? '16px' : '0', background: highlight ? 'rgba(5, 150, 105, 0.03)' : 'transparent', borderRadius: '12px', border: highlight ? '1px dashed #10b981' : 'none' }}>
      <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: important ? 'var(--primary)' : '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>
        {label}
      </label>
      {editing ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', minHeight: '80px', fontSize: '14px', outline: 'none' }}
        />
      ) : (
        <div style={{ fontSize: '14px', color: value ? '#1e293b' : '#94a3b8', fontStyle: value ? 'normal' : 'italic', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
          {value || 'Not analyzed yet.'}
        </div>
      )}
    </div>
  );
}
