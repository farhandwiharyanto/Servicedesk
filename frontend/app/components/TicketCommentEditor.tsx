'use client';

import React, { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import { NavIcon } from './NavIcon';

interface TicketCommentEditorProps {
  ticketId: string;
}

export function TicketCommentEditor({ ticketId }: TicketCommentEditorProps) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Listen for AI Solution "Apply" events
  useEffect(() => {
    const handleApplySolution = (e: any) => {
      if (e.detail?.solution) {
        setMessage(e.detail.solution);
        const editor = document.getElementById('ticket-editor-textarea');
        editor?.scrollIntoView({ behavior: 'smooth' });
        editor?.focus();
      }
    };

    window.addEventListener('apply-ai-solution', handleApplySolution);
    return () => window.removeEventListener('apply-ai-solution', handleApplySolution);
  }, []);

  const handleSubmit = async (isInternal: boolean) => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      const finalMessage = isInternal ? `**[INTERNAL NOTE]**\n${message}` : message;
      
      await apiFetch(`/tickets/${ticketId}/comments`, {
        method: 'POST',
        body: JSON.stringify({ message: finalMessage, is_internal: isInternal })
      });

      setMessage('');
      // In a real app, we'd update a context or use SWR/React Query to refresh.
      // For now, reload the page to see the new comment in the Server Component stream.
      window.location.reload();
    } catch (error) {
      alert('Gagal mengirim komentar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#fff', borderTop: '1px solid #f1f5f9' }}>
      <textarea 
        id="ticket-editor-textarea"
        placeholder="Write an internal note or reply to requester..." 
        className="premium-textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={loading}
        style={{ 
          width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0',
          minHeight: '120px', fontSize: '14px', outline: 'none', transition: 'all 0.2s',
          background: '#f8fafc', marginBottom: '16px', color: '#1e293b'
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button 
          onClick={() => handleSubmit(true)}
          disabled={loading || !message.trim()}
          className="btn btn-secondary"
          style={{ padding: '10px 20px', fontSize: '13px', fontWeight: 600, borderRadius: '10px', opacity: message.trim() ? 1 : 0.5 }}
        >
          Add Internal Note
        </button>
        <button 
          onClick={() => handleSubmit(false)}
          disabled={loading || !message.trim()}
          className="btn btn-primary"
          style={{ 
            padding: '10px 24px', fontSize: '13px', fontWeight: 700, borderRadius: '10px',
            background: 'var(--primary)', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
            opacity: message.trim() ? 1 : 0.5
          }}
        >
          {loading ? 'Sending...' : 'Send Reply'}
        </button>
      </div>
    </div>
  );
}
