'use client';

import React, { useState, useEffect } from 'react';
import { NavIcon } from './NavIcon';
import { apiFetch } from '@/lib/api';

export function TicketAIInspector({ ticketId }: { ticketId: string }) {
  const [sentiment, setSentiment] = useState<any>(null);
  const [loadingSentiment, setLoadingSentiment] = useState(true);

  const [solution, setSolution] = useState<string | null>(null);
  const [loadingSolution, setLoadingSolution] = useState(false);

  useEffect(() => {
    const cachedSentiment = sessionStorage.getItem(`sentiment_${ticketId}`);
    if (cachedSentiment) {
      setSentiment(JSON.parse(cachedSentiment));
      setLoadingSentiment(false);
      return;
    }

    apiFetch(`/tickets/${ticketId}/sentiment`)
      .then(res => {
        setSentiment(res);
        sessionStorage.setItem(`sentiment_${ticketId}`, JSON.stringify(res));
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingSentiment(false));
  }, [ticketId]);

  useEffect(() => {
    const cachedSolution = sessionStorage.getItem(`solution_${ticketId}`);
    if (cachedSolution) setSolution(cachedSolution);
  }, [ticketId]);

  const fetchSmartSolution = async () => {
    setLoadingSolution(true);
    try {
      const res = await apiFetch(`/tickets/${ticketId}/suggestions`);
      setSolution(res.suggestion);
      sessionStorage.setItem(`solution_${ticketId}`, res.suggestion);
    } catch (error) {
      setSolution("Gagal mendapatkan rekomendasi AI.");
    } finally {
      setLoadingSolution(false);
    }
  };

  const isErrorSolution = solution?.includes("busy") || solution?.includes("Limit") || solution?.includes("Gagal");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Sentiment Tracker Card */}
      <div className="card glass-card" style={{ padding: '20px', borderLeft: `4px solid ${sentiment?.is_panicking ? 'var(--danger)' : 'var(--primary)'}` }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
          <NavIcon name="bolt" size={16} color={sentiment?.is_panicking ? 'var(--danger)' : 'var(--primary)'} />
          AI Sentiment Tracker
        </h3>
        {loadingSentiment ? (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Analyzing user mood...</div>
        ) : sentiment ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Mood: </span>
              <strong style={{ color: (sentiment.is_panicking || sentiment.mood === 'Limit Reached') ? 'var(--danger)' : 'var(--text-main)', fontSize: '14px' }}>
                {sentiment.mood}
              </strong>
            </div>
            <span className={`premium-pill premium-pill-${sentiment.score > 70 ? 'danger' : 'primary'}`}>
              Urgency: {sentiment.score}/100
            </span>
          </div>
        ) : (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Sentiment unavailable</div>
        )}
      </div>

      {/* Smart Solutions Card */}
      <div className="card glass-card" style={{ padding: '20px' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, marginBottom: '20px' }}>
          <NavIcon name="solutions" size={16} color="#8b5cf6" />
          AI Smart Solutions
        </h3>
        
        {!solution && !loadingSolution && (
          <button 
            onClick={fetchSmartSolution}
            className="btn"
            style={{
              width: '100%', padding: '12px', borderRadius: '12px',
              background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6',
              border: '1px solid rgba(139, 92, 246, 0.2)', cursor: 'pointer',
              fontWeight: 700, fontSize: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
            }}
          >
            <NavIcon name="bolt" size={14} /> Generate Solutions
          </button>
        )}

        {loadingSolution && (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', padding: '12px' }}>
            <span className="typing-dot" style={{ width: '6px', height: '6px', background: '#8b5cf6', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both' }}></span>
            <span className="typing-dot" style={{ width: '6px', height: '6px', background: '#8b5cf6', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both', animationDelay: '0.2s' }}></span>
            <span className="typing-dot" style={{ width: '6px', height: '6px', background: '#8b5cf6', borderRadius: '50%', animation: 'typing 1.4s infinite ease-in-out both', animationDelay: '0.4s' }}></span>
          </div>
        )}

        {solution && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              padding: '16px', background: isErrorSolution ? '#fff1f2' : '#f8fafc', 
              borderRadius: '12px', fontSize: '13px', lineHeight: 1.6, 
              color: isErrorSolution ? '#991b1b' : '#334155',
              whiteSpace: 'pre-wrap', border: isErrorSolution ? '1px solid #fda4af' : '1px solid #e2e8f0'
            }}>
              {solution}
            </div>
            
            <button 
              disabled={isErrorSolution}
              className="btn"
              onClick={() => {
                window.dispatchEvent(new CustomEvent('apply-ai-solution', { 
                  detail: { solution } 
                }));
              }}
              style={{
                width: '100%', padding: '12px', borderRadius: '12px',
                background: isErrorSolution ? '#e2e8f0' : '#8b5cf6', 
                color: isErrorSolution ? '#94a3b8' : 'white',
                border: 'none', cursor: isErrorSolution ? 'not-allowed' : 'pointer',
                fontWeight: 700, fontSize: '13px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px'
              }}
            >
              <NavIcon name="solutions" size={14} color={isErrorSolution ? '#94a3b8' : 'white'} /> 
              {isErrorSolution ? 'System Busy' : 'Apply Solution'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
