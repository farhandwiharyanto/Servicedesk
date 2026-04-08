import prisma from '@/lib/prisma';
import { NavIcon } from '../../components/NavIcon';
import Link from 'next/link';

async function getRequestDetail(id: string) {
  return await prisma.request.findUnique({
    where: { id },
    include: {
      requester: true,
      technician: true,
      status: true,
      priority: true,
      category: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
}

type RequestDetail = Awaited<ReturnType<typeof getRequestDetail>>;
type CommentWithUser = NonNullable<NonNullable<RequestDetail>['comments']>[number];

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const request = await getRequestDetail(id);

  if (!request) {
    return <div>Request not found</div>;
  }

  return (
    <div className="detail-container animate-fade-in">
      <nav className="breadcrumb">
        <Link href="/requests">Requests List</Link>
        <span className="dot">/</span>
        <span className="active-item">#{request.id.slice(-4).toUpperCase()}</span>
      </nav>

      <div className="detail-layout">
        <div className="main-viewer">
          <header className="ticket-header card">
            <div className="header-top">
              <span className={`pill-status pill-${request.status.type.toLowerCase()}`}>
                {request.status.name}
              </span>
              <span className="ticket-id">#{request.id.slice(-6).toUpperCase()}</span>
            </div>
            <h1>{request.subject}</h1>
            <div className="header-meta">
              <span className="author">Opened by <strong>{request.requester.name}</strong></span>
              <span className="dot">•</span>
              <span className="timestamp">
                {new Date(request.createdAt).toLocaleString('id-ID', {
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </span>
            </div>
          </header>

          <section className="ticket-description card">
            <h3>Description</h3>
            <div className="description-body">
              {request.description}
            </div>
          </section>

          <section className="ticket-comments card">
            <div className="conversation-header">
              <h3>Conversation</h3>
              <span className="comment-count">{request.comments.length} updates</span>
            </div>

            <div className="comments-stream">
              {request.comments.length > 0 ? (
                request.comments.map((comment: CommentWithUser) => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-avatar">{comment.user.name.charAt(0)}</div>
                    <div className="comment-content">
                      <div className="comment-meta">
                        <span className="comment-user">{comment.user.name}</span>
                        <span className="comment-time">
                          {new Date(comment.createdAt).toLocaleString('id-ID', {
                            hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short'
                          })}
                        </span>
                      </div>
                      <div className="comment-body">{comment.message}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-comments">No updates or comments yet.</div>
              )}
            </div>

            <div className="comment-editor">
              <textarea placeholder="Type your update or internal note..."></textarea>
              <div className="editor-actions">
                <button className="secondary-btn">Add Note</button>
                <button className="primary-btn">Reply</button>
              </div>
            </div>
          </section>
        </div>

        <aside className="properties-sidebar">
          <div className="properties-card card">
            <h3>Request Properties</h3>
            
            <div className="prop-group">
              <label>Technician</label>
              <div className="tech-picker glass">
                {request.technician ? (
                  <div className="assigned-to">
                    <div className="mini-avatar">{request.technician.name.charAt(0)}</div>
                    <span>{request.technician.name}</span>
                  </div>
                ) : (
                  <span className="unassigned">Pick a technician...</span>
                )}
                <NavIcon name="user" size={14} />
              </div>
            </div>

            <div className="prop-list">
              <div className="prop-item">
                <label>Priority</label>
                <span className={`badge badge-${request.priority.level.toLowerCase()}`}>
                  {request.priority.name}
                </span>
              </div>
              <div className="prop-item">
                <label>Category</label>
                <span className="prop-value">{request.category.name}</span>
              </div>
              <div className="prop-item">
                <label>SLA Status</label>
                <span className="prop-value sla-ok">Within SLA</span>
              </div>
              <div className="prop-item">
                <label>Group</label>
                <span className="prop-value">IT Support</span>
              </div>
            </div>
          </div>

          <div className="assets-card card">
            <div className="card-header-with-icon">
              <NavIcon name="assets" size={18} />
              <h3>Linked Assets</h3>
            </div>
            <div className="no-assets">No assets linked to this request.</div>
            <button className="link-asset-btn glass">Associate Asset</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
