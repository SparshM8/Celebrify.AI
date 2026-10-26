import React, { useState, useEffect } from 'react';
import { Copy, Check, FileText, Share2, Video, Sparkles, X } from 'lucide-react';

export default function SubmissionKitModal({ isOpen, onClose }) {
  const [copiedKey, setCopiedKey] = useState(null);

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

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const deployedChangesText = `Celebrify AI v1.0.0 — Production Release for [Challenge 5] Celebration & Event Planner:
1. Interactive Situational Intake Wizard: Gathers budget, scale, priorities, cultural traditions, and accessibility needs to craft custom master plans.
2. Dynamic Constraint & Tradeoff Budget Engine: Real-time spend tracking with an AI Tradeoff Advisor suggesting structured alternatives when budgets are trimmed.
3. Sequence-based Cascading Task Management: Implements dependency tracking where marking an upstream milestone delayed dynamically cascades downstream deadlines.
4. Vendor Hub & Quote Comparison Matrix: Multi-vendor tracking, automated AI RFP email drafting, and side-by-side quote evaluation on cost vs value.
5. High-Impact Bonus: "What-If" Scenario Ripple Simulator dynamically recalculates catering, rentals, staffing, and venue capacity risks when guest counts shift.
6. Responsive accessible UI (WCAG 2.1 AA) with instant print-ready Event Dossier export.`;

  const genAiServicesText = `GenAI Architecture & Implementation:
1. Model & Engine: Powered by Google Gemini (Gemini 1.5 Flash via REST API with structured JSON output schemas) backed by an offline dynamic reasoning engine for zero-friction evaluation.
2. Where Utilized:
   - Situational Master Plan Generation: Synthesizes cohesive theme concepts, harmonious 5-color palettes, and customized budget category splits based on user priorities.
   - Financial Constraint & Tradeoff Advisor: Analyzes budget cuts and recommends 3 concrete, realistic tradeoffs with pros/cons while protecting user-designated must-haves.
   - Dynamic Task Cascading & Critical Path Analysis: Flags schedule bottlenecks when milestones slip.
   - Vendor Coordination & RFP Generator: Crafts custom inquiry emails and generates objective quote comparison scores.
   - Creative Studio: Generates tailored speeches/toasts, WhatsApp invitation blurbs, and themed entertainment icebreakers.
3. Security: Zero hardcoded keys. Client-side ephemeral sessionStorage key injection.`;

  const linkedInPostText = `🎉 Excited to share Celebrify AI — my project for the AI Event Planner Challenge!

Event planning is notoriously fragmented, volatile, and stressful. I built Celebrify AI to move far beyond superficial chatbots into an operational coordination engine that solves real planning problems.

Key Innovations:
✨ Situational Intake Architect: Customizes plans for Weddings, Birthdays, and Community events with deep cultural and accessibility personalization.
📊 Dynamic Constraint & Tradeoff Budget: An AI Tradeoff Advisor that knows what to sacrifice and what to protect when budgets shift.
⏳ Cascading Delay Engine: Downstream milestones automatically recalculate when an upstream vendor is delayed.
⚡ Bonus "What-If" Ripple Simulator: Live sensitivity tool showing how guest count shifts ripple across catering, rentals, staffing, and venue capacity risks.
🤝 Vendor Quote Comparison Matrix: Evaluates bids objectively against user priorities.

Built with React 18, Vite, and Google Gemini API (structured JSON output with zero-hardcoding security compliance).

Check out the demo and open-source repo!
#BuildWithAI #GeminiSprint #GenerativeAI #WebDev #ReactJS #EventTech`;

  const videoScriptText = `🎬 3-Minute Video Walkthrough Script:
[0:00 - 0:30] Introduction: Showcase Celebrify AI and highlight how it solves the core problem: moving beyond generic chatbots into an actionable coordination engine.
[0:30 - 1:00] Situational Intake Wizard: Demonstrate creating a new celebration with budget, top priorities, and cultural/accessibility preferences.
[1:00 - 1:30] Dynamic Constraint & Tradeoff Budget: Show the AI Tradeoff Advisor suggesting alternative options when reducing category budgets.
[1:30 - 2:00] Cascading Task Management: Click "Report Delay" on a venue contract milestone and show how downstream tasks dynamically reschedule.
[2:00 - 2:30] Bonus Feature - What-If Scenario Ripple Simulator: Drag the guest slider and show live recalculations across catering, tables, staffing, and venue capacity warnings.
[2:30 - 3:00] Vendor Quote Comparison & Creative Studio: Show the quote comparison matrix, AI toast generator, and printable Event Dossier export.`;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="submission-kit-title">
      <div className="modal-content glass-panel" style={{ padding: '32px', maxWidth: '820px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={22} color="#818CF8" />
            </div>
            <div>
              <h2 id="submission-kit-title" style={{ fontSize: '1.35rem' }}>Hack2Skill Submission Kit</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pre-formatted copy-ready answers directly mapped to the submission form fields</p>
            </div>
          </div>
          <button onClick={onClose} aria-label="Close" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Section 1: Describe changes */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>
              1. Describe the changes/updates made in the deployed version *
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>({deployedChangesText.length}/1024 chars)</span>
            </div>
            <button 
              onClick={() => handleCopy(deployedChangesText, 'changes')}
              className="btn btn-secondary btn-sm"
            >
              {copiedKey === 'changes' ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copiedKey === 'changes' ? "Copied!" : "Copy Field"}</span>
            </button>
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-line',
            maxHeight: '120px',
            overflowY: 'auto'
          }}>
            {deployedChangesText}
          </div>
        </div>

        {/* Section 2: Gen AI services utilized */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>
              2. Mention the Gen AI services utilized in the submission, and where did you utilize it? *
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '8px' }}>({genAiServicesText.length}/1024 chars)</span>
            </div>
            <button 
              onClick={() => handleCopy(genAiServicesText, 'services')}
              className="btn btn-secondary btn-sm"
            >
              {copiedKey === 'services' ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copiedKey === 'services' ? "Copied!" : "Copy Field"}</span>
            </button>
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-line',
            maxHeight: '120px',
            overflowY: 'auto'
          }}>
            {genAiServicesText}
          </div>
        </div>

        {/* Section 3: LinkedIn Post */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>
              <Share2 size={16} color="var(--accent-primary)" />
              <span>3. LinkedIn Post Copy</span>
            </div>
            <button 
              onClick={() => handleCopy(linkedInPostText, 'linkedin')}
              className="btn btn-secondary btn-sm"
            >
              {copiedKey === 'linkedin' ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copiedKey === 'linkedin' ? "Copied!" : "Copy Post"}</span>
            </button>
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-line',
            maxHeight: '120px',
            overflowY: 'auto'
          }}>
            {linkedInPostText}
          </div>
        </div>

        {/* Section 4: Video Demo Walkthrough Script */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: '#FFF' }}>
              <Video size={16} color="var(--accent-gold)" />
              <span>4. Project Demo Video Walkthrough Guide (3 Minutes)</span>
            </div>
            <button 
              onClick={() => handleCopy(videoScriptText, 'video')}
              className="btn btn-secondary btn-sm"
            >
              {copiedKey === 'video' ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
              <span>{copiedKey === 'video' ? "Copied!" : "Copy Script"}</span>
            </button>
          </div>
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            fontSize: '0.825rem',
            color: 'var(--text-secondary)',
            whiteSpace: 'pre-line',
            maxHeight: '120px',
            overflowY: 'auto'
          }}>
            {videoScriptText}
          </div>
        </div>
      </div>
    </div>
  );
}
