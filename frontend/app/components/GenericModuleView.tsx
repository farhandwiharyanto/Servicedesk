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
    <div className="module-view-container animate-fade-in" style={{ padding: '0' }}>
      {/* Module Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ 
            width: '44px', height: '44px', borderRadius: '14px', background: `${accentColor}10`, 
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 16px ${accentColor}15`,
            border: `1px solid ${accentColor}30`
          }}>
            <NavIcon name={icon} color={accentColor} size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>{title}</h2>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 500 }}>Management of {title.toLowerCase()} records</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {onAddClick && (
            <button 
              className="btn" 
              onClick={onAddClick}
              style={{ 
                background: accentColor, color: '#fff', border: 'none', 
                borderRadius: '10px', padding: '10px 20px', fontWeight: 700, fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '8px', boxShadow: `0 10px 15px -3px ${accentColor}30`
              }}
            >
              <NavIcon name="plus" size={14} color="#fff" />
              {primaryActionLabel}
            </button>
          )}
          <button className="action-icon-btn" style={{ padding: '10px' }}>
            <NavIcon name="search" size={16} />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="modern-table-wrap">
        <div style={{ overflowX: 'auto' }}>
          <table className="modern-grid-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr key={item.id || idx}>
                    {columns.map(col => (
                      <td key={col.key}>
                        <div style={{ fontWeight: col.key === 'subject' || col.key === 'name' ? 700 : 500 }}>
                          {col.render ? col.render(item[col.key], item) : item[col.key]}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '80px', background: '#fff' }}>
                    <div style={{ opacity: 0.1, marginBottom: '16px' }}>
                      <NavIcon name={icon} size={64} />
                    </div>
                    <p style={{ fontWeight: 800, color: 'var(--text-muted)', fontSize: '16px' }}>No {title} Records Found</p>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Adjust your filters or add a new record to get started.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #f1f5f9', background: '#fafafa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700 }}>SHOWING {data.length} ENTRIES</span>
           <div style={{ display: 'flex', gap: '8px' }}>
              <button className="action-icon-btn" style={{ fontSize: '11px', fontWeight: 800, width: 'auto', padding: '0 12px' }}>Previous</button>
              <button className="action-icon-btn" style={{ fontSize: '11px', fontWeight: 800, width: 'auto', padding: '0 12px' }}>Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
