'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch, endpoints } from '@/lib/api';
import { SchedulerView } from './SchedulerView';

export function HomeSummaryView() {
  const [activeTab, setActiveTab] = useState<'view' | 'scheduler'>('view');
  const [requests, setRequests] = useState<any[]>([]);
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await apiFetch(endpoints.tickets);
        setRequests(data.requests || []);
        setProblems(data.problems || []);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Calculation Logic
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const overdue = requests.filter(t => t.status?.name !== 'Resolved' && t.due_date && new Date(t.due_date) < now);
  const dueToday = requests.filter(t => t.due_date && t.due_date.startsWith(todayStr));
  const pending = requests.filter(t => !['Resolved', 'Closed'].includes(t.status?.name));
  
  const openProblems = problems.filter(p => !['Resolved', 'Closed'].includes(p.status?.name));
  const unassignedProblems = problems.filter(p => !p.technician_id);

  // My Tasks: Overdue or Due Today
  const myTasks = requests.filter(t => t.due_date && t.due_date.startsWith(todayStr)).sort((a,b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());

  return (
    <div className="legacy-home-wrapper" style={{ backgroundColor: '#f3f4f6', minHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Sub Header tabs for Home */}
      <div className="legacy-sub-nav">
        <div 
          className={`legacy-sub-tab ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
          style={{ cursor: 'pointer' }}
        >
          <span style={{ marginRight: '8px' }}>⏱️</span> My View
        </div>
        <div 
          className={`legacy-sub-tab ${activeTab === 'scheduler' ? 'active' : ''}`}
          onClick={() => setActiveTab('scheduler')}
          style={{ cursor: 'pointer' }}
        >
          <span style={{ marginRight: '8px' }}>📅</span> Scheduler
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 8px' }}>
        {activeTab === 'scheduler' ? (
          <div style={{ padding: '16px' }}>
            <SchedulerView />
          </div>
        ) : (
          <div className="legacy-home-grid">
            {/* Left Column: My Summary */}
            <div style={{ width: '250px' }}>
              <div className="legacy-panel">
                <div className="legacy-panel-header">
                  📑 My Summary
                </div>
                <div className="legacy-panel-body">
                  <div className="legacy-list-item">
                    <div style={{ display: 'flex', gap: '8px', color: '#666' }}>
                      <span>⚪</span> Need Clarification
                    </div>
                    <span>0</span>
                  </div>
                  <div className="legacy-list-item">
                    <div style={{ display: 'flex', gap: '8px', color: overdue.length > 0 ? '#d9534f' : '#666', fontWeight: overdue.length > 0 ? 'bold' : 'normal' }}>
                      <span>⏰</span> Requests Overdue
                    </div>
                    <span style={{ fontWeight: overdue.length > 0 ? 'bold' : 'normal' }}>{overdue.length}</span>
                  </div>
                  <div className="legacy-list-item">
                    <div style={{ display: 'flex', gap: '8px', color: dueToday.length > 0 ? '#f0ad4e' : '#666' }}>
                      <span>⚠️</span> Requests Due Today
                    </div>
                    <span>{dueToday.length}</span>
                  </div>
                  <div className="legacy-list-item" style={{ background: '#f0f7ff' }}>
                    <div style={{ display: 'flex', gap: '8px', color: '#0076c8', fontWeight: 'bold' }}>
                      <span>⏳</span> Pending Requests
                    </div>
                    <span style={{ fontWeight: 'bold' }}>{pending.length}</span>
                  </div>
                  <div className="legacy-list-item">
                    <div style={{ display: 'flex', gap: '8px', color: '#666' }}>
                      <span>⚙️</span> Approved Changes
                    </div>
                    <span>0</span>
                  </div>
                  <div className="legacy-list-item">
                    <div style={{ display: 'flex', gap: '8px', color: '#0076c8' }}>
                      <span>🚫</span> Unapproved Changes
                    </div>
                    <span>0</span>
                  </div>
                  <div className="legacy-list-item">
                    <div style={{ display: 'flex', gap: '8px', color: '#0076c8' }}>
                      <span>🔥</span> Open Problems
                    </div>
                    <span>{openProblems.length}</span>
                  </div>
                  <div className="legacy-list-item">
                    <div style={{ display: 'flex', gap: '8px', color: '#0076c8' }}>
                      <span>👤</span> Unassigned Problems
                    </div>
                    <span>{unassignedProblems.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column: My Tasks */}
            <div style={{ flex: 1 }}>
              <div className="legacy-panel">
                <div className="legacy-panel-header" style={{ justifyContent: 'space-between' }}>
                  <div>📋 My Tasks ({myTasks.length})</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="legacy-btn">+ New Task</button>
                    <button className="legacy-btn">Show All</button>
                  </div>
                </div>
                <div className="legacy-panel-body" style={{ padding: '0 16px', minHeight: '400px' }}>
                  {loading ? (
                    <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>Loading tasks...</p>
                  ) : myTasks.length > 0 ? (
                    myTasks.map(task => (
                      <div key={task.id} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
                        <a href={`/it/requests/${task.id}`} style={{ color: '#0076c8', textDecoration: 'none', fontSize: '13px', fontWeight: 'bold' }}>
                          #{task.id.toString().slice(-5).toUpperCase()} - {task.subject}
                        </a>
                        <div style={{ fontSize: '11px', color: '#888', marginTop: '4px' }}>
                          Due Date : <strong style={{ color: '#d9534f' }}>{new Date(task.due_date).toLocaleString()}</strong>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                      <p style={{ fontSize: '12px' }}>No tasks overdue today.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Approvals and Reminders */}
            <div style={{ width: '320px' }}>
              <div className="legacy-panel" style={{ minHeight: '250px' }}>
                <div className="legacy-panel-header" style={{ justifyContent: 'space-between' }}>
                  <div>✅ My Approvals</div>
                  <button className="legacy-btn">Show All</button>
                </div>
                <div className="legacy-panel-body" style={{ padding: '40px 16px', textAlign: 'center', color: '#555' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>☑️</div>
                  <p style={{ fontSize: '11px', fontWeight: 'bold' }}>No pending approval</p>
                </div>
              </div>

              <div className="legacy-panel" style={{ minHeight: '150px' }}>
                <div className="legacy-panel-header" style={{ justifyContent: 'space-between' }}>
                  <div>⏰ My Reminder(s)</div>
                  <button className="legacy-btn">Show All</button>
                </div>
                <div className="legacy-panel-body" style={{ padding: '16px', textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: '#888' }}>No reminders</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
