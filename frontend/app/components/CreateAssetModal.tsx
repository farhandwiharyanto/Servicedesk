'use client';

import React, { useState } from 'react';
import { AestheticModal } from './AestheticModal';
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
    <AestheticModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Inventory New Asset" 
      icon="assets"
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button 
            type="submit" 
            form="asset-form" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? 'Inventorying...' : 'Add Asset'}
          </button>
        </>
      }
    >
      <form id="asset-form" onSubmit={handleSubmit}>
        <div className="modern-input-group">
          <label>Asset Name</label>
          <input 
            name="name" 
            type="text" 
            placeholder="e.g. MacBook Pro 16" 
            required 
            className="modern-input" 
          />
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Asset Tag</label>
            <input name="tag" type="text" placeholder="AST-001" className="modern-input" />
          </div>
          <div className="modern-input-group">
            <label>Serial Number</label>
            <input name="serialNumber" type="text" placeholder="SN12345" className="modern-input" />
          </div>
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Asset Type</label>
            <select name="typeId" required className="modern-select">
              {assetTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="modern-input-group">
            <label>Asset State</label>
            <select name="stateId" required className="modern-select">
              {assetStates.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="modern-input-group">
          <label>Owner / Assigned User (Optional)</label>
          <select name="ownerId" className="modern-select">
            <option value="">-- In Store --</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
          </select>
        </div>
      </form>
    </AestheticModal>
  );
}

