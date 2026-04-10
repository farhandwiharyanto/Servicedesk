'use client';

import React, { useState } from 'react';
import { checkAndNotifyOverdue } from '../actions/notifications';

export function TriggerOverdueButton() {
  const [loading, setLoading] = useState(false);

  async function handleCheck() {
    setLoading(true);
    try {
      const result = await checkAndNotifyOverdue();
      alert(`Berhasil memeriksa tiket. ${result.count} tiket overdue ditemukan dan email notifikasi telah disimulasikan di log.`);
    } catch (error) {
      console.error(error);
      alert('Gagal memeriksa tiket overdue.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button 
      className="trigger-overdue-btn glass" 
      onClick={handleCheck}
      disabled={loading}
    >
      {loading ? 'Memeriksa...' : 'Cek Tiket Overdue & Kirim Alert'}
    </button>
  );
}
