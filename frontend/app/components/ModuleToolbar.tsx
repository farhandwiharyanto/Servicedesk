'use client';

import React, { useState } from 'react';
import { NavIcon } from './NavIcon';

interface ModuleToolbarProps {
  moduleName: string;
  onNew?: () => void;
  onImport?: () => void;
  onAction?: (actionId: string) => void;
  selectedCount?: number;
}

export function ModuleToolbar({ 
  moduleName, 
  onNew, 
  onImport, 
  onAction,
  selectedCount = 0
}: ModuleToolbarProps) {
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  const actions = [
    { id: 'assign', name: 'Assign' },
    { id: 'close', name: 'Close' },
    { id: 'delete', name: 'Delete', critical: true },
  ];

  return (
    <div className="table-actions-top">
      <div className="selection-actions">
        <div className="action-button-group">
          <div className={`dropdown-wrapper ${isActionsOpen ? 'open' : ''}`}>
            <button 
              className="btn-ghost-enterprise" 
              onClick={() => setIsActionsOpen(!isActionsOpen)}
              disabled={selectedCount === 0}
            >
              Actions {selectedCount > 0 && `(${selectedCount})`} <span className="chevron-down" />
            </button>
            {isActionsOpen && (
              <div className="zoho-dropdown-menu">
                {actions.map(action => (
                  <div 
                    key={action.id} 
                    className={`dropdown-item ${action.critical ? 'text-danger' : ''}`}
                    onClick={() => {
                      onAction?.(action.id);
                      setIsActionsOpen(false);
                    }}
                  >
                    {action.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {onImport && (
            <button className="btn-ghost-enterprise" onClick={onImport}>
              Import
            </button>
          )}
        </div>
      </div>

      <div className="view-mode-icons">
        <button className="btn-zoho-primary" onClick={onNew}>
          + New {moduleName}
        </button>
      </div>
    </div>
  );
}
