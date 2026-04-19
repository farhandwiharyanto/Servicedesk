'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { NavIcon } from './NavIcon';

interface FilterSidebarProps {
  statusFilters: {
    name: string;
    count: number;
    type: string;
    icon?: string;
    color?: string;
  }[];
}

export function FilterSidebar({ statusFilters }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get('status') || 'OPEN';

  const handleFilterClick = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('status', type);
    router.push(`/it/requests?${params.toString()}`);
  };

  // Divide filters into primary (Summary) and secondary (Problems/Changes)
  const summaryFilters = statusFilters.filter(f => !['APPROVED_CHANGES', 'OPEN_PROBLEMS', 'UNASSIGNED_PROBLEMS'].includes(f.type));
  const additionalFilters = statusFilters.filter(f => ['APPROVED_CHANGES', 'OPEN_PROBLEMS', 'UNASSIGNED_PROBLEMS'].includes(f.type));

  return (
    <aside style={{ 
      width: '300px', background: '#fdfdfd', borderRight: '1px solid #e5e7eb', 
      display: 'flex', flexDirection: 'column', height: '100%' 
    }}>
      <div style={{ border: '1px solid #e5e7eb', margin: '16px', borderRadius: '4px', overflow: 'hidden', background: '#fff' }}>
        {/* Header */}
        <div style={{ 
          padding: '12px 16px', borderBottom: '1px solid #eee', background: '#fdfdfd',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <NavIcon name="folder" size={18} color="#64748b" />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#334155' }}>My Summary</span>
        </div>

        {/* Filters */}
        <div style={{ padding: '8px 0' }}>
          {statusFilters.map((filter) => {
            const isActive = currentStatus === filter.type;
            const isOverdue = filter.type === 'OVERDUE';
            const iconName = filter.type === 'RESOLVED' ? 'checkDouble' : 'folder';
            const iconColor = isActive ? '#3b82f6' : '#94a3b8';
            
            return (
              <div 
                key={filter.name} 
                onClick={() => handleFilterClick(filter.type)}
                style={{ 
                  padding: '10px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: isActive ? '#f0f7ff' : 'transparent',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <NavIcon name={iconName} size={16} color={iconColor} />
                  <span style={{ 
                    fontSize: '13px', 
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#3b82f6' : (isOverdue ? '#ef4444' : '#475569')
                  }}>
                    {filter.name}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>({filter.count})</span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
