'use client';

import React, { useState } from 'react';
import { CreateTicketModal } from './CreateTicketModal';

interface NewTicketButtonProps {
  categories: { id: string; name: string }[];
  priorities: { id: string; name: string }[];
  users: { id: string; name: string }[];
  impacts: { id: string; name: string }[];
  urgencies: { id: string; name: string }[];
}

export function NewTicketButton({ categories, priorities, users, impacts, urgencies }: NewTicketButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button className="btn-new" onClick={() => setIsModalOpen(true)}>
        <span className="btn-new-plus">+</span>
        <span>New</span>
      </button>

      <CreateTicketModal 
        categories={categories}
        priorities={priorities}
        users={users}
        impacts={impacts}
        urgencies={urgencies}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
