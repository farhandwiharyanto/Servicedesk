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
    <div className="module-view-container">
      {/* Module Header */}
      <div className="sub-header-modern" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '8px', 
            background: `${accentColor}15`, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <NavIcon name={icon} color={accentColor} size={18} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)' }}>{title}</h2>
        </div>

        <div className="actions">
          {onAddClick && (
            <button 
              className="btn btn-primary" 
              onClick={onAddClick}
              style={{ background: accentColor, borderColor: accentColor }}
            >
              <NavIcon name="plus" size={14} color="#fff" />
              {primaryActionLabel}
            </button>
          )}
          
          <div className="divider" />

          <button className="action-icon-btn" title="Filter">
            <NavIcon name="search" size={16} />
          </button>
          <button className="action-icon-btn" title="More">
            <NavIcon name="cmdb" size={16} />
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none', borderRadius: '0' }}>
          <table className="modern-table">
            <thead>
              <tr>
                {columns.map(col => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, idx) => (
                  <tr key={item.id || idx}>
                    {columns.map(col => (
                      <td key={col.key}>
                        {col.render ? col.render(item[col.key], item) : item[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    <div style={{ opacity: 0.5, marginBottom: '12px' }}>
                      <NavIcon name="search" size={32} />
                    </div>
                    No records found in this module.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border-subtle)', background: '#fcfcfc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Showing {data.length} records</span>
           <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#fff', fontSize: '11px', cursor: 'pointer' }}>Previous</button>
              <button style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: '#fff', fontSize: '11px', cursor: 'pointer' }}>Next</button>
           </div>
        </div>
      </div>
    </div>
  );
}
