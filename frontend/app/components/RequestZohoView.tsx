'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface RequestZohoViewProps {
   ticketId: string;
   onClose: () => void;
}

const RequestZohoView: React.FC<RequestZohoViewProps> = ({ ticketId, onClose }) => {
   const router = useRouter();
   const [ticket, setTicket] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState('details');
   const [isEditing, setIsEditing] = useState(false);
   const [formData, setFormData] = useState<any>({});
   
   // Comment State
   const [commentMessage, setCommentMessage] = useState('');
   const [isSubmittingComment, setIsSubmittingComment] = useState(false);
   
   // Sidebar & UI State
   const [recentTickets, setRecentTickets] = useState<any[]>([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [showToast, setShowToast] = useState(false);
   const [toastMessage, setToastMessage] = useState('');
   
   const [metadata, setMetadata] = useState<any>({
      categories: [], statuses: [], priorities: [], sites: [],
      groups: [], technicians: [], modes: [], solution_types: [],
      request_types: []
   });

   useEffect(() => {
      loadData();
   }, [ticketId]);

   const loadData = async () => {
      setLoading(true);
      try {
         const [ticketRes, metaRes, listRes] = await Promise.all([
            fetch(`http://localhost:8000/api/tickets/${ticketId}`),
            fetch(`http://localhost:8000/api/tickets/metadata`),
            fetch(`http://localhost:8000/api/tickets`)
         ]);
         
         const ticketData = await ticketRes.json();
         const metaData = await metaRes.json();
         const listData = await listRes.json();
         
         setTicket(ticketData);
         setMetadata(metaData);
         setRecentTickets(listData.requests || []);
         
         // Initialize formData with Fallbacks
         setFormData({
            ...ticketData,
            request_type: ticketData.request_type || 'Service Request',
            site_id: ticketData.site_id || '7015dd66-601b-4ccd-b880-1c35def0d77d', // MENARA THAMRIN
            mode: ticketData.mode || 'Service Portal',
            group_id: ticketData.group_id || (metaData.groups?.find((g: any) => g.name === 'Other Surrounding Apps')?.id || ''),
            priority_id: ticketData.priority_id || (metaData.priorities?.find((p: any) => p.name === 'Medium')?.id || ''),
            category_id: ticketData.category_id || (metaData.categories?.find((c: any) => c.name === 'Application')?.id || ''),
            template: ticketData.template || 'Default Request'
         });
      } catch (err) {
         console.error('Failed to load data', err);
      } finally {
         setLoading(false);
      }
   };

   const showNotification = (msg: string) => {
      setToastMessage(msg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
   };

   const handleUpdate = async () => {
      try {
         const res = await fetch(`http://localhost:8000/api/tickets/${ticketId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
         });
         const updated = await res.json();
         setTicket(updated);
         setIsEditing(false);
         showNotification('Properties updated successfully');
      } catch (err) {
         alert('Update failed');
      }
   };

   const handleAddComment = async (isInternal: boolean = false) => {
      if (!commentMessage.trim()) return;
      setIsSubmittingComment(true);
      try {
         await fetch(`http://localhost:8000/api/tickets/${ticketId}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: commentMessage, is_internal: isInternal })
         });
         loadData();
         setCommentMessage('');
         showNotification('Comment added');
      } catch (err) {
         console.error('Comment failed', err);
      } finally {
         setIsSubmittingComment(false);
      }
   };

   const formatDate = (date: any) => {
      if (!date) return '-';
      return new Date(date).toLocaleString('en-US', { 
         month: 'short', day: '2-digit', year: 'numeric', 
         hour: '2-digit', minute: '2-digit', hour12: true 
      });
   };

   const isReadOnly = (field: string) => {
      const status = (ticket.status?.type || ticket.status?.name || 'OPEN').toUpperCase();
      const commonLocked = ['created_at', 'updated_at', 'response_due_at', 'ola_due_at', 'resolved_at', 'closed_at', 'due_at'];
      
      if (status === 'OPEN') return [...commonLocked, 'site_id'].includes(field);
      if (status === 'RESOLVED' || status === 'CLOSED') {
         return [...commonLocked, 'group_id', 'technician_id', 'initial', 'incident_manager', 'l2_group_id', 'site_id', 'time_elapsed'].includes(field);
      }
      return commonLocked.includes(field);
   };

   const renderField = (label: string, field: string | undefined, value: any, options: any[] = []) => {
      if (!label) return <div style={{ padding: '12px' }}></div>;
      const readOnly = field && isReadOnly(field);

      return (
         <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', alignItems: 'center', padding: '12px 20px', borderRight: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{label}</span>
            <div style={{ fontSize: '13px', fontWeight: 700, color: readOnly ? '#94a3b8' : '#334155' }}>
               {isEditing && field && !readOnly ? (
                  options && options.length > 0 ? (
                     <select value={formData[field] || ''} onChange={(e) => setFormData({...formData, [field]: e.target.value})} style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
                        <option value="">-- Select --</option>
                        {options.map((opt: any) => <option key={opt.id || opt} value={opt.id || opt}>{opt.name || opt}</option>)}
                     </select>
                  ) : (
                     <input type="text" value={formData[field] || ''} onChange={(e) => setFormData({...formData, [field]: e.target.value})} style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
                  )
               ) : (
                  <span>{value || '-'}</span>
               )}
            </div>
         </div>
      );
   };

   if (loading || !ticket) return <div style={{ padding: '100px', textAlign: 'center', fontWeight: 700 }}>Loading SaaS Portal...</div>;

   const requester = ticket.requester || {};
   const cleanDesc = ticket.description?.replace(/<[^>]*>/g, '') || 'No description provided.';
   const currentStatus = (ticket.status?.type || ticket.status?.name || 'OPEN').toUpperCase();

   return (
      <div style={{ position: 'fixed', inset: 0, background: '#f8fafc', zIndex: 1000, display: 'flex', flexDirection: 'column', fontFamily: 'Inter, sans-serif' }}>
         {/* Top Navigation Bar */}
         <div style={{ background: '#fff', height: '64px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
               <button onClick={onClose} style={{ border: 'none', background: '#f1f5f9', width: '40px', height: '40px', borderRadius: '12px', cursor: 'pointer', fontWeight: 900 }}>←</button>
               <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800 }}>REQUEST DETAIL</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#1e293b' }}>#{ticket.id?.slice(-6).toUpperCase()}</div>
               </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
               {isEditing ? (
                  <>
                     <button onClick={() => setIsEditing(false)} style={{ padding: '10px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                     <button onClick={handleUpdate} style={{ padding: '10px 24px', borderRadius: '12px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Save Changes</button>
                  </>
               ) : (
                  <>
                     <button onClick={() => setIsEditing(true)} style={{ padding: '10px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 800, cursor: 'pointer' }}>📝 Edit Properties</button>
                     <button className="modern-btn-primary" style={{ padding: '10px 24px', borderRadius: '12px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Close Ticket</button>
                  </>
               )}
            </div>
         </div>

         <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Left Rail: Recent Tickets */}
            <div style={{ width: '300px', background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
               <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9' }}>
                  <input placeholder="Search tickets..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '13px', background: '#f8fafc' }} />
               </div>
               <div style={{ flex: 1, overflowY: 'auto' }}>
                  {recentTickets.filter(t => t.subject.toLowerCase().includes(searchQuery.toLowerCase())).map(t => (
                     <div key={t.id} onClick={() => router.push(`/it/requests/${t.id}`)} style={{ padding: '16px 20px', borderBottom: '1px solid #f8fafc', cursor: 'pointer', background: t.id === ticketId ? '#eff6ff' : 'transparent', borderLeft: t.id === ticketId ? '4px solid #2563eb' : 'none' }}>
                        <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 800, marginBottom: '4px' }}>#{t.id.slice(-6).toUpperCase()}</div>
                        <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subject}</div>
                     </div>
                  ))}
               </div>
            </div>

            {/* Center Stage: Content Area */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#f8fafc', padding: '40px' }}>
               <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  
                  {/* Ticket Summary Card */}
                  <div style={{ background: '#fff', borderRadius: '28px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', gap: '24px' }}>
                     <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>🎫</div>
                     <div style={{ flex: 1 }}>
                        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 900, color: '#0f172a' }}>{ticket.subject}</h1>
                        <div style={{ marginTop: '10px', fontSize: '14px', color: '#64748b' }}>
                           Created by <span style={{ fontWeight: 800, color: '#1e293b' }}>{requester.name}</span> on {formatDate(ticket.created_at)}
                        </div>
                     </div>
                  </div>

                  {/* Tabs */}
                  <div style={{ display: 'flex', gap: '10px', background: '#e2e8f0', padding: '6px', borderRadius: '18px', width: 'fit-content' }}>
                     {['Details', 'Resolution', 'History'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab.toLowerCase())} style={{ padding: '10px 28px', borderRadius: '14px', border: 'none', background: activeTab === tab.toLowerCase() ? '#fff' : 'transparent', color: activeTab === tab.toLowerCase() ? '#2563eb' : '#64748b', fontWeight: 800, cursor: 'pointer', fontSize: '13px' }}>{tab}</button>
                     ))}
                  </div>

                  {/* Description & Conversations (TOP) */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                     {/* Description Box */}
                     <div style={{ background: '#fff', borderRadius: '28px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ padding: '20px 32px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontWeight: 900, fontSize: '15px' }}>Description</div>
                        <div style={{ padding: '32px', fontSize: '16px', lineHeight: 1.8, color: '#334155' }}>{cleanDesc}</div>
                     </div>

                     {/* Conversations Box */}
                     <div style={{ background: '#fff', borderRadius: '28px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <div style={{ padding: '20px 32px', borderBottom: '1px solid #e2e8f0', fontWeight: 900, fontSize: '15px' }}>Conversations ({ticket.comments?.length || 0})</div>
                        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                           {ticket.comments?.map((c: any) => (
                              <div key={c.id} style={{ display: 'flex', gap: '20px', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
                                 <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{c.user?.name?.charAt(0)}</div>
                                 <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                       <span style={{ fontWeight: 900, fontSize: '14px' }}>{c.user?.name}</span>
                                       <span style={{ fontSize: '12px', color: '#94a3b8' }}>{formatDate(c.created_at)}</span>
                                    </div>
                                    <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6 }}>{c.message}</div>
                                 </div>
                              </div>
                           ))}
                           <div style={{ marginTop: '16px' }}>
                              <textarea placeholder="Write a reply..." value={commentMessage} onChange={(e) => setCommentMessage(e.target.value)} style={{ width: '100%', height: '120px', padding: '20px', borderRadius: '20px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '14px', resize: 'none' }} />
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                                 <button onClick={() => handleAddComment(true)} style={{ padding: '10px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 800, cursor: 'pointer' }}>Add Note</button>
                                 <button onClick={() => handleAddComment(false)} style={{ padding: '10px 32px', borderRadius: '12px', background: '#2563eb', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>Send Reply</button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Properties Table (BOTTOM - 18 Rows) */}
                  <div style={{ background: '#fff', borderRadius: '28px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                     <div style={{ padding: '20px 32px', borderBottom: '1px solid #e2e8f0', fontWeight: 900, fontSize: '15px' }}>Ticket Properties</div>
                     <div style={{ border: '1px solid #f1f5f9', margin: '20px', borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f8fafc' }}>
                           {renderField("Request Type", "request_type", ticket.request_type || 'Service Request', metadata.request_types)}
                           {renderField("Site", "site_id", ticket.site?.name || 'MENARA THAMRIN', metadata.sites)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff' }}>
                           {renderField("Status", "status_id", ticket.status?.name, metadata.statuses)}
                           {renderField("Group", "group_id", ticket.group?.name || 'Other Surrounding Apps', metadata.groups)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f8fafc' }}>
                           {renderField("Mode", "mode", ticket.mode || 'Service Portal', metadata.modes)}
                           {renderField("Technician", "technician_id", ticket.technician?.name || 'Unassigned', metadata.technicians)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff' }}>
                           {renderField("Category", "category_id", ticket.category?.name, metadata.categories)}
                           {renderField("Inisial", "initial", ticket.initial || 'Farhan Dwi Haryanto')}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f8fafc' }}>
                           {renderField("Subcategory", "subcategory", ticket.subcategory || '-')}
                           {renderField("Incident Manager", "incident_manager_id", ticket.incident_manager?.name || 'Not Assigned', metadata.technicians)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff' }}>
                           {renderField("Item", "item", ticket.item || '-')}
                           {renderField("L2 Group", "l2_group_id", ticket.l2_group?.name || 'Not Assigned', metadata.groups)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f8fafc' }}>
                           {renderField("Priority", "priority_id", ticket.priority?.name, metadata.priorities)}
                           {renderField("Solution Type", "solution_type", ticket.solution_type || 'Not Specified', metadata.solution_types)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff' }}>
                           {renderField("Progress Status", "progress_status", ticket.progress_status || 'Not Assigned')}
                           {renderField("No. Tiket Vendor", "vendor_ticket_no", ticket.vendor_ticket_no || '-')}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f8fafc' }}>
                           {renderField("Sprint", "sprint", ticket.sprint || '-')}
                           {renderField("Created By", "created_by_id", ticket.created_by?.name || 'System', metadata.technicians)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff' }}>
                           {renderField("Asset(s)", "assets", ticket.assets || '-')}
                           {renderField("SLA", "sla", ticket.sla || `${ticket.priority?.name || 'Normal'} SLA`)}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f8fafc' }}>
                           {renderField("Department", "department", requester.department || '-')}
                           {renderField("Maintenance Title", "maintenance_title", ticket.maintenance_title || '-')}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff' }}>
                           {renderField("Template", "template", ticket.template || 'Default Request')}
                           {renderField("Scheduled Start Time", "scheduled_start_at", formatDate(ticket.scheduled_start_at))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f8fafc' }}>
                           {renderField("Created Date", "created_at", formatDate(ticket.created_at))}
                           {renderField("DueBy Date", "due_at", formatDate(ticket.due_at))}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff' }}>
                           {renderField("Resolved Date", "resolved_at", formatDate(ticket.resolved_at))}
                           {renderField("Time Elapsed", "time_elapsed", ticket.time_elapsed || "0hrs 59min")}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#f8fafc' }}>
                           {renderField("Response DueBy Time", "response_due_at", formatDate(ticket.response_due_at || ticket.created_at))}
                           {renderField("Request Closure Code", "closure_code", ticket.closure_code || '-')}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', background: '#fff' }}>
                           {renderField("OLA Due_By Time", "ola_due_at", formatDate(ticket.ola_due_at || new Date(ticket.created_at).setDate(new Date(ticket.created_at).getDate() + 3)))}
                           {renderField("Last Update Time", "updated_at", formatDate(ticket.updated_at))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right Sidebar: Requester Profile */}
            <div style={{ width: '360px', background: '#fff', borderLeft: '1px solid #e2e8f0', padding: '40px 32px', overflowY: 'auto' }}>
               <div style={{ textAlign: 'center' }}>
                  <div style={{ width: '90px', height: '90px', borderRadius: '30px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '36px', fontWeight: 900 }}>{requester.name?.charAt(0)}</div>
                  <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>{requester.name}</h3>
                  <p style={{ margin: '8px 0 32px', fontSize: '15px', color: '#64748b' }}>{requester.email || 'requester@company.com'}</p>
                  <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                     {[
                        { label: 'EMPLOYEE ID', value: requester.nik || '-', icon: '🆔' },
                        { label: 'DEPARTMENT', value: requester.department || '-', icon: '🏢' },
                        { label: 'PHONE', value: requester.phone || '-', icon: '📞' },
                        { label: 'JOB TITLE', value: requester.job_title || '-', icon: '💼' },
                        { label: 'REPORTING TO', value: requester.reporting_to || '-', icon: '👤' },
                     ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                           <span style={{ fontSize: '20px' }}>{item.icon}</span>
                           <div>
                              <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800, letterSpacing: '0.05em' }}>{item.label}</div>
                              <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155', marginTop: '2px' }}>{item.value}</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Toast Notification */}
         {showToast && (
            <div style={{ position: 'fixed', bottom: '40px', left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', padding: '12px 32px', borderRadius: '50px', fontWeight: 700, boxShadow: '0 10px 25px rgba(0,0,0,0.2)', zIndex: 3000 }}>
               {toastMessage}
            </div>
         )}
      </div>
   );
};

export default RequestZohoView;
