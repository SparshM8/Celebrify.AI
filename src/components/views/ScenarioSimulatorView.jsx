import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { simulateScenarioRipple } from '../../services/geminiService';
import { Sliders, Users, AlertTriangle, TrendingUp, CheckCircle2, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export default function ScenarioSimulatorView() {
  const { currentEvent, updateCurrentEvent, showToast } = useEvent();

  const [deltaGuests, setDeltaGuests] = useState(25);
  const [tierMultiplier, setTierMultiplier] = useState(1.0);
  const [venueTypeShift, setVenueTypeShift] = useState(currentEvent.venueType || "Standard Ballroom");

  // Run real-time ripple simulation
  const ripple = simulateScenarioRipple({
    baseEvent: currentEvent,
    deltaGuests,
    venueTypeShift,
    tierMultiplier
  });

  const handleApplyScenarioToEvent = () => {
    updateCurrentEvent({
      guestCount: ripple.newGuests,
      budget: ripple.projectedTotalBudget,
      venueType: venueTypeShift
    });
    showToast(`Master plan updated! Headcount set to ${ripple.newGuests} and budget adjusted to ${currentEvent.currency}${ripple.projectedTotalBudget.toLocaleString()}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '28px', border: '1px solid rgba(168, 85, 247, 0.35)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#C084FC', fontSize: '0.825rem', fontWeight: 600 }}>
              <Sparkles size={16} />
              <span>High-Impact Bonus Feature: Scenario Analysis & Ripple Simulator</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', marginTop: '4px' }}>
              "What-If" Sensitivity & Ripple Effect Engine
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px', marginTop: '6px' }}>
              Observe how shifting an isolated variable—like inviting 30 more guests or upgrading the culinary tier—ripples dynamically through your catering budget, table rentals, timeline urgency, and venue capacity safety limits.
            </p>
          </div>

          <button
            onClick={handleApplyScenarioToEvent}
            className="btn btn-primary"
            style={{ background: 'var(--gradient-celebration)' }}
          >
            <span>Commit Scenario as Master Plan</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Main Grid: Controls vs Live Ripple Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Interactive Scenario Controls */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sliders size={18} color="var(--accent-gold)" />
            <span>Scenario Variables</span>
          </h3>

          {/* Slider 1: Guest Count Shift */}
          <div className="input-group" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="input-label" htmlFor="delta-guest-slider" style={{ marginBottom: 0 }}>
                Guest Count Variance (Delta)
              </label>
              <span className="badge badge-indigo" style={{ fontSize: '0.85rem', padding: '4px 10px' }}>
                {deltaGuests > 0 ? `+${deltaGuests}` : deltaGuests} Guests ({ripple.newGuests} Total)
              </span>
            </div>
            <input
              id="delta-guest-slider"
              type="range"
              min="-40"
              max="100"
              step="5"
              value={deltaGuests}
              onChange={e => setDeltaGuests(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>Base: {currentEvent.guestCount} guests</span>
              <span>Projected: {ripple.newGuests} guests</span>
            </div>
          </div>

          {/* Control 2: Service Tier Multiplier */}
          <div className="input-group" style={{ marginBottom: '24px' }}>
            <label className="input-label" style={{ marginBottom: '8px' }}>Culinary & Service Tier</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[
                { label: "Standard", mult: 1.0, desc: "Classic quality" },
                { label: "Artisan", mult: 1.25, desc: "+25% specialty" },
                { label: "Ultra-Luxe", mult: 1.5, desc: "+50% bespoke" }
              ].map(tier => (
                <div
                  key={tier.label}
                  onClick={() => setTierMultiplier(tier.mult)}
                  style={{
                    background: tierMultiplier === tier.mult ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${tierMultiplier === tier.mult ? 'var(--accent-primary)' : 'var(--border-glass)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#FFF' }}>{tier.label}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>{tier.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Control 3: Venue Atmosphere Shift */}
          <div className="input-group">
            <label className="input-label" htmlFor="scenario-venue-select">Venue Environment Shift</label>
            <select
              id="scenario-venue-select"
              className="select-field"
              value={venueTypeShift}
              onChange={e => setVenueTypeShift(e.target.value)}
            >
              <option value="Standard Ballroom / Hall">Standard Ballroom / Hall (Capacity 250)</option>
              <option value="Intimate Boutique">Intimate Boutique (Strict Cap: 75)</option>
              <option value="Outdoor Park & Amphitheater">Outdoor Park & Amphitheater (Capacity 500+)</option>
              <option value="Waterfront Estate Lawn">Waterfront Estate Lawn (Capacity 300)</option>
            </select>
          </div>
        </div>

        {/* Right Column: Cascading Ripple Matrix */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} color="var(--accent-emerald)" />
            <span>Real-Time Cascading Impact</span>
          </h3>

          {/* Financial Ripple Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '18px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Projected Total Event Spend</span>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: ripple.totalBudgetDelta > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'
              }}>
                {ripple.totalBudgetDelta > 0 ? `+${currentEvent.currency}${ripple.totalBudgetDelta.toLocaleString()}` : `${currentEvent.currency}${ripple.totalBudgetDelta.toLocaleString()}`}
              </span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFF' }}>
              {currentEvent.currency}{ripple.projectedTotalBudget.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              Catering delta: {ripple.breakdownChanges.catering.delta > 0 ? '+' : ''}{currentEvent.currency}{ripple.breakdownChanges.catering.delta.toLocaleString()} • Rentals: {ripple.breakdownChanges.rentals.delta > 0 ? '+' : ''}{currentEvent.currency}{ripple.breakdownChanges.rentals.delta.toLocaleString()}
            </div>
          </div>

          {/* Operational Logistical Shifts */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Required Tables (8-Top)</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '4px' }}>
                {ripple.tablesNeeded} Tables
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                +{ripple.tablesNeeded - Math.ceil(currentEvent.guestCount / 8)} compared to base
              </div>
            </div>

            <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Staffing Ratio Needed</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818CF8', marginTop: '4px' }}>
                {ripple.staffingRatioNeeded} Crew Members
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                1 server / bartender per 15 attendees
              </div>
            </div>
          </div>

          {/* Venue Capacity Alert */}
          <div style={{
            background: ripple.venueCapacityRisk === 'High Risk' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(16, 185, 129, 0.08)',
            border: `1px solid ${ripple.venueCapacityRisk === 'High Risk' ? 'rgba(244, 63, 94, 0.35)' : 'rgba(16, 185, 129, 0.25)'}`,
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            {ripple.venueCapacityRisk === 'High Risk' ? (
              <ShieldAlert size={18} color="#F43F5E" style={{ flexShrink: 0, marginTop: '2px' }} />
            ) : (
              <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
            )}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: ripple.venueCapacityRisk === 'High Risk' ? '#FDA4AF' : '#6EE7B7' }}>
                Venue Capacity: {ripple.venueCapacityRisk}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {ripple.venueWarning}
              </div>
            </div>
          </div>

          {/* Timeline Urgency Note */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '10px'
          }}>
            <AlertTriangle size={18} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                Timeline Impact: {ripple.timelineUrgency}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {ripple.timelineAdvice}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
