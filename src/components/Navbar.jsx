import React from 'react';
import { useEvent } from '../context/EventContext';
import { Sparkles, Calendar, PlusCircle, Key, FileText, Printer, CheckCircle2 } from 'lucide-react';
import { getApiKey } from '../services/geminiService';

export default function Navbar({ onOpenWizard, onOpenApiKey, onOpenSubmissionKit, onOpenPrint }) {
  const { events, currentEvent, currentEventId, setCurrentEventId } = useEvent();
  const hasApiKey = Boolean(getApiKey());

  return (
    <header className="no-print" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      background: 'rgba(5, 8, 17, 0.82)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '14px 28px',
      marginBottom: '20px',
      transition: 'all 0.25s ease'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand / Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 18px rgba(139, 92, 246, 0.45)'
          }}>
            <Sparkles size={20} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.025em', color: '#FFF' }}>
                Celebrify<span className="gradient-text">.AI</span>
              </span>
              <span className="pill-badge" style={{ fontSize: '0.68rem', padding: '2px 8px', color: '#C084FC', borderColor: 'rgba(192, 132, 252, 0.3)' }}>
                Challenge 5
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              GenAI Celebration & Event Planner Assistant
            </div>
          </div>
        </div>

        {/* Quick Presets Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '4px' }}>
            Presets:
          </span>
          {events.map(ev => {
            const isSelected = ev.id === currentEventId;
            const emoji = ev.occasion === 'Wedding' ? '💍' : ev.occasion.includes('Birthday') ? '🎂' : '🎪';
            const shortTitle = ev.occasion === 'Wedding' ? 'Wedding (₹15L)' : ev.occasion.includes('Birthday') ? 'Birthday (₹1.5L)' : 'Community (₹6L)';

            return (
              <button
                key={ev.id}
                onClick={() => setCurrentEventId(ev.id)}
                className="pill-badge"
                style={{
                  background: isSelected ? 'rgba(139, 92, 246, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                  borderColor: isSelected ? 'rgba(168, 85, 247, 0.6)' : 'var(--border-glass)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  fontWeight: isSelected ? 700 : 500,
                  boxShadow: isSelected ? '0 0 14px rgba(168, 85, 247, 0.35)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <span>{emoji}</span>
                <span>{shortTitle}</span>
              </button>
            );
          })}
        </div>

        {/* Action Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* API Key Status Pill */}
          <button 
            onClick={onOpenApiKey}
            className="pill-badge"
            style={{
              background: hasApiKey ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.04)',
              borderColor: hasApiKey ? 'rgba(16, 185, 129, 0.35)' : 'var(--border-glass)',
              cursor: 'pointer'
            }}
            title="Configure Gemini API Key (or use built-in offline reasoning engine)"
          >
            <span className={hasApiKey ? "pulse-dot" : ""} style={{ width: '7px', height: '7px', borderRadius: '50%', background: hasApiKey ? '#10B981' : '#F59E0B' }} />
            <span style={{ color: hasApiKey ? '#6EE7B7' : '#FCD34D', fontSize: '0.78rem' }}>
              {hasApiKey ? 'Gemini Live' : 'AI Engine (Ready)'}
            </span>
          </button>

          {/* Submission Kit Modal Button */}
          <button 
            onClick={onOpenSubmissionKit}
            className="btn btn-secondary btn-sm"
            style={{
              background: 'rgba(99, 102, 241, 0.12)',
              borderColor: 'rgba(99, 102, 241, 0.35)',
              color: '#C7D2FE'
            }}
            title="Copy texts for Hack2Skill submission form"
          >
            <FileText size={14} color="#A5B4FC" />
            <span>Submission Kit</span>
          </button>

          {/* New Plan Primary CTA */}
          <button 
            onClick={onOpenWizard}
            className="btn btn-primary btn-sm"
            title="Create tailored celebration plan with AI"
          >
            <PlusCircle size={15} />
            <span>Plan Celebration ↗</span>
          </button>
        </div>
      </div>
    </header>
  );
}
