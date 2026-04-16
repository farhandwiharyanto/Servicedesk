'use client';

import React from 'react';
import { NavIcon } from './NavIcon';
import { FormattedDate } from './FormattedDate';

interface Column {
  key: string;
  label: string;
  render?: (value: any, item: any) => React.ReactNode;
}

interface GenericModuleViewProps {
  title: string;
  icon: any;
  accentColor: string;
  columns: Column[];
  data: any[];
  onAddClick?: () => void;
  primaryActionLabel?: string;
}

export function GenericModuleView({
  title,
  icon,
  accentColor,
  columns,
  data,
  onAddClick,
  primaryActionLabel = 'Add New'
}: GenericModuleViewProps) {
  return (
    <div className="module-view-container animate-fade-in" style={{ padding: '0 20px' }}>
      {/* Module Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '40px', height: '40px', borderRadius: '12px', background: `${accentColor}15`, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 4px 12px ${accentColor}20`
          }}>
            <NavIcon name={icon} color={accentColor} size={20} />
          </div>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '24px', fontWeight: 800 }}>{title}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px' }}>Overview of records and activities</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {onAddClick && (
            <button 
              className="btn" 
              onClick={onAddClick}
              style={{ 
                background: accentColor, color: '#fff', border: 'none', 
                borderRadius: '12px', padding: '10px 20px', fontWeight: 700, fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: `0 4px 12px ${accentColor}40`
              }}
            >
              <NavIcon name="plus" size={14} color="#fff" />
              {primaryActionLabel}
            </button>
          )}
          <button className="action-icon-btn glass-card" style={{ padding: '10px' }}>
            <NavIcon name="search" size={16} />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="card glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(241, 245, 249, 0.5)', borderBottom: '1px solid #f1f5f9' }}>
                {columns.map(col => (
                  <th key={col.key} style={{ padding: '16px', fontSize: '11px', fontWeight: 800, color: 'var(--text-muted)', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody style={{ background: '#fff' }}>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr key={item.id || idx} className="hover-row" style={{ borderBottom: '1px solid #f8fafc', transition: 'all 0.2s' }}>
                    {columns.map(col => (
                      <td key={col.key} style={{ padding: '16px', fontSize: '14px', color: '#334155' }}>
                        {col.render ? col.render(item[col.key], item) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '64px', color: 'var(--text-muted)' }}>
                    <div style={{ opacity: 0.2, marginBottom: '16px' }}>
                      <NavIcon name="search" size={48} />
                    </div>
                    <p style={{ fontWeight: 600 }}>No records found in this module.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', background: 'rgba(248, 250, 252, 0.5)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Total: {data.length} records found</span>
           <div style={{ display: 'flex', gap: '8px' }}>
              <button className="glass-card" style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: '1px solid #e2e8f0' }}>Previous</button>
              <button className="glass-card" style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, cursor: 'pointer', border: '1px solid #e2e8f0' }}>Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
