'use client';

import React, { useState, useRef } from 'react';
import { AestheticModal } from './AestheticModal';
import { createRequest } from '@/app/lib/actions';
import { NavIcon } from './NavIcon';
import { apiFetch } from '@/lib/api';

interface CreateTicketModalProps {
  categories: { id: string; name: string }[];
  priorities: { id: string; name: string }[];
  users: { id: string; name: string }[];
  impacts: { id: string; name: string }[];
  urgencies: { id: string; name: string }[];
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
}

export function CreateTicketModal({ 
  categories, priorities, users, impacts, urgencies, isOpen, onClose, initialSubject 
}: CreateTicketModalProps) {
  const [loading, setLoading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  
  const subjectRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const priorityRef = useRef<HTMLSelectElement>(null);
  const impactRef = useRef<HTMLSelectElement>(null);
  const urgencyRef = useRef<HTMLSelectElement>(null);

  React.useEffect(() => {
    if (isOpen && initialSubject && subjectRef.current) {
      subjectRef.current.value = initialSubject;
      // Auto-trigger prediction when coming from catalog
      handlePredictAI();
    }
  }, [isOpen, initialSubject]);

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

  async function handlePredictAI() {
    const subject = subjectRef.current?.value;
    const description = descriptionRef.current?.value;

    if (!subject) {
      alert("Please enter a subject first to get AI suggestions!");
      return;
    }

    setIsPredicting(true);
    try {
      const response = await apiFetch('/tickets/suggest', {
        method: 'POST',
        body: JSON.stringify({ subject, description })
      });

      if (response && response.category_id && categoryRef.current) {
        if (categories.some(c => c.id === response.category_id)) {
          categoryRef.current.value = response.category_id;
        }
      }
      
      if (response && response.priority_id && priorityRef.current) {
        if (priorities.some(p => p.id === response.priority_id)) {
          priorityRef.current.value = response.priority_id;
        }
      }

      if (response && response.impact_id && impactRef.current) {
        if (impacts.some(i => i.id === response.impact_id)) {
          impactRef.current.value = response.impact_id;
        }
      }

      if (response && response.urgency_id && urgencyRef.current) {
        if (urgencies.some(u => u.id === response.urgency_id)) {
          urgencyRef.current.value = response.urgency_id;
        }
      }
    } catch (err: any) {
      console.error("AI Prediction failed", err);
      // More descriptive error for end-user
      const msg = err?.message || "Internal system error";
      alert(`AI Auto-Fill Error: ${msg}\n\nTips: Silakan coba lagi atau isi manual jika masalah berlanjut.`);
    } finally {
      setIsPredicting(false);
    }
  }

  return (
    <AestheticModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create New Service Request" 
      icon="requests"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <button 
            type="button" 
            onClick={handlePredictAI}
            disabled={isPredicting}
            style={{
              padding: '8px 16px', background: 'linear-gradient(135deg, #a855f7, #6366f1)', 
              color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600
            }}
          >
            <NavIcon name="bolt" size={16} /> 
            {isPredicting ? 'AI is Thinking...' : 'Auto-Fill with AI 🪄'}
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button 
              type="submit" 
              form="ticket-form" 
              className="btn btn-primary" 
              disabled={loading || isPredicting}
            >
              {loading ? 'Processing...' : 'Add Request'}
            </button>
          </div>
        </div>
      }
    >
      <form id="ticket-form" onSubmit={handleSubmit}>
        <div className="modern-input-group">
          <label>Subject</label>
          <input 
            name="subject" 
            type="text" 
            ref={subjectRef}
            placeholder="Summary of the issue..." 
            required 
            className="modern-input" 
          />
        </div>

        <div className="modern-input-group" style={{ marginBottom: '16px' }}>
          <label>Description</label>
          <textarea 
            name="description" 
            ref={descriptionRef}
            placeholder="Describe the problem in detail..." 
            rows={3} 
            required 
            className="modern-textarea"
          ></textarea>
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Impact</label>
            <select name="impactId" ref={impactRef} className="modern-select">
              <option value="">-- Select Impact --</option>
              {impacts.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div className="modern-input-group">
            <label>Urgency</label>
            <select name="urgencyId" ref={urgencyRef} className="modern-select">
              <option value="">-- Select Urgency --</option>
              {urgencies.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Category *</label>
            <select name="categoryId" ref={categoryRef} required className="modern-select">
              <option value="">-- Select Category --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="modern-input-group">
            <label>Priority *</label>
            <select name="priorityId" ref={priorityRef} required className="modern-select">
              <option value="">-- Select Priority --</option>
              {priorities.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Requester *</label>
            <select name="requesterId" required className="modern-select">
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="modern-input-group">
            <label>Due Date (Optional)</label>
            <input name="dueAt" type="date" className="modern-input" />
          </div>
        </div>
      </form>
    </AestheticModal>
  );
}

