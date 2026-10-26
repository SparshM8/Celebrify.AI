import React from 'react';
import { useEvent } from '../../context/EventContext';
import { 
  Calendar, Users, IndianRupee, MapPin, Sparkles, CheckCircle2, 
  ArrowRight, Shield, Heart, Sliders, Zap, Check, ExternalLink,
  Layers, Clock, Award, Star
} from 'lucide-react';

export default function OverviewDashboard({ onSwitchTab, onOpenWizard }) {
  const { currentEvent } = useEvent();

  const totalBudget = currentEvent.budget || 1500000;
  const totalSpent = currentEvent.budgetCategories?.reduce((acc, cat) => acc + (cat.spent || 0), 0) || 0;
  const remainingBudget = totalBudget - totalSpent;
  const budgetPercent = Math.min(100, Math.round((totalSpent / totalBudget) * 100));

  const totalTasks = currentEvent.tasks?.length || 0;
  const completedTasks = currentEvent.tasks?.filter(t => t.status === 'done').length || 0;
  const taskPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const bookedVendors = currentEvent.vendors?.filter(v => v.status === 'booked' || v.status === 'paid').length || 0;
  const totalVendors = currentEvent.vendors?.length || 0;

  // Calculate days remaining
  const eventDate = new Date(currentEvent.date || '2026-11-20');
  const today = new Date();
  const diffTime = eventDate - today;
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      
      {/* ========================================================
          1. NEXORA-GRADE HERO SECTION
          ======================================================== */}
      <section className="hero-section" aria-label="Hero Section">
        {/* Left Column: Typography & CTAs */}
        <div>
          {/* Announcement Pill Badge */}
          <div style={{ marginBottom: '20px' }}>
            <span className="pill-badge" style={{ borderColor: 'rgba(168, 85, 247, 0.4)', background: 'rgba(168, 85, 247, 0.08)' }}>
              <span className="pulse-dot" />
              <span style={{ color: '#E9D5FF', fontWeight: 600 }}>Autonomous Event Orchestration Engine</span>
              <span style={{ color: 'var(--text-muted)' }}>•</span>
              <span style={{ color: '#FCD34D' }}>Powered by Gemini 3.8 Flash ⚡</span>
            </span>
          </div>

          {/* Luxury Headline with Italic Serif Gradient Contrast */}
          <h1 className="hero-title">
            The future of <br />
            celebrations, <br />
            <span className="hero-reimagined">reimagined.</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle">
            Move beyond generic AI suggestions. Celebrify.AI translates dreams into dynamically constrained budgets in Indian Rupees (₹), cascading timelines with automated delay mitigation, and AI-negotiated vendor RFPs.
          </p>

          {/* Action CTAs */}
          <div className="hero-actions">
            <button 
              onClick={onOpenWizard}
              className="btn btn-primary btn-lg"
              title="Launch the 4-step AI planning wizard"
            >
              <Sparkles size={18} />
              <span>Plan Celebration ↗</span>
            </button>

            <button 
              onClick={() => onSwitchTab('scenario')}
              className="btn btn-secondary btn-lg"
              title="Launch the High-Impact What-If Simulator"
            >
              <Sliders size={18} color="#C084FC" />
              <span>Test What-If Ripple Engine ▶</span>
            </button>
          </div>

          {/* Social Proof & Trust Badges */}
          <div className="hero-social-proof">
            <div className="avatar-stack">
              <div className="avatar-circle" style={{ background: 'linear-gradient(135deg, #EC4899, #F43F5E)' }} />
              <div className="avatar-circle" style={{ background: 'linear-gradient(135deg, #8B5CF6, #6366F1)' }} />
              <div className="avatar-circle" style={{ background: 'linear-gradient(135deg, #06B6D4, #3B82F6)' }} />
              <div className="avatar-circle" style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF' }}>
                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                <span>4.9 / 5 Rating</span>
                <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>•</span>
                <span style={{ color: '#FDE68A' }}>₹1.8 Cr+ Budgets Modeled</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Trusted for Indian Weddings, Birthdays & Community Festivals
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Floating 3D Translucent Celebration Orb Showcase */}
        <div className="hero-visual-wrapper">
          <div className="hero-glow-backdrop" />
          
          <img 
            src="/celebration_orb.jpg" 
            alt="Futuristic 3D Glass Celebration Orb" 
            className="hero-orb-img"
          />

          {/* Floating Glass Badge 1 (Top Left) */}
          <div className="floating-glass-card card-float-top">
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(236, 72, 153, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem'
            }}>
              💍
            </div>
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#FFFFFF' }}>
                {currentEvent.title}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold)' }}>
                {currentEvent.currency}{currentEvent.budget?.toLocaleString()} • {currentEvent.guestCount} Guests
              </div>
            </div>
          </div>

          {/* Floating Glass Badge 2 (Bottom Right) */}
          <div className="floating-glass-card card-float-bottom">
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={18} color="#10B981" />
            </div>
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#FFFFFF' }}>
                Zero Constraint Violations
              </div>
              <div style={{ fontSize: '0.72rem', color: '#6EE7B7' }}>
                100% Dynamic Cascading Engine
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. FLOATING STAT PILL BAR (Nexora-style 4 metrics)
          ======================================================== */}
      <div className="stat-pill-bar" aria-label="Key Performance Indicators">
        <div className="stat-pill-item">
          <div className="stat-pill-icon" style={{ background: 'rgba(245, 158, 11, 0.12)' }}>
            <IndianRupee size={20} color="var(--accent-gold)" />
          </div>
          <div>
            <div className="stat-pill-value">₹1.8 Cr+</div>
            <div className="stat-pill-label">Budgets Modeled (₹ INR)</div>
          </div>
        </div>

        <div className="stat-pill-divider" />

        <div className="stat-pill-item">
          <div className="stat-pill-icon" style={{ background: 'rgba(139, 92, 246, 0.12)' }}>
            <Clock size={20} color="#C084FC" />
          </div>
          <div>
            <div className="stat-pill-value">100%</div>
            <div className="stat-pill-label">Dynamic Task Cascading</div>
          </div>
        </div>

        <div className="stat-pill-divider" />

        <div className="stat-pill-item">
          <div className="stat-pill-icon" style={{ background: 'rgba(16, 185, 129, 0.12)' }}>
            <Shield size={20} color="#10B981" />
          </div>
          <div>
            <div className="stat-pill-value">0%</div>
            <div className="stat-pill-label">Capacity Violations</div>
          </div>
        </div>

        <div className="stat-pill-divider" />

        <div className="stat-pill-item">
          <div className="stat-pill-icon" style={{ background: 'rgba(236, 72, 153, 0.12)' }}>
            <Zap size={20} color="#F472B6" />
          </div>
          <div>
            <div className="stat-pill-value">&lt; 3 Min</div>
            <div className="stat-pill-label">RFP & Toast Generation</div>
          </div>
        </div>
      </div>

      {/* ========================================================
          3. TRUST & CELEBRATION VERTICALS BADGE BAR (ROBOK style)
          ======================================================== */}
      <div className="trust-bar">
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          ENGINEERED FOR BESPOKE EVENTS:
        </div>
        <div className="trust-item">💍 Indian Weddings</div>
        <div className="trust-item">•</div>
        <div className="trust-item">🎂 Milestone Birthdays</div>
        <div className="trust-item">•</div>
        <div className="trust-item">🎪 Community Festivals</div>
        <div className="trust-item">•</div>
        <div className="trust-item">🏢 Corporate Galas</div>
        <div className="trust-item">•</div>
        <div className="trust-item">🥂 Intimate Anniversaries</div>
      </div>

      {/* ========================================================
          4. ELEVATED ALL-IN-ONE CELEBRATION STUDIO
          ======================================================== */}
      <div className="workspace-container">
        {/* Workspace Title Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="pill-badge" style={{ fontSize: '0.72rem', padding: '3px 10px', color: '#A5B4FC', borderColor: 'rgba(165, 180, 252, 0.3)' }}>
              ALL-IN-ONE CELEBRATION STUDIO
            </span>
          </div>
          <h2 style={{ fontSize: '1.9rem', marginBottom: '8px' }}>
            Everything your celebration needs to <span className="gradient-text">succeed.</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '720px' }}>
            Real-time constraint tracking, timeline cascade simulations, and vendor intelligence synchronized in one workspace.
          </p>
        </div>

        {/* Active Celebration Hero Card */}
        <div className="glass-panel" style={{
          padding: '28px',
          marginBottom: '24px',
          border: '1px solid rgba(139, 92, 246, 0.28)',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(30, 27, 75, 0.5) 100%)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span className="badge badge-gold">
                  {currentEvent.occasion}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={15} color="var(--accent-rose)" />
                  {currentEvent.location}
                </span>
              </div>

              <h3 style={{
                fontSize: '1.85rem',
                marginBottom: '8px',
                lineHeight: 1.25,
                background: 'linear-gradient(135deg, #FFFFFF 65%, #FDE68A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {currentEvent.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', maxWidth: '760px', lineHeight: 1.6 }}>
                {currentEvent.conceptSummary || "A bespoke GenAI-architected celebration orchestrating budget integrity, dynamic task sequencing, and curated attendee experiences."}
              </p>
            </div>

            {/* Countdown Clock Badge */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.85)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-lg)',
              padding: '16px 22px',
              textAlign: 'center',
              minWidth: '150px'
            }}>
              <div style={{ fontSize: '2.1rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--accent-gold)' }}>
                {daysRemaining}
              </div>
              <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
                Days Remaining
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                <Calendar size={13} />
                <span>{currentEvent.date}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Bento Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '28px' }}>
          {/* Budget Health */}
          <div className="glass-panel glass-panel-hover" style={{ padding: '22px', cursor: 'pointer' }} onClick={() => onSwitchTab('budget')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Budget Allocation</span>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <IndianRupee size={18} color="var(--accent-gold)" />
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>
              {currentEvent.currency}{totalSpent.toLocaleString()} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {currentEvent.currency}{totalBudget.toLocaleString()}</span>
            </div>
            {/* Progress bar */}
            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', margin: '14px 0 8px 0', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${budgetPercent}%`,
                background: budgetPercent > 90 ? 'var(--accent-rose)' : 'var(--accent-gold)',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>{budgetPercent}% Allocated</span>
              <span style={{ color: remainingBudget < 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)', fontWeight: 600 }}>
                {remainingBudget < 0 ? `Exceeded ${currentEvent.currency}${Math.abs(remainingBudget)}` : `${currentEvent.currency}${remainingBudget.toLocaleString()} Available`}
              </span>
            </div>
          </div>

          {/* Guest Scale & Seating */}
          <div className="glass-panel glass-panel-hover" style={{ padding: '22px', cursor: 'pointer' }} onClick={() => onSwitchTab('scenario')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Guest Scale & Seating</span>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Users size={18} color="#818CF8" />
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>
              {currentEvent.guestCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>Confirmed Attendees</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="badge badge-indigo" style={{ padding: '2px 8px' }}>
                {Math.ceil(currentEvent.guestCount / 8)} Tables (8-top)
              </span>
              <span>• {currentEvent.venueType?.split(' ')[0] || "Venue"}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Test "What-If" Ripple Simulator</span>
              <ArrowRight size={12} />
            </div>
          </div>

          {/* Milestone Execution */}
          <div className="glass-panel glass-panel-hover" style={{ padding: '22px', cursor: 'pointer' }} onClick={() => onSwitchTab('timeline')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Execution Milestones</span>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle2 size={18} color="var(--accent-emerald)" />
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>
              {completedTasks} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {totalTasks} Tasks Done</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', margin: '14px 0 8px 0', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${taskPercent}%`,
                background: 'var(--gradient-emerald)',
                borderRadius: '3px',
                transition: 'width 0.4s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span>{taskPercent}% Resolved</span>
              <span style={{ color: '#6EE7B7' }}>Active Sequence Tracking</span>
            </div>
          </div>

          {/* Vendor Coordination */}
          <div className="glass-panel glass-panel-hover" style={{ padding: '22px', cursor: 'pointer' }} onClick={() => onSwitchTab('vendors')}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Vendor Contracts</span>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: 'rgba(236, 72, 153, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Shield size={18} color="#F43F5E" />
              </div>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF' }}>
              {bookedVendors} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {totalVendors} Booked</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              {totalVendors - bookedVendors > 0 
                ? `${totalVendors - bookedVendors} vendors in quotes / negotiation` 
                : "All primary vendors finalized!"}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Compare Quotes Matrix</span>
              <ArrowRight size={12} />
            </div>
          </div>
        </div>

        {/* Bento Grid: Aesthetic Concept, Inclusivity & AI Recommendations */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
          {/* Aesthetic Concept & Color Swatches */}
          <div className="glass-panel" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Sparkles size={18} color="var(--accent-gold)" />
              <h4 style={{ fontSize: '1.1rem' }}>AI Theme & Harmonious Color Palette</h4>
            </div>
            <p style={{ fontSize: '0.925rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '4px' }}>
              {currentEvent.themeTitle || "Tailored Celebration Aesthetic"}
            </p>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
              Curated palette designed to ensure photography consistency, floral balance, and digital stationery harmony.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(75px, 1fr))', gap: '10px', marginBottom: '18px' }}>
              {currentEvent.colorPalette?.map((c, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{
                    height: '44px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: c.hex,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                    marginBottom: '6px'
                  }} />
                  <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    {c.hex}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '12px'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Strategic Must-Have Priorities
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {currentEvent.priorities?.map((p, idx) => (
                  <span key={idx} className="badge badge-indigo" style={{ padding: '3px 9px', fontSize: '0.72rem' }}>
                    ★ {p}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Cultural & Accessibility Inclusivity Studio */}
          <div className="glass-panel" style={{ padding: '26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <Heart size={18} color="var(--accent-rose)" />
              <h4 style={{ fontSize: '1.1rem' }}>Personalization: Cultural Customs & Accessibility</h4>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Reflecting genuine personal identity and universal hospitality so every attendee feels welcomed and respected.
            </p>

            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#A5B4FC', marginBottom: '6px' }}>
                Cultural, Religious, & Family Traditions:
              </div>
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                fontSize: '0.825rem',
                color: 'var(--text-primary)',
                lineHeight: 1.5
              }}>
                {currentEvent.culturalNuances || "Open, contemporary celebration welcoming diverse guests."}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6EE7B7', marginBottom: '6px' }}>
                Universal Accessibility & Inclusivity Accommodations:
              </div>
              <div style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                fontSize: '0.825rem',
                color: 'var(--text-primary)',
                lineHeight: 1.5
              }}>
                {currentEvent.accessibilityNeeds || "Standard ADA compliant venue access verified."}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          5. NEXORA-GRADE PRE-FOOTER CTA BANNER
          ======================================================== */}
      <div className="cta-banner">
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#FDE68A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
            READY TO GET STARTED?
          </div>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '6px' }}>
            Let's build something <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: '#FCD34D' }}>extraordinary</span> together.
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '0.9rem', maxWidth: '640px' }}>
            Launch the 4-step intake wizard or stress-test your event constraints using the real-time ripple simulator.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            onClick={onOpenWizard}
            className="btn btn-gold btn-lg"
            title="Create tailored event with AI"
          >
            <span>Plan Celebration ↗</span>
          </button>
          <button 
            onClick={() => onSwitchTab('scenario')}
            className="btn btn-secondary btn-lg"
            style={{ background: 'rgba(0, 0, 0, 0.35)', borderColor: 'rgba(255, 255, 255, 0.3)' }}
          >
            <span>Test What-If Engine ▶</span>
          </button>
        </div>
      </div>

    </div>
  );
}
