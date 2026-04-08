'use client';

import React, { useState } from 'react';
import { createProblem } from '@/app/lib/actions';

interface CreateProblemModalProps {
  categories: { id: string; name: string }[];
  priorities: { id: string; name: string }[];
  statuses: { id: string; name: string }[];
  isOpen: boolean;
  onClose: () => void;
}

export function CreateProblemModal({ 
  categories, priorities, statuses, isOpen, onClose 
}: CreateProblemModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createProblem(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to alert problem.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content zoho-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Problem</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label>Subject</label>
            <input name="subject" type="text" placeholder="Problem summary..." required className="zoho-input" />
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

          <div className="form-group">
            <label>Status</label>
            <select name="statusId" required>
              {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" placeholder="Describe the problem..." rows={4} required className="zoho-input"></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Adding...' : 'Add Problem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
