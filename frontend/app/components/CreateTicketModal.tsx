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
  groups: { id: string; name: string }[];
  sites: { id: string; name: string }[];
  isOpen: boolean;
  onClose: () => void;
  initialSubject?: string;
}

const REQUEST_TYPES = [
  "Customer Request",
  "Service Request",
  "Incident",
  "Complaint",
  "Information Request",
  "Alert / Error"
];

const APPLICATION_SUBCATEGORIES = [
  "Tableau - SIMOLA", "Akses", "Humanis (HCMS)", "AFIS (ERFINA)", "Anaplan",
  "CRM - Sales", "BCL", "ACR", "Intan", "Tableau Management - Dadali",
  "Cafein", "E-Proc", "EPM", "Pentaho", "BSS", "Ultima", "WFM - Prisma",
  "PSA-PCA", "MyLintasarta", "MyPMOIS", "WOM", "WFM - Flasma", "Talita",
  "CRM - Case", "Sales Master", "NMS - IM", "Starla", "NMS - FM/PM",
  "Leonia", "Audit", "PLM"
];

const INFRASTRUCTURE_SUBCATEGORIES = [
  "Domain", "Operating System", "Network & Internet", "Email", "Server",
  "Support Vicon", "Software", "Database", "Security", "Support PC & Notebook",
  "Ruang Meeting", "Field Service", "Support Printer & Scanner", "Storage",
  "PC & Notebook", "Microsoft365", "Printer & Scanner", "Support Telephone & Gadget"
];

export function CreateTicketModal({ 
  categories, priorities, users, impacts, urgencies, groups, sites, isOpen, onClose, initialSubject 
}: CreateTicketModalProps) {
  const [loading, setLoading] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [technicianName, setTechnicianName] = useState('Farhan Dwi Haryanto');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  
  const subjectRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const priorityRef = useRef<HTMLSelectElement>(null);
  const impactRef = useRef<HTMLSelectElement>(null);
  const urgencyRef = useRef<HTMLSelectElement>(null);
  const groupRef = useRef<HTMLSelectElement>(null);
  const technicianRef = useRef<HTMLSelectElement>(null);
  const subCategoryRef = useRef<HTMLSelectElement>(null);
  const requestTypeRef = useRef<HTMLSelectElement>(null);
  const initialRef = useRef<HTMLInputElement>(null);
  const siteRef = useRef<HTMLSelectElement>(null);

  // Determine current subcategory list based on category name
  const selectedCategory = categories.find(c => c.id === selectedCategoryId);
  const currentSubcategories = selectedCategory?.name.toLowerCase() === 'infrastructure' 
    ? INFRASTRUCTURE_SUBCATEGORIES 
    : APPLICATION_SUBCATEGORIES;

  React.useEffect(() => {
    if (isOpen && initialSubject && subjectRef.current) {
      subjectRef.current.value = initialSubject;
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

  const handleTechnicianChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTech = users.find(u => u.id === e.target.value);
    if (selectedTech) {
      setTechnicianName(selectedTech.name);
      if (initialRef.current) initialRef.current.value = selectedTech.name;
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategoryId(e.target.value);
    // Reset subcategory when category changes
    if (subCategoryRef.current) subCategoryRef.current.value = '';
  };

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

      if (!response) return;

      // Sync Categorization
      if (response.category_id && categoryRef.current) {
        if (categories.some(c => c.id === response.category_id)) {
          categoryRef.current.value = response.category_id;
          setSelectedCategoryId(response.category_id);
        }
      }
      
      // We wait for the state update or use the response category to check subcategory
      const predictorCat = categories.find(c => c.id === response.category_id);
      const predictorList = predictorCat?.name.toLowerCase() === 'infrastructure' 
        ? INFRASTRUCTURE_SUBCATEGORIES 
        : APPLICATION_SUBCATEGORIES;

      if (response.subcategory && subCategoryRef.current) {
        if (predictorList.includes(response.subcategory)) {
          subCategoryRef.current.value = response.subcategory;
        }
      }

      // Sync Priority & Rest
      if (response.priority_id && priorityRef.current) {
        if (priorities.some(p => p.id === response.priority_id)) {
          priorityRef.current.value = response.priority_id;
        }
      }

      if (response.group_id && groupRef.current) {
        if (groups.some(g => g.id === response.group_id)) {
          groupRef.current.value = response.group_id;
        }
      }

      if (response.technician_id && technicianRef.current) {
        const tech = users.find(u => u.id === response.technician_id);
        if (tech) {
          technicianRef.current.value = tech.id;
          setTechnicianName(tech.name);
          if (initialRef.current) initialRef.current.value = tech.name;
        }
      }
      
    } catch (err: any) {
      console.error("AI Prediction failed", err);
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
            rows={2} 
            required 
            className="modern-textarea"
          ></textarea>
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Request Type *</label>
            <select name="request_type" ref={requestTypeRef} required className="modern-select">
              <option value="">-- Select Type --</option>
              {REQUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="modern-input-group">
            <label>Mode *</label>
            <select name="mode" required className="modern-select">
              <option value="Service Portal">Service Portal</option>
              <option value="Chat">Chat</option>
              <option value="E-Mail">E-Mail</option>
              <option value="Phone Call">Phone Call</option>
            </select>
          </div>
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Site *</label>
            <select name="site_id" ref={siteRef} required className="modern-select">
               <option value="">-- Select Site --</option>
               {sites?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div className="modern-input-group">
            <label>Category *</label>
            <select 
              name="category_id" 
              ref={categoryRef} 
              required 
              className="modern-select"
              onChange={handleCategoryChange}
            >
              <option value="">-- Select Category --</option>
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Sub Category *</label>
            <select 
              name="subcategory" 
              ref={subCategoryRef} 
              required 
              className="modern-select"
              disabled={!selectedCategoryId}
            >
              <option value="">-- Select Sub Category --</option>
              {currentSubcategories.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="modern-input-group">
            <label>Priority *</label>
            <select name="priority_id" ref={priorityRef} required className="modern-select">
              <option value="">-- Select Priority --</option>
              {priorities?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Impact</label>
            <select name="impact_id" ref={impactRef} className="modern-select">
              <option value="">-- Select Impact --</option>
              {impacts?.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
            </select>
          </div>
          <div className="modern-input-group">
            <label>Urgency</label>
            <select name="urgency_id" ref={urgencyRef} className="modern-select">
              <option value="">-- Select Urgency --</option>
              {urgencies?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Group</label>
            <select name="group_id" ref={groupRef} className="modern-select">
              <option value="">-- Select Group --</option>
              {groups?.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>
          <div className="modern-input-group">
            <label>Assign To</label>
            <select name="technician_id" ref={technicianRef} className="modern-select" onChange={handleTechnicianChange}>
              <option value="">-- Select Technician --</option>
              {users?.filter(u => u.name !== 'Administrator' && u.name !== 'Master Admin').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>

        <div className="modern-form-grid">
          <div className="modern-input-group">
            <label>Requester *</label>
            <select name="requester_id" required className="modern-select">
              {users?.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
          <div className="modern-input-group">
            <label>Due Date (Optional)</label>
            <input name="due_at" type="date" className="modern-input" />
          </div>
        </div>
      </form>
    </AestheticModal>
  );
}
