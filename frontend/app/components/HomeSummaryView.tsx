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

  const [filter, setFilter] = useState('pending');

  // Calculation Logic
  const overdue = requests.filter(t => !['Resolved', 'Closed'].includes(t.status?.name) && t.due_at && new Date(t.due_at) < now);
  const dueToday = requests.filter(t => t.due_at && t.due_at.startsWith(todayStr));
  const pending = requests.filter(t => !['Resolved', 'Closed', 'Rejected'].includes(t.status?.name));
  const resolved = requests.filter(t => t.status?.name === 'Resolved');
  
  const openProblems = problems.filter(p => !['Resolved', 'Closed'].includes(p.status?.name));
  const unassignedProblems = problems.filter(p => !p.technician_id);

  // My Tasks: Filtered by sidebar selection
  const filteredTasks = React.useMemo(() => {
    let list = [];
    if (filter === 'overdue') list = overdue;
    else if (filter === 'dueToday') list = dueToday;
    else if (filter === 'pending') list = pending;
    else if (filter === 'resolved') list = resolved;
    else if (filter === 'problems') list = openProblems;
    else if (filter === 'unassignedProblems') list = unassignedProblems;
    else list = requests;

    return list.sort((a,b) => new Date(a.due_at || a.created_at).getTime() - new Date(b.due_at || b.created_at).getTime());
  }, [filter, requests, problems, overdue, dueToday, pending, resolved, openProblems, unassignedProblems]);

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
            {/* Left Column: My Summary (Zoho Style) */}
            <div style={{ width: '250px' }}>
              <div className="legacy-panel" style={{ background: '#fff' }}>
                <div className="legacy-panel-header">
                  📑 My Summary
                </div>
                <div className="zoho-folder-tree" style={{ padding: '8px' }}>
                  <div className="zoho-folder-node" onClick={() => setFilter('clarification')}>
                    <div className="zoho-folder-name">
                      <span style={{ fontSize: '16px' }}>📁</span>
                      <span>Need Clarification</span>
                    </div>
                    <span className="zoho-folder-count">(0)</span>
                  </div>
                  <div className={`zoho-folder-node ${filter === 'overdue' ? 'active' : ''}`} onClick={() => setFilter('overdue')}>
                    <div className="zoho-folder-name">
                      <span style={{ fontSize: '16px' }}>📂</span>
                      <span style={{ color: overdue.length > 0 ? '#ef4444' : 'inherit' }}>Requests Overdue</span>
                    </div>
                    <span className="zoho-folder-count">({overdue.length})</span>
                  </div>
                  <div className={`zoho-folder-node ${filter === 'dueToday' ? 'active' : ''}`} onClick={() => setFilter('dueToday')}>
                    <div className="zoho-folder-name">
                      <span style={{ fontSize: '16px' }}>📁</span>
                      <span>Requests Due Today</span>
                    </div>
                    <span className="zoho-folder-count">({dueToday.length})</span>
                  </div>
                  <div className={`zoho-folder-node ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
                    <div className="zoho-folder-name">
                      <span style={{ fontSize: '16px' }}>📂</span>
                      <span>Pending Requests</span>
                    </div>
                    <span className="zoho-folder-count">({pending.length})</span>
                  </div>
                  <div className={`zoho-folder-node ${filter === 'resolved' ? 'active' : ''}`} onClick={() => setFilter('resolved')}>
                    <div className="zoho-folder-name">
                      <span style={{ fontSize: '16px' }}>✔️</span>
                      <span>Resolved Requests</span>
                    </div>
                    <span className="zoho-folder-count">({resolved.length})</span>
                  </div>
                  
                  <div className="zoho-sidebar-divider"></div>
                  
                  <div className="zoho-folder-node" onClick={() => setFilter('approvedChanges')}>
                    <div className="zoho-folder-name">
                      <span style={{ fontSize: '16px' }}>📁</span>
                      <span>Approved Changes</span>
                    </div>
                    <span className="zoho-folder-count">(0)</span>
                  </div>
                  <div className={`zoho-folder-node ${filter === 'problems' ? 'active' : ''}`} onClick={() => setFilter('problems')}>
                    <div className="zoho-folder-name">
                      <span style={{ fontSize: '16px' }}>📁</span>
                      <span>Open Problems</span>
                    </div>
                    <span className="zoho-folder-count">({openProblems.length})</span>
                  </div>
                  <div className={`zoho-folder-node ${filter === 'unassignedProblems' ? 'active' : ''}`} onClick={() => setFilter('unassignedProblems')}>
                    <div className="zoho-folder-name">
                      <span style={{ fontSize: '16px' }}>📁</span>
                      <span>Unassigned Problems</span>
                    </div>
                    <span className="zoho-folder-count">({unassignedProblems.length})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column: My Tasks */}
            <div style={{ flex: 1 }}>
              <div className="legacy-panel">
                <div className="legacy-panel-header" style={{ justifyContent: 'space-between' }}>
                  <div>📋 My Tasks ({filteredTasks.length})</div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="legacy-btn">+ New Task</button>
                    <button className="legacy-btn" onClick={() => setFilter('all')}>Show All</button>
                  </div>
                </div>
                <div className="legacy-panel-body" style={{ padding: '0 16px', minHeight: '400px' }}>
                  {loading ? (
                    <p style={{ padding: '20px', color: '#999', textAlign: 'center' }}>Loading tasks...</p>
                  ) : filteredTasks.length > 0 ? (
                    filteredTasks.map(task => {
                      const isOverdue = !['Resolved', 'Closed'].includes(task.status?.name) && task.due_at && new Date(task.due_at) < now;
                      const dueDateColor = isOverdue ? '#ef4444' : (task.status?.name === 'Resolved' ? '#10b981' : '#666');
                      
                      return (
                        <div key={task.id} style={{ padding: '12px 16px', borderBottom: '1px solid #f1f3f5', transition: 'background 0.2s' }} className="task-row-hover">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <a href={`/it/requests/${task.id}`} style={{ color: '#0076c8', textDecoration: 'none', fontSize: '14px', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>
                              #{task.id.toString().slice(-6).toUpperCase()} - {task.subject}
                            </a>
                            <span style={{ 
                              fontSize: '10px', 
                              padding: '2px 8px', 
                              borderRadius: '10px', 
                              background: task.status?.type === 'OPEN' ? '#fff3cd' : (task.status?.type === 'RESOLVED' ? '#d1e7dd' : '#e2e3e5'),
                              color: task.status?.type === 'OPEN' ? '#856404' : (task.status?.type === 'RESOLVED' ? '#0f5132' : '#383d41'),
                              fontWeight: 'bold',
                              textTransform: 'uppercase'
                            }}>
                              {task.status?.name}
                            </span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#666', display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span>
                              Due Date : <strong style={{ color: dueDateColor }}>{task.due_at ? new Date(task.due_at).toLocaleString() : 'No Due Date'}</strong>
                            </span>
                            {isOverdue && <span style={{ color: '#ef4444', fontWeight: 'bold' }}>⚠️ OVERDUE</span>}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                      <p style={{ fontSize: '12px' }}>No tasks found for this category.</p>
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
