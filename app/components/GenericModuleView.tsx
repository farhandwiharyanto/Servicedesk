'use client';

import React, { useState } from 'react';
import { ModuleToolbar } from './ModuleToolbar';

interface GenericModuleViewProps {
  moduleName: string;
  headers: string[];
  data: any[]; 
}

export function GenericModuleView({ moduleName, headers, data }: GenericModuleViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleAll = () => {
    if (selectedIds.length === data.length && data.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(data.map(item => item.id || item.name || String(Math.random())));
    }
  };

  const toggleOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAction = (actionId: string) => {
    if (actionId === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedIds.length} items from ${moduleName}?`)) {
        alert(`Bulk delete for ${selectedIds.length} items in ${moduleName} triggered. Server implementation pending.`);
        setSelectedIds([]);
      }
    } else {
      alert(`Action "${actionId}" triggered for ${selectedIds.length} items.`);
    }
  };

  return (
    <>
      <ModuleToolbar 
        moduleName={moduleName} 
        onNew={() => alert(`New ${moduleName} form coming soon.`)}
        selectedCount={selectedIds.length}
        onAction={handleAction}
      />

      <div className="enterprise-table-wrapper-zoho">
        <table className="zoho-table">
          <thead>
            <tr>
              <th style={{ width: '30px' }}>
                <input 
                  type="checkbox" 
                  checked={data.length > 0 && selectedIds.length === data.length}
                  onChange={toggleAll}
                />
              </th>
              {headers.map(h => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? data.map((item, idx) => {
              const itemId = item.id || `row-${idx}`;
              // Display logic: show all non-id fields
              const rowData = Object.entries(item).filter(([k]) => k !== 'id');

              return (
                <tr key={itemId} className={selectedIds.includes(itemId) ? 'selected-row' : ''}>
                  <td>
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(itemId)}
                      onChange={() => toggleOne(itemId)}
                    />
                  </td>
                  {rowData.map(([key, val]: [string, any], i) => (
                    <td key={i}>{String(val)}</td>
                  ))}
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={headers.length + 1} className="empty-table-msg">
                   No {moduleName.toLowerCase()}s found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
