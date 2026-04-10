'use client';

import React, { useState } from 'react';
import { AestheticModal } from './AestheticModal';

interface CreateSolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateSolutionModal({ isOpen, onClose }: CreateSolutionModalProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    // Logic for creating solution via API
    setTimeout(() => {
      setLoading(false);
      onClose();
      alert('Solution draft created (API Integration pending)');
    }, 1000);
  }

  return (
    <AestheticModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Create Knowledge Base Article" 
      icon="solutions"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            type="submit" 
            form="solution-form" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Publishing...' : 'Create Solution'}
          </button>
        </>
      }
    >
      <form id="solution-form" onSubmit={handleSubmit}>
        <div className="modern-input-group">
          <label>Article Title / Subject</label>
          <input 
            name="subject" 
            type="text" 
            placeholder="e.g. How to reset VPN password" 
            required 
            className="modern-input" 
          />
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Topic</label>
            <select name="topic" required className="modern-select">
              <option value="General">General</option>
              <option value="Hardware">Hardware</option>
              <option value="Network">Network</option>
              <option value="Software">Software</option>
              <option value="Security">Security</option>
            </select>
          </div>
          <div className="modern-input-group">
            <label>Visibility</label>
            <select name="visibility" className="modern-select">
              <option value="public">Public (All Users)</option>
              <option value="internal">Internal (Technicians Only)</option>
            </select>
          </div>
        </div>

        <div className="modern-input-group">
          <label>Content (Markdown supported)</label>
          <textarea 
            name="content" 
            placeholder="Write the resolution steps here..." 
            rows={10} 
            required 
            className="modern-textarea"
            style={{ fontFamily: 'monospace' }}
          ></textarea>
        </div>

        <div className="modern-input-group">
          <label>Tags (Comma separated)</label>
          <input name="tags" type="text" placeholder="vpn, password, security" className="modern-input" />
        </div>
      </form>
    </AestheticModal>
  );
}
