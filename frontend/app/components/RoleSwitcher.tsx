'use client';

import React from 'react';
import { switchRole } from '../actions/auth';

interface RoleSwitcherProps {
  currentEmail: string;
}

export function RoleSwitcher({ currentEmail }: RoleSwitcherProps) {
  const roles = [
    { name: 'System Admin', email: 'admin@servicedesk.com' },
    { name: 'Technician', email: 'tech1@servicedesk.com' },
    { name: 'Requester', email: 'user1@servicedesk.com' },
  ];

  return (
    <div className="role-switcher">
      <label>Switch Role (Demo)</label>
      <select 
        value={currentEmail} 
        onChange={(e) => switchRole(e.target.value)}
        className="glass"
      >
        {roles.map(r => (
          <option key={r.email} value={r.email}>{r.name}</option>
        ))}
      </select>
    </div>
  );
}
