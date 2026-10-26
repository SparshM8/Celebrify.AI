import React, { useState, useEffect } from 'react';
import { useEvent } from '../context/EventContext';
import { generateTailoredEventPlan } from '../services/geminiService';
import { Sparkles, Calendar, Users, DollarSign, Heart, Accessibility, ArrowRight, ArrowLeft, X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const OCCASIONS = [
  { id: "Wedding", label: "Wedding Celebration", icon: "💍", desc: "Ceremony, reception & dinner" },
  { id: "Milestone Birthday", label: "Milestone Birthday", icon: "🎂", desc: "18th, 21st, 30th, 50th jubilees" },
  { id: "Community Event", label: "Community & Cultural Fair", icon: "🎪", desc: "Festivals, fundraisers & block parties" },
  { id: "Anniversary Celebration", label: "Anniversary / Gala", icon: "🥂", desc: "Silver, golden or charity galas" }
];

const PRIORITY_OPTIONS = [
  "Gourmet Dining & Signature Bar",
  "Cinematic Photography & Film",
  "High-Energy Live Band & DJ",
  "Breathtaking Florals & Themed Decor",
  "City Permits, Crowd Safety & Staging",
  "Interactive Games & Icebreakers",
  "Custom Photo Booth & Keepsakes",
  "Luxury Venue & Scenic Views"
];

export default function WizardModal({ isOpen, onClose }) {
  const { addEvent } = useEvent();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Form State
  const [occasion, setOccasion] = useState("Wedding");
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState(1000000);
  const [currency, setCurrency] = useState("₹");
  const [guestCount, setGuestCount] = useState(100);
  const [venueType, setVenueType] = useState("Indoor Ballroom / Hall");
  const [date, setDate] = useState("2026-11-20");
  const [priorities, setPriorities] = useState(["Gourmet Dining & Signature Bar", "Cinematic Photography & Film"]);
  const [culturalNuances, setCulturalNuances] = useState("");
  const [accessibilityNeeds, setAccessibilityNeeds] = useState("");

  if (!isOpen) return null;

  const togglePriority = (p) => {
    if (priorities.includes(p)) {
      setPriorities(priorities.filter(item => item !== p));
    } else {
      if (priorities.length < 3) {
        setPriorities([...priorities, p]);
      }
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const generatedPlan = await generateTailoredEventPlan({
        occasion,
        title: title || `${occasion} Celebration`,
        budget,
        currency,
        guestCount,
        venueType,
        date,
        priorities,
        culturalNuances,
        accessibilityNeeds
      });

      const newEventObj = {
        id: `event-${Date.now()}`,
        title: title || `${occasion} Celebration`,
        occasion,
        date,
        location: venueType,
        currency,
        budget: Number(budget),
        guestCount: Number(guestCount),
        venueType,
        priorities,
        culturalNuances: culturalNuances || "Open & inclusive",
        accessibilityNeeds: accessibilityNeeds || "Standard accessible pathways",
        themeTitle: generatedPlan.themeTitle,
        conceptSummary: generatedPlan.conceptSummary,
        colorPalette: generatedPlan.colorPalette || [],
        budgetCategories: generatedPlan.budgetBreakdown.map((b, idx) => ({
          id: `cat-gen-${idx}`,
          name: b.category,
          allocated: b.amount,
          spent: 0,
          notes: b.notes
        })),
        tasks: [
          { id: `t-${Date.now()}-1`, title: `Secure ${venueType} Contract`, phase: "6 Months Out", dueDate: "Phase 1", status: "todo", dependencies: [], isDelayed: false, delayDays: 0 },
          { id: `t-${Date.now()}-2`, title: "Finalize Key Vendor Agreements (Catering & Music)", phase: "4 Months Out", dueDate: "Phase 2", status: "todo", dependencies: [`t-${Date.now()}-1`], isDelayed: false, delayDays: 0 },
          { id: `t-${Date.now()}-3`, title: "Send Invitations & Collect RSVPs / Dietary Info", phase: "2 Months Out", dueDate: "Phase 3", status: "todo", dependencies: [`t-${Date.now()}-2`], isDelayed: false, delayDays: 0 },
          { id: `t-${Date.now()}-4`, title: "Final Headcount & Run of Show Rehearsal", phase: "1 Week Out", dueDate: "Phase 4", status: "todo", dependencies: [`t-${Date.now()}-3`], isDelayed: false, delayDays: 0 }
        ],
        vendors: [
          {
            id: `v-${Date.now()}-1`,
            category: "Venue",
            name: `${venueType} Partner`,
            status: "shortlisted",
            contact: "inquiries@venue.com",
            quotes: [{ name: "Standard Package", price: Math.round(budget * 0.32), rating: 4.8, highlights: "Covers base rental and setup" }]
          },
          {
            id: `v-${Date.now()}-2`,
            category: "Catering",
            name: "Premier Culinary Group",
            status: "shortlisted",
            contact: "catering@culinary.com",
            quotes: [{ name: "Custom Tailored Menu", price: Math.round(budget * 0.30), rating: 4.9, highlights: `Full service for ${guestCount} guests` }]
          }
        ]
      };

      addEvent(newEventObj);

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if not supported
      }

      onClose();
    } catch (err) {
      console.error("Error generating plan:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="wizard-modal-title">
      <div className="modal-content glass-panel" style={{ padding: '32px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.825rem', fontWeight: 600 }}>
              <Sparkles size={15} />
              <span>Step {step} of 4: Situational Intake & AI Architect</span>
            </div>
            <h2 id="wizard-modal-title" style={{ fontSize: '1.4rem', marginTop: '4px' }}>
              {step === 1 && "What are we celebrating?"}
              {step === 2 && "Scale, Budget & Location"}
              {step === 3 && "Core Priorities & Must-Haves"}
              {step === 4 && "Cultural Traditions & Inclusivity"}
            </h2>
          </div>
          <button 
            onClick={onClose}
            aria-label="Close modal"
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* STEP 1: OCCASION & TITLE */}
        {step === 1 && (
          <div>
            <div className="input-group">
              <label className="input-label" htmlFor="event-title-input">Celebration Name / Headline</label>
              <input 
                id="event-title-input"
                type="text" 
                className="input-field" 
                placeholder="e.g., Liam & Sophia's Rooftop Nuptials"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label className="input-label" style={{ display: 'block', marginBottom: '8px' }}>Select Occasion Vertical</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                {OCCASIONS.map(occ => (
                  <div 
                    key={occ.id}
                    onClick={() => setOccasion(occ.id)}
                    style={{
                      background: occasion === occ.id ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${occasion === occ.id ? 'var(--accent-primary)' : 'var(--border-glass)'}`,
                      borderRadius: 'var(--radius-md)',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: occasion === occ.id ? '0 0 16px rgba(99, 102, 241, 0.3)' : 'none'
                    }}
                  >
                    <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{occ.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFF' }}>{occ.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>{occ.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: SCALE, BUDGET & LOCATION */}
        {step === 2 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="event-budget-input">Total Budget ({currency})</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    aria-label="Currency"
                    value={currency} 
                    onChange={e => setCurrency(e.target.value)}
                    className="select-field" 
                    style={{ width: '75px' }}
                  >
                    <option value="₹">₹ INR (Rupees)</option>
                    <option value="$">$ USD</option>
                    <option value="€">€ EUR</option>
                    <option value="£">£ GBP</option>
                  </select>
                  <input 
                    id="event-budget-input"
                    type="number" 
                    className="input-field" 
                    value={budget} 
                    onChange={e => setBudget(e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="event-guest-input">Estimated Guest Count</label>
                <input 
                  id="event-guest-input"
                  type="number" 
                  className="input-field" 
                  value={guestCount} 
                  onChange={e => setGuestCount(e.target.value)}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label className="input-label" htmlFor="event-venue-select">Venue Setting</label>
                <select 
                  id="event-venue-select"
                  className="select-field"
                  value={venueType}
                  onChange={e => setVenueType(e.target.value)}
                >
                  <option value="Indoor Ballroom / Hall">Indoor Ballroom / Hall</option>
                  <option value="Outdoor Garden & Lawn">Outdoor Garden & Lawn</option>
                  <option value="Industrial Warehouse / Loft">Industrial Warehouse / Loft</option>
                  <option value="Public Park & Amphitheater">Public Park & Amphitheater</option>
                  <option value="Waterfront / Beach Resort">Waterfront / Beach Resort</option>
                  <option value="Private Estate / Residence">Private Estate / Residence</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="event-date-input">Target Event Date</label>
                <input 
                  id="event-date-input"
                  type="date" 
                  className="input-field" 
                  value={date} 
                  onChange={e => setDate(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PRIORITIES & MUST-HAVES */}
        {step === 3 && (
          <div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Select up to 3 non-negotiable priorities. The GenAI engine will bias budget allocation and vendor checklists to protect these items during financial tradeoffs.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
              {PRIORITY_OPTIONS.map(p => {
                const isSelected = priorities.includes(p);
                return (
                  <div
                    key={p}
                    onClick={() => togglePriority(p)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: isSelected ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-glass)'}`,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.85rem',
                      fontWeight: isSelected ? 600 : 400,
                      color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'}`,
                      background: isSelected ? 'var(--accent-primary)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {isSelected && <Check size={12} color="#FFF" />}
                    </div>
                    <span>{p}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: CULTURAL & ACCESSIBILITY PERSONALIZATION */}
        {step === 4 && (
          <div>
            <div className="input-group">
              <label className="input-label" htmlFor="event-cultural-input">
                Cultural, Religious, or Family Customs (Bonus High-Impact)
              </label>
              <textarea
                id="event-cultural-input"
                className="textarea-field"
                rows={3}
                placeholder="e.g., Traditional tea ceremony, Mehendi rituals, Kosher/Halal dietary options, or 90s hip-hop music tribute."
                value={culturalNuances}
                onChange={e => setCulturalNuances(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="event-accessibility-input">
                Accessibility, Sensory, or Dietary Accommodations
              </label>
              <textarea
                id="event-accessibility-input"
                className="textarea-field"
                rows={3}
                placeholder="e.g., Step-free wheelchair access, ASL interpreter on stage, designated quiet sensory chillout room, strict nut-free labeling."
                value={accessibilityNeeds}
                onChange={e => setAccessibilityNeeds(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-glass)' }}>
          {step > 1 ? (
            <button 
              onClick={() => setStep(step - 1)} 
              className="btn btn-secondary btn-sm"
              disabled={isGenerating}
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button 
              onClick={() => setStep(step + 1)} 
              className="btn btn-primary btn-sm"
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="btn btn-primary"
              style={{ background: 'var(--gradient-celebration)', padding: '12px 24px' }}
            >
              <Sparkles size={18} />
              <span>{isGenerating ? "Synthesizing Master Plan..." : "Generate Tailored Plan with AI"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
