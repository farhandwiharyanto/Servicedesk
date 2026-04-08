'use client';

import React, { useState } from 'react';
import { createAsset } from '@/app/lib/actions';

interface CreateAssetModalProps {
  assetTypes: { id: string; name: string }[];
  assetStates: { id: string; name: string }[];
  users: { id: string; name: string }[];
  isOpen: boolean;
  onClose: () => void;
}

export function CreateAssetModal({ 
  assetTypes, assetStates, users, isOpen, onClose 
}: CreateAssetModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createAsset(formData);
      onClose();
    } catch (error) {
      console.error(error);
      alert('Failed to add asset.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content zoho-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Inventory New Asset</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label>Asset Name</label>
            <input name="name" type="text" placeholder="e.g. MacBook Pro 16" required className="zoho-input" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Asset Tag</label>
              <input name="tag" type="text" placeholder="AST-001" className="zoho-input" />
            </div>
            <div className="form-group">
              <label>Serial Number</label>
              <input name="serialNumber" type="text" placeholder="SN12345" className="zoho-input" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Asset Type</label>
              <select name="typeId" required>
                {assetTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Asset State</label>
              <select name="stateId" required>
                {assetStates.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Owner / Assigned User (Optional)</label>
            <select name="ownerId">
              <option value="">-- In Store --</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Inventorying...' : 'Add Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
