'use client';

import React, { useState } from 'react';
import { NavIcon } from './NavIcon';
import { createRequest } from '@/app/lib/actions';

interface CreateTicketModalProps {
  categories: { id: string; name: string }[];
  priorities: { id: string; name: string }[];
  users: { id: string; name: string }[];
  impacts: { id: string; name: string }[];
  urgencies: { id: string; name: string }[];
  isOpen: boolean;
  onClose: () => void;
}

export function CreateTicketModal({ 
  categories, priorities, users, impacts, urgencies, isOpen, onClose 
}: CreateTicketModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createRequest(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to create ticket.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content zoho-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Ticket</h2>
          <button className="close-btn" onClick={onClose}>
             &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label>Subject</label>
            <input name="subject" type="text" placeholder="Summary of the issue..." required className="zoho-input" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Impact</label>
              <select name="impactId">
                <option value="">-- Select Impact --</option>
                {impacts.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Urgency</label>
              <select name="urgencyId">
                <option value="">-- Select Urgency --</option>
                {urgencies.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select name="categoryId" required>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Priority</label>
              <select name="priorityId" required>
                {priorities.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Requester</label>
              <select name="requesterId" required>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Due Date (Optional)</label>
              <input name="dueAt" type="date" className="zoho-input" />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" placeholder="Describe the problem in detail..." rows={4} required className="zoho-input"></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Processing...' : 'Add Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
