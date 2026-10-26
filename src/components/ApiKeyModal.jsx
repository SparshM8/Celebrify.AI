import React, { useState, useEffect } from 'react';
import { getApiKey, setApiKey } from '../services/geminiService';
import { ShieldCheck, Key, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose }) {
  const [keyInput, setKeyInput] = useState(getApiKey());
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(keyInput);
    setTestResult({ success: true, message: "API key saved in memory (sessionStorage)!" });
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    setApiKey("");
    setKeyInput("");
    setTestResult({ success: true, message: "Cleared. Engine will use local dynamic intelligence." });
  };

  const testConnection = async () => {
    if (!keyInput.trim()) {
      setTestResult({ success: false, message: "Please enter an API key first." });
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${keyInput.trim()}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Say 'OK' in JSON format: {\"status\": \"OK\"}" }] }]
        })
      });
      if (res.ok) {
        setTestResult({ success: true, message: "Connection verified! Gemini 1.5 Flash is active." });
      } else {
        const err = await res.json().catch(() => ({}));
        setTestResult({ success: false, message: err.error?.message || `API rejected key (${res.status})` });
      }
    } catch (e) {
      setTestResult({ success: false, message: `Network error: ${e.message}` });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="api-modal-title">
      <div className="modal-content glass-panel" style={{ padding: '28px' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Key size={20} color="#818CF8" />
            </div>
            <div>
              <h3 id="api-modal-title" style={{ fontSize: '1.2rem' }}>Google Gemini API Key</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Secure client-side configuration</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close modal"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Security Assurance Notice */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <ShieldCheck size={20} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '0.85rem', color: '#D1FAE5', lineHeight: 1.5 }}>
            <strong>Zero Hardcoding Compliance:</strong> Your API key is stored only in your browser's temporary <code>sessionStorage</code> and is <strong>never</strong> transmitted to any third-party server or written to the repository.
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="api-key-input">Gemini API Key</label>
          <input
            id="api-key-input"
            type="password"
            className="input-field"
            placeholder="AIzaSy..."
            value={keyInput}
            onChange={e => setKeyInput(e.target.value)}
          />
        </div>

        {testResult && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.85rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: testResult.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
            border: `1px solid ${testResult.success ? 'rgba(16, 185, 129, 0.3)' : 'rgba(244, 63, 94, 0.3)'}`,
            color: testResult.success ? '#6EE7B7' : '#FDA4AF'
          }}>
            {testResult.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{testResult.message}</span>
          </div>
        )}

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px dashed var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: '20px',
          fontSize: '0.825rem',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-gold)', marginBottom: '4px', fontWeight: 600 }}>
            <Sparkles size={14} />
            <span>Zero-Friction Offline Intelligence Included</span>
          </div>
          Don't have an API key right now? No problem! Celebrify AI includes a built-in real-time reasoning engine that dynamically calculates custom budgets, trade-offs, and ripple effects without requiring an active key.
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            {getApiKey() && (
              <button onClick={handleClear} className="btn btn-secondary btn-sm" style={{ color: '#FDA4AF' }}>
                Clear Key
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={testConnection} 
              disabled={testing || !keyInput}
              className="btn btn-secondary btn-sm"
            >
              {testing ? "Testing..." : "Test Connection"}
            </button>
            <button onClick={handleSave} className="btn btn-primary btn-sm">
              Save Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
