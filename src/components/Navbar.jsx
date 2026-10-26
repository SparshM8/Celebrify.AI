import React from 'react';
import { useEvent } from '../context/EventContext';
import { Sparkles, Calendar, PlusCircle, Key, FileText, Printer, CheckCircle2 } from 'lucide-react';
import { getApiKey } from '../services/geminiService';

export default function Navbar({ onOpenWizard, onOpenApiKey, onOpenSubmissionKit, onOpenPrint }) {
  const { events, currentEvent, currentEventId, setCurrentEventId } = useEvent();
  const hasApiKey = Boolean(getApiKey());

  return (
    <header className="no-print glass-panel" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderRadius: 0,
      borderTop: 'none',
      borderLeft: 'none',
      borderRight: 'none',
      background: 'rgba(10, 14, 23, 0.88)',
      padding: '12px 24px',
      marginBottom: '20px'
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
        {/* Brand / Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'var(--gradient-celebration)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={22} color="#FFFFFF" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em', color: '#FFF' }}>
                Celebrify<span style={{ color: 'var(--accent-gold)' }}>.AI</span>
              </span>
              <span className="badge badge-indigo" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                Challenge 5
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              GenAI Celebration & Event Planner Assistant
            </div>
          </div>
        </div>

        {/* Preset Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={18} color="var(--accent-gold)" />
          <select 
            aria-label="Select Active Event"
            value={currentEventId} 
            onChange={(e) => setCurrentEventId(e.target.value)}
            className="select-field"
            style={{ width: 'auto', minWidth: '240px', padding: '8px 12px', fontSize: '0.875rem' }}
          >
            {events.map(ev => (
              <option key={ev.id} value={ev.id}>
                {ev.occasion === 'Wedding' ? '💍 ' : ev.occasion.includes('Birthday') ? '🎂 ' : '🎪 '}
                {ev.title}
              </option>
            ))}
          </select>

          <button 
            onClick={onOpenWizard}
            className="btn btn-primary btn-sm"
            title="Create tailored event with AI"
          >
            <PlusCircle size={16} />
            <span>New Plan</span>
          </button>
        </div>

        {/* Global Action Tools */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* API Key Modal Button */}
          <button 
            onClick={onOpenApiKey}
            className="btn btn-secondary btn-sm"
            title="Configure Gemini API Key"
            style={{ borderColor: hasApiKey ? 'rgba(16, 185, 129, 0.4)' : undefined }}
          >
            <Key size={15} color={hasApiKey ? '#10B981' : 'var(--text-secondary)'} />
            <span>{hasApiKey ? 'Gemini Live' : 'AI Engine (Ready)'}</span>
            {hasApiKey && <CheckCircle2 size={13} color="#10B981" />}
          </button>

          {/* Submission Kit Modal Button */}
          <button 
            onClick={onOpenSubmissionKit}
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(99, 102, 241, 0.12)', borderColor: 'rgba(99, 102, 241, 0.35)', color: '#C7D2FE' }}
            title="Copy texts for Hack2Skill submission form"
          >
            <FileText size={15} color="#A5B4FC" />
            <span>Submission Kit</span>
          </button>

          {/* Print Dossier Button */}
          <button 
            onClick={onOpenPrint}
            className="btn btn-secondary btn-sm"
            title="Print or export complete Event Brief"
          >
            <Printer size={15} />
            <span>Export Brief</span>
          </button>
        </div>
      </div>
    </header>
  );
}
