'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NavIcon } from './NavIcon';
import { apiFetch, endpoints } from '@/lib/api';

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: 'Halo! Saya Portal Assistant. Ada yang bisa saya bantu hari ini?', sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-open on mount with a slight delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Fetch Response from Laravel API
    apiFetch(endpoints.chatbot, {
      method: 'POST',
      body: JSON.stringify({ message: userMsg.text }),
    })
    .then(data => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: data.answer,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    })
    .catch(err => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        text: "Maaf, sistem sedang mengalami gangguan. Silakan coba lagi nanti.",
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    })
    .finally(() => {
      setIsTyping(false);
    });
  };

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000, fontFamily: 'inherit' }}>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: '#3b82f6',
            color: '#fff',
            border: 'none',
            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <NavIcon name="bolt" size={28} color="#fff" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          width: '380px',
          height: '520px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.3)',
          animation: 'slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <NavIcon name="bolt" size={20} color="#fff" />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Portal Assistant</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', opacity: 0.8 }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }}></div>
                  Active Now
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', opacity: 0.6, cursor: 'pointer' }}>
               <NavIcon name="chevron-right" size={20} color="#fff" />
            </button>
          </div>

          {/* Messages */}
          <div 
            ref={scrollRef}
            style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              background: '#f8fafc'
            }}
          >
            {messages.map(msg => (
              <div key={msg.id} style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: msg.sender === 'user' ? '18px 18px 2px 18px' : '18px 18px 18px 2px',
                  background: msg.sender === 'user' ? '#3b82f6' : '#fff',
                  color: msg.sender === 'user' ? '#fff' : '#1e293b',
                  fontSize: '14px',
                  lineHeight: 1.5,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  border: msg.sender === 'bot' ? '1px solid #e2e8f0' : 'none'
                }}>
                  {msg.text}
                </div>
                <span style={{ fontSize: '10px', color: '#94a3b8', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
                  {msg.time}
                </span>
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', padding: '12px 16px', borderRadius: '18px', background: '#e2e8f0', display: 'flex', gap: '4px' }}>
                <div className="dot" style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%' }}></div>
                <div className="dot" style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%' }}></div>
                <div className="dot" style={{ width: '4px', height: '4px', background: '#94a3b8', borderRadius: '50%' }}></div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ padding: '0 20px 12px', display: 'flex', gap: '8px', overflowX: 'auto', whiteSpace: 'nowrap' }}>
             {['Masalah IT', 'Info HR', 'Layanan Fasilitas'].map(label => (
               <button 
                key={label}
                onClick={() => { setInputValue(label); }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  border: '1px solid #e2e8f0',
                  background: '#fff',
                  fontSize: '12px',
                  color: '#64748b',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
               >
                 {label}
               </button>
             ))}
          </div>

          {/* Input */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '12px', alignItems: 'center', background: '#fff' }}>
            <input 
              type="text" 
              placeholder="Tulis pesan..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              style={{
                flex: 1,
                border: 'none',
                outline: 'none',
                fontSize: '14px',
                color: '#1e293b'
              }}
            />
            <button 
              onClick={handleSend}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <NavIcon name="solutions" size={20} color="#3b82f6" />
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .dot {
          animation: blink 1.4s infinite both;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink {
          0% { opacity: 0.2; }
          20% { opacity: 1; }
          100% { opacity: 0.2; }
        }
      `}</style>
    </div>
  );
}
