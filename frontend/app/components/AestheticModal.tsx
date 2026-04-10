'use client';

import React, { useEffect } from 'react';
import { NavIcon } from './NavIcon';

interface AestheticModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  icon?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function AestheticModal({ 
  isOpen, onClose, title, icon = 'dashboard', children, footer 
}: AestheticModalProps) {
  
  // Disable background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="premium-modal-overlay" onClick={onClose}>
      <div className="premium-glass-card" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header-premium">
          <h2>
            <NavIcon name={icon as any} size={22} color="var(--primary)" />
            {title}
          </h2>
          <button 
            className="icon-btn-light" 
            onClick={onClose}
            style={{ color: 'var(--text-muted)' }}
          >
            <NavIcon name="logo" size={20} /> {/* Using logo as X for now if no close icon */}
            <span style={{ fontSize: '20px', marginLeft: '-18px' }}>&times;</span>
          </button>
        </header>

        <div className="modal-body-premium">
          {children}
        </div>

        {footer && (
          <footer className="modal-footer-premium">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}
