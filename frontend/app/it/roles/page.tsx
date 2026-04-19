'use client';

import React, { useEffect, useState } from 'react';
import { RoleModuleView } from '../../components/RoleModuleView';
import { apiFetch } from '@/lib/api';

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchData() {
    try {
      const [rolesData, usersData] = await Promise.all([
        apiFetch('/roles'),
        apiFetch('/users')
      ]);
      setRoles(rolesData || []);
      setUsers(usersData || []);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <main style={{ background: '#fff', minHeight: 'calc(100vh - 40px)' }}>
      <RoleModuleView 
        roles={roles} 
        users={users}
        loading={loading} 
        onRefresh={fetchData} 
      />
    </main>
  );
}
