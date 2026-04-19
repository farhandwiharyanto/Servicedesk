'use client';

import React, { useState } from 'react';
import { NavIcon } from './NavIcon';
import { RoleModal } from './RoleModal';
import { apiFetch } from '@/lib/api';

interface RoleModuleViewProps {
  roles: any[];
  users: any[];
  loading: boolean;
  onRefresh: () => void;
}

export function RoleModuleView({ roles, users, loading, onRefresh }: RoleModuleViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);

  const handleCreate = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEdit = (role: any) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDelete = async (role: any) => {
    // Protection for system roles
    const systemRoles = ['Administrator', 'Technician', 'User'];
    if (systemRoles.includes(role.name)) {
      alert(`System role "${role.name}" cannot be deleted.`);
      return;
    }

    if (confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      try {
        await apiFetch(`/roles/${role.id}`, { method: 'DELETE' });
        onRefresh();
      } catch (error) {
        console.error("Failed to delete role:", error);
        alert("Failed to delete role. It might be in use.");
      }
    }
  };

  return (
    <div className="role-module-container">
      {/* Toolbar */}
      <div className="legacy-toolbar">
         <div className="toolbar-left">
            <h2 className="module-title">Roles</h2>
         </div>
         <div className="toolbar-right">
            <button className="legacy-btn-primary" onClick={handleCreate}>
               + New Role
            </button>
            <button className="legacy-btn" onClick={onRefresh}>
               Refresh
            </button>
         </div>
      </div>

      {/* Table Section */}
      <div className="table-legacy-wrap">
        <table className="table-legacy">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>No</th>
              <th>Role Name</th>
              <th>Assigned To</th>
              <th>Inisial</th>
              <th>Accessible Modules</th>
              <th style={{ width: '100px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>Loading roles...</td>
              </tr>
            ) : roles.length > 0 ? (
              roles.map((role, idx) => {
                const isSystem = ['Administrator', 'Technician', 'User'].includes(role.name);
                return (
                  <tr key={role.id}>
                    <td style={{ color: '#888' }}>{idx + 1}</td>
                    <td style={{ fontWeight: 'bold' }}>{role.name}</td>
                    <td>{role.assigned_to || '--'}</td>
                    <td>{role.initial || '--'}</td>
                    <td style={{ maxWidth: '300px' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {role.permissions?.map((p: string) => (
                          <span key={p} className="badge-light">{p}</span>
                        )) || <span style={{ color: '#ccc' }}>None</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button 
                          onClick={() => handleEdit(role)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#3b82f6' }}
                          title="Edit Role"
                        >
                          <NavIcon name="edit" size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(role)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            cursor: isSystem ? 'not-allowed' : 'pointer', 
                            color: isSystem ? '#cbd5e1' : '#e53e3e' 
                          }}
                          title={isSystem ? "System role cannot be deleted" : "Delete Role"}
                          disabled={isSystem}
                        >
                          <NavIcon name="trash" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#999' }}>No roles defined yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <RoleModal 
        isOpen={isModalOpen} 
        editData={selectedRole}
        users={users}
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          setIsModalOpen(false);
          onRefresh();
        }}
      />

      <style jsx>{`
        .role-module-container {
          display: flex;
          flex-direction: column;
        }
        .legacy-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 20px;
          background: #fff;
          border-bottom: 1px solid #e1e5eb;
          height: 50px;
        }
        .module-title {
          font-size: 16px;
          font-weight: 800;
          color: #1a202c;
          margin: 0;
        }
        .legacy-btn-primary {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 6px 16px;
          font-size: 13px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
        }
        .legacy-btn {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 6px 12px;
          font-size: 13px;
          border-radius: 4px;
          margin-left: 8px;
          cursor: pointer;
        }
        .badge-light {
          background: #f1f5f9;
          color: #475569;
          font-size: 11px;
          padding: 2px 8px;
          border-radius: 99px;
          border: 1px solid #e2e8f0;
        }
        .table-legacy tr:hover {
          background: #f8fafc;
        }
      `}</style>
    </div>
  );
}
