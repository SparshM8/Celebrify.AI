import React from 'react';
import { useEvent } from '../../context/EventContext';
import { Calendar, Users, DollarSign, MapPin, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Shield, Heart } from 'lucide-react';

export default function OverviewDashboard({ onSwitchTab }) {
  const { currentEvent } = useEvent();

  const totalBudget = currentEvent.budget || 20000;
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.85) 0%, rgba(30, 27, 75, 0.45) 100%)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <span className="badge badge-gold">
                {currentEvent.occasion}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="var(--accent-rose)" />
                {currentEvent.location}
              </span>
            </div>

            <h1 style={{
              fontSize: '2.3rem',
              marginBottom: '10px',
              lineHeight: 1.2,
              background: 'linear-gradient(135deg, #FFFFFF 65%, #FDE68A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 20px rgba(245, 158, 11, 0.2)'
            }}>
              {currentEvent.title}
            </h1>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '780px', lineHeight: 1.6 }}>
              {currentEvent.conceptSummary || "A bespoke GenAI-architected celebration orchestrating budget integrity, dynamic task sequencing, and curated attendee experiences."}
            </p>
          </div>

          {/* Countdown Clock Badge */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 24px',
            textAlign: 'center',
            minWidth: '160px'
          }}>
            <div style={{ fontSize: '2.2rem', fontFamily: 'var(--font-heading)', fontWeight: 800, color: 'var(--accent-gold)' }}>
              {daysRemaining}
            </div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
              Days Remaining
            </div>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
              <Calendar size={13} />
              <span>{currentEvent.date}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Metric Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {/* Budget Health */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => onSwitchTab('budget')}>
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
              <DollarSign size={18} color="var(--accent-gold)" />
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
            {currentEvent.currency}{totalSpent.toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {currentEvent.currency}{totalBudget.toLocaleString()}</span>
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

        {/* Guest Scale & Venue */}
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => onSwitchTab('scenario')}>
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
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
            {currentEvent.guestCount} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>Confirmed Attendees</span>
          </div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => onSwitchTab('timeline')}>
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
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
            {completedTasks} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {totalTasks} Tasks Completed</span>
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
        <div className="glass-panel glass-panel-hover" style={{ padding: '24px', cursor: 'pointer' }} onClick={() => onSwitchTab('vendors')}>
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
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#FFF' }}>
            {bookedVendors} <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {totalVendors} Booked</span>
          </div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            {totalVendors - bookedVendors > 0 
              ? `${totalVendors - bookedVendors} vendors in quotes / negotiation` 
              : "All primary vendors finalized!"}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Compare Quotes Matrix</span>
            <ArrowRight size={12} />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Aesthetic Theme & Inclusivity */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        {/* Aesthetic Concept & Color Swatches */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Sparkles size={18} color="var(--accent-gold)" />
            <h3 style={{ fontSize: '1.15rem' }}>AI Theme & Harmonious Color Palette</h3>
          </div>
          <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#FFFFFF', marginBottom: '6px' }}>
            {currentEvent.themeTitle || "Tailored Celebration Aesthetic"}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
            Curated palette designed to ensure photography consistency, floral balance, and digital stationery harmony.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '10px', marginBottom: '20px' }}>
            {currentEvent.colorPalette?.map((c, idx) => (
              <div key={idx} style={{ textAlign: 'center' }}>
                <div style={{
                  height: '48px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: c.hex,
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                  marginBottom: '6px'
                }} />
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#FFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.name}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {c.hex}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '14px'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Strategic Must-Have Priorities
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {currentEvent.priorities?.map((p, idx) => (
                <span key={idx} className="badge badge-indigo" style={{ padding: '4px 10px' }}>
                  ★ {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cultural & Accessibility Inclusivity Studio */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Heart size={18} color="var(--accent-rose)" />
            <h3 style={{ fontSize: '1.15rem' }}>Personalization: Cultural Customs & Accessibility</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Reflecting genuine personal identity and universal hospitality so every attendee feels welcomed and respected.
          </p>

          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#A5B4FC', marginBottom: '6px' }}>
              Cultural, Religious, & Family Traditions:
            </div>
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              lineHeight: 1.5
            }}>
              {currentEvent.culturalNuances || "Open, contemporary celebration welcoming diverse guests."}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#6EE7B7', marginBottom: '6px' }}>
              Universal Accessibility & Inclusivity Accommodations:
            </div>
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              border: '1px solid var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              fontSize: '0.85rem',
              color: 'var(--text-primary)',
              lineHeight: 1.5
            }}>
              {currentEvent.accessibilityNeeds || "Standard ADA compliant venue access verified."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
