'use client';

import React, { useState } from 'react';
import { AestheticModal } from './AestheticModal';
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
    <AestheticModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create New Service Request" 
      icon="requests"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            type="submit" 
            form="ticket-form" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Add Request'}
          </button>
        </>
      }
    >
      <form id="ticket-form" onSubmit={handleSubmit}>
        <div className="modern-input-group">
          <label>Subject</label>
          <input 
            name="subject" 
            type="text" 
            placeholder="Summary of the issue..." 
            required 
            className="modern-input" 
          />
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Impact</label>
            <select name="impactId" className="modern-select">
              <option value="">-- Select Impact --</option>
              {impacts.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div className="modern-input-group">
            <label>Urgency</label>
            <select name="urgencyId" className="modern-select">
              <option value="">-- Select Urgency --</option>
              {urgencies.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Category</label>
            <select name="categoryId" required className="modern-select">
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="modern-input-group">
            <label>Priority</label>
            <select name="priorityId" required className="modern-select">
              {priorities.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Requester</label>
            <select name="requesterId" required className="modern-select">
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="modern-input-group">
            <label>Due Date (Optional)</label>
            <input name="dueAt" type="date" className="modern-input" />
          </div>
        </div>

        <div className="modern-input-group">
          <label>Description</label>
          <textarea 
            name="description" 
            placeholder="Describe the problem in detail..." 
            rows={4} 
            required 
            className="modern-textarea"
          ></textarea>
        </div>
      </form>
    </AestheticModal>
  );
}

