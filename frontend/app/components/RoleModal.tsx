'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: any;
  users: any[];
}

const AVAILABLE_MODULES = [
  'Dashboard', 'Requests', 'Problems', 'Changes', 'Solutions', 'Assets', 'Reports'
];

export function RoleModal({ isOpen, onClose, onSuccess, editData, users }: RoleModalProps) {
  const [name, setName] = useState('');
  const [assignedTo, setAssignedTo] = useState('OtherSurrounding Apps');
  const [initial, setInitial] = useState('');
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setName(editData.name || '');
      setAssignedTo(editData.assigned_to || 'OtherSurrounding Apps');
      setInitial(editData.initial || '');
      setPermissions(editData.permissions || []);
    } else {
      setName('');
      setAssignedTo('OtherSurrounding Apps');
      setInitial('');
      setPermissions([]);
    }
  }, [editData, isOpen]);

  if (!isOpen) return null;

  const isSystemRole = editData && ['Administrator', 'Technician', 'User'].includes(editData.name);

  const togglePermission = (module: string) => {
    setPermissions(prev => 
      prev.includes(module) ? prev.filter(m => m !== module) : [...prev, module]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = editData ? `/roles/${editData.id}` : '/roles';
      const method = editData ? 'PATCH' : 'POST';
      
      await apiFetch(url, {
        method,
        body: JSON.stringify({
          name,
          assigned_to: assignedTo,
          initial,
          permissions
        })
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to save role:", error);
      alert("Failed to save role. Please ensure the name is unique.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal-container-legacy">
        <div className="modal-header">
          <h3>{editData ? 'Edit Role' : '+ Add New Role'}</h3>
          <button onClick={onClose} className="close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Role Name <span className="required">*</span></label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Technician Level 1" 
              required
              disabled={isSubmitting || isSystemRole}
              className="legacy-input"
            />
            {isSystemRole && <p style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>System roles cannot be renamed.</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label>Assigned To</label>
              <select 
                className="legacy-select"
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="OtherSurrounding Apps">OtherSurrounding Apps</option>
              </select>
            </div>
            <div className="form-group">
              <label>Inisial</label>
              <select 
                className="legacy-select"
                value={initial}
                onChange={e => setInitial(e.target.value)}
                disabled={isSubmitting}
              >
                <option value="">-- Select Technician --</option>
                {users.map(u => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label style={{ marginBottom: '12px', display: 'block' }}>Module Access (Permissions)</label>
            <div className="checkbox-grid">
              {AVAILABLE_MODULES.map(mod => (
                <label key={mod} className="checkbox-item">
                  <input 
                    type="checkbox"
                    checked={permissions.includes(mod)}
                    onChange={() => togglePermission(mod)}
                    disabled={isSubmitting}
                  />
                  <span>{mod}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-save">
              {isSubmitting ? 'Saving...' : 'Save Role'}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          z-index: 10000;
        }
        .modal-container-legacy {
          position: fixed;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 500px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
          z-index: 10001;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .modal-header {
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-header h3 { margin: 0; font-size: 16px; font-weight: 700; color: #1e293b; }
        .close-btn { background: none; border: none; font-size: 24px; cursor: pointer; color: #94a3b8; }
        .modal-body { padding: 20px; }
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 13px; font-weight: 600; color: #475569; margin-bottom: 6px; }
        .required { color: #e53e3e; }
        .legacy-input, .legacy-select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #cbd5e1;
          border-radius: 4px;
          font-size: 13px;
          outline: none;
        }
        .legacy-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 2px rgba(59,130,246,0.1); }
        .checkbox-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 12px;
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          border-radius: 6px;
        }
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #475569;
          cursor: pointer;
        }
        .checkbox-item input:disabled { cursor: not-allowed; }
        .modal-footer {
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: 12px;
        }
        .btn-cancel { background: #fff; border: 1px solid #cbd5e1; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; color: #475569; }
        .btn-save { background: #3b82f6; color: #fff; border: none; padding: 8px 24px; border-radius: 4px; cursor: pointer; font-weight: 600; }
        .btn-save:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </>
  );
}
