import { apiFetch, endpoints } from '@/lib/api';
import { NavIcon } from '../../../components/NavIcon';
import Link from 'next/link';
import { TicketAIInspector } from '../../../components/TicketAIInspector';
import { SupportFeedback } from '../../../components/SupportFeedback';
import { TicketTimeline } from '../../../components/TicketTimeline';
import { TriggerOverdueButton } from '../../../components/TriggerOverdueButton';
import { FormattedDate } from '../../../components/FormattedDate';
import { TicketCommentEditor } from '../../../components/TicketCommentEditor';
import { TicketTechnicianAssigner } from '../../../components/TicketTechnicianAssigner';

async function getRequestDetail(id: string) {
  try {
    return await apiFetch(`${endpoints.tickets}/${id}`);
  } catch (error) {
    console.error("Request detail fetch failed:", error);
    return null;
  }
}

type RequestDetail = any;
type CommentWithUser = any;

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const request = await getRequestDetail(id);

  if (!request) {
    return <div className="card glass-card" style={{ padding: '40px', textAlign: 'center' }}>Request not found</div>;
  }

  const isResolved = ['RESOLVED', 'CLOSED'].includes(request.status.type.toUpperCase());
  const isOverdue = !isResolved && request.due_at && new Date(request.due_at) < new Date();

  return (
    <div className="detail-container animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 20px 40px' }}>
      {/* Breadcrumb & Navigation */}
      <nav style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
        <Link href="/it/requests" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <NavIcon name="requests" size={14} /> Requests
        </Link>
        <span style={{ color: 'var(--border-subtle)' }}>/</span>
        <span style={{ fontWeight: 700, color: 'var(--primary)', background: 'var(--primary)10', padding: '2px 8px', borderRadius: '6px' }}>
          #{request.id.slice(-5).toUpperCase()}
        </span>
      </nav>

      {/* Hero Workflow Timeline */}
      <TicketTimeline statusType={request.status.type} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '32px', alignItems: 'start' }}>
        
        {/* Main Content Area */}
        <div className="main-viewer" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Ticket Title & Meta */}
          <header className="card glass-card" style={{ padding: '32px', border: '1px solid rgba(59,130,246,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
               <div style={{ display: 'flex', gap: '8px' }}>
                <span className={`premium-pill premium-pill-${
                  request.status.type.toLowerCase() === 'open' ? 'primary' : 
                  request.status.type.toLowerCase() === 'in_progress' ? 'warning' : 
                  request.status.type.toLowerCase() === 'escalated' ? 'danger' : 'success'
                }`}>
                  {request.status.name}
                </span>
                {isOverdue && <span className="premium-pill premium-pill-danger">SLA OVERDUE</span>}
               </div>
               <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '1px' }}>
                #{request.id.slice(-8).toUpperCase()}
               </span>
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '16px', lineHeight: 1.2 }}>
              {request.subject}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-muted)', fontSize: '13px' }}>
              <div className="avatar mini" style={{ margin: 0 }}>{request.requester.name.charAt(0)}</div>
              <span>Reported by <strong>{request.requester.name}</strong></span>
              <span style={{ opacity: 0.3 }}>•</span>
              <span><FormattedDate date={request.created_at || request.createdAt} /></span>
            </div>
          </header>

          {/* Description Section */}
          <section className="card glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <NavIcon name="solutions" size={16} color="var(--primary)" />
              Description
            </h3>
            <div style={{ 
              fontSize: '15px', color: '#334155', lineHeight: 1.7, background: '#f8fafc', 
              padding: '20px', borderRadius: '12px', border: '1px solid #f1f5f9'
            }}>
              {request.description}
            </div>
          </section>

          {/* New Modern Conversation Stream */}
          <section className="card glass-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Conversation Stream</h3>
               <span className="premium-pill premium-pill-muted">{request.comments.length} Updates</span>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', background: '#fbfcfd' }}>
              {request.comments.length > 0 ? (
                request.comments.map((comment: any) => {
                  const isAiAction = comment.message.includes('[AI_ACTION]');
                  const isAi = comment.user.name.toLowerCase().includes('ai') || isAiAction;
                  const isInternal = comment.message.includes('[INTERNAL NOTE]');
                  
                  const cleanMessage = comment.message.replace(/\*\*\[AI_ACTION\]\*\*\s*/g, '');

                  if (isAiAction) {
                    return (
                      <div key={comment.id} style={{ display: 'flex', gap: '12px', opacity: 0.8 }}>
                         <div style={{ width: '36px', display: 'flex', justifyContent: 'center' }}>
                           <div style={{ width: '2px', height: '100%', background: '#e2e8f0' }} />
                         </div>
                         <div className="animate-pulse" style={{ 
                           padding: '12px 16px', borderRadius: '12px', background: '#f8fafc',
                           border: '1px dashed #cbd5e1', fontSize: '13px', color: '#64748b',
                           display: 'flex', alignItems: 'center', gap: '8px', flex: 1
                         }}>
                           <NavIcon name="bolt" size={14} color="#64748b" />
                           {cleanMessage}
                         </div>
                      </div>
                    );
                  }

                  return (
                    <div key={comment.id} style={{ 
                      display: 'flex', gap: '12px', 
                    }}>
                      <div className="animate-float" style={{ 
                        width: '36px', height: '36px', borderRadius: '12px', 
                        background: isAi ? 'var(--primary)' : isInternal ? '#fef3c7' : '#e2e8f0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: isAi ? 'white' : isInternal ? '#92400e' : 'var(--text-muted)',
                        flexShrink: 0, boxShadow: isAi ? '0 4px 8px rgba(59,130,246,0.3)' : 'none'
                      }}>
                        <NavIcon name={isAi ? 'bolt' : isInternal ? 'changes' : 'user'} size={18} />
                      </div>
                      <div style={{ maxWidth: '85%' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '4px' }}>
                           <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-main)' }}>{comment.user.name}</span>
                           <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            <FormattedDate date={comment.created_at || comment.createdAt} />
                           </span>
                        </div>
                        <div style={{ 
                          padding: '16px', borderRadius: '16px', borderTopLeftRadius: '2px',
                          background: isAi ? 'rgba(59,130,246,0.05)' : isInternal ? '#fffbeb' : '#fff',
                          border: isAi ? '1px solid rgba(59,130,246,0.1)' : isInternal ? '1px solid #fde68a' : '1px solid #e2e8f0',
                          fontSize: '14px', color: '#334155', lineHeight: 1.6,
                          boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                        }}>
                          {cleanMessage.replace(/\*\*\[AI AUTO-REPLY\]\*\*\n\n/g, '')}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  <NavIcon name="changes" size={32} opacity={0.2} />
                  <p style={{ marginTop: '12px', fontSize: '14px' }}>No updates record on this request.</p>
                </div>
              )}
            </div>

            {/* Premium Interactive Message Editor */}
            <TicketCommentEditor ticketId={request.id} />
          </section>
        </div>

        {/* Sidebar Properties Area */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Main Properties Card */}
          <div className="card glass-card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '20px' }}>Request Details</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <TicketTechnicianAssigner 
                ticketId={request.id} 
                currentTechnician={request.technician} 
              />

              <div style={{ padding: '0 4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                   <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Priority</span>
                   <span className={`premium-pill premium-pill-${['high', 'urgent'].includes(request.priority.level.toLowerCase()) ? 'danger' : 'primary'}`}>
                    {request.priority.name}
                   </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                   <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Category</span>
                   <span style={{ fontSize: '13px', fontWeight: 700 }}>{request.category.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                   <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>SLA Status</span>
                   <span style={{ 
                      fontSize: '13px', fontWeight: 700, 
                      color: isResolved ? 'var(--success)' : isOverdue ? 'var(--danger)' : 'var(--primary)' 
                   }}>
                    {isResolved ? 'Resolved' : isOverdue ? 'Overdue Breach' : 'Within SLA'}
                   </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <NavIcon name="assets" size={16} color="var(--primary)" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>Linked Assets</h3>
            </div>
            <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed #e2e8f0', borderRadius: '12px', background: '#fbfcfd' }}>
               <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>No assets linked to this request.</p>
               <button className="btn" style={{ marginTop: '12px', fontSize: '12px', color: 'var(--primary)', fontWeight: 700 }}>Associate Asset</button>
            </div>
          </div>

          {/* AI Assistance Feedback Section */}
          <SupportFeedback ticketId={request.id} currentStatusType={request.status.type} />

          {/* Feature C & D AI Inspector */}
          <TicketAIInspector ticketId={request.id} />

          {/* Developer Tools */}
          <div className="hover-opacity-reveal">
            <TriggerOverdueButton ticketId={request.id} />
          </div>
        </aside>
      </div>
    </div>
  );
}
