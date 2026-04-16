'use client';

import React from 'react';
import { NavIcon } from './NavIcon';

interface TicketTimelineProps {
  statusType: string;
}

export function TicketTimeline({ statusType }: TicketTimelineProps) {
  const type = statusType.toLowerCase();

  const steps = [
    { key: 'created', label: 'Dibuat', icon: 'requests', completed: true },
    { 
      key: 'ai', 
      label: 'AI Analyst', 
      icon: 'bolt', 
      active: type === 'ai_processing',
      completed: ['ai_pending_user', 'escalated', 'resolved', 'closed'].includes(type)
    },
    { 
      key: 'feedback', 
      label: 'AI Solution', 
      icon: 'solutions', 
      active: type === 'ai_pending_user',
      completed: ['escalated', 'resolved', 'closed'].includes(type)
    },
    { 
      key: 'human', 
      label: 'L2 Tech', 
      icon: 'user', 
      active: type === 'escalated',
      completed: ['resolved', 'closed'].includes(type)
    },
    { 
      key: 'closed', 
      label: 'Resolved', 
      icon: 'bolt', 
      active: ['resolved', 'closed'].includes(type),
      completed: ['resolved', 'closed'].includes(type)
    }
  ];

  return (
    <div className="card glass-card" style={{ padding: '24px 40px', marginBottom: '32px', borderRadius: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
        {/* Modern Connector Line */}
        <div style={{ 
          position: 'absolute', top: '24px', left: '10%', right: '10%', 
          height: '4px', background: '#f1f5f9', borderRadius: '4px', zIndex: 1 
        }}>
          {/* Active Progress Overlay */}
          <div style={{ 
            height: '100%', 
            width: steps.filter(s => s.completed).length * 25 + '%',
            background: 'linear-gradient(to right, #3b82f6, #60a5fa)',
            borderRadius: '4px',
            transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
          }} />
        </div>
        
        {steps.map((step, idx) => (
          <div key={idx} style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            zIndex: 2, flex: 1, textAlign: 'center' 
          }}>
            <div className={step.active ? 'animate-float' : ''} style={{ 
              width: '52px', height: '52px', borderRadius: '16px',
              background: step.completed ? '#3b82f6' : step.active ? '#fff' : '#fff',
              border: step.active ? '2px solid #3b82f6' : '2px solid #e2e8f0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: step.completed ? '#fff' : step.active ? '#3b82f6' : '#94a3b8',
              boxShadow: step.active ? '0 10px 20px rgba(59, 130, 246, 0.2)' : 'none',
              marginBottom: '10px',
              transition: 'all 0.4s ease',
              position: 'relative'
            }}>
              <NavIcon name={step.icon as any} size={22} />
              {step.active && (
                <div style={{ 
                  position: 'absolute', inset: '-4px', borderRadius: '20px', 
                  border: '2px solid #3b82f6', opacity: 0.3, animation: 'ping 2s cubic-bezier(0,0,0.2,1) infinite' 
                }} />
              )}
            </div>
            <span style={{ 
              fontSize: '12px', fontWeight: step.active || step.completed ? 700 : 500,
              color: step.active ? '#3b82f6' : step.completed ? '#1e293b' : '#94a3b8',
              letterSpacing: '-0.2px'
            }}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
      
      <style jsx>{`
        @keyframes ping {
          75%, 100% { transform: scale(1.2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
