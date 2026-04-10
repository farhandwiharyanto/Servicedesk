'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ModuleToolbar } from './ModuleToolbar';

interface CIClientViewProps {
  cis: any[];
}

export function CIClientView({ cis: initialCis }: CIClientViewProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <ModuleToolbar 
        moduleName="CI" 
        onNew={() => alert('New Configuration Item form coming soon.')}
        onImport={() => alert('CI Discovery feature coming soon.')}
      />

      <div className="enterprise-table-wrapper-zoho">
        <table className="zoho-table">
          <thead>
            <tr>
              <th style={{ width: '30px' }}><input type="checkbox" /></th>
              <th style={{ width: '400px' }}>CI Name</th>
              <th>CI Type</th>
              <th>Status</th>
              <th>Created Date</th>
            </tr>
          </thead>
          <tbody>
            {initialCis.map((ci: any) => (
              <tr key={ci.id}>
                <td><input type="checkbox" /></td>
                <td className="subject-cell">
                  <Link href={`/cmdb/${ci.id}`} className="zoho-link-bold">
                    {ci.name}
                  </Link>
                </td>
                <td>{ci.type.name}</td>
                <td>
                  <span className="z-status stat-resolved">Operational</span>
                </td>
                <td>{new Date(ci.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
