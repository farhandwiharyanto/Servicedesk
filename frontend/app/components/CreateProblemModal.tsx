'use client';

import React, { useState } from 'react';
import { AestheticModal } from './AestheticModal';
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createProblem(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to add problem.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AestheticModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create New Problem Analysis" 
      icon="problems"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            type="submit" 
            form="problem-form" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Problem'}
          </button>
        </>
      }
    >
      <form id="problem-form" onSubmit={handleSubmit}>
        <div className="modern-input-group">
          <label>Subject</label>
          <input 
            name="subject" 
            type="text" 
            placeholder="Problem summary..." 
            required 
            className="modern-input" 
          />
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

        <div className="modern-input-group">
          <label>Initial Status</label>
          <select name="statusId" required className="modern-select">
            {statuses.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        <div className="modern-input-group">
          <label>Problem Description</label>
          <textarea 
            name="description" 
            placeholder="Describe the problem..." 
            rows={4} 
            required 
            className="modern-textarea"
          ></textarea>
        </div>
      </form>
    </AestheticModal>
  );
}

