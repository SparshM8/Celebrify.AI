import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { analyzeVendorQuotes } from '../../services/geminiService';
import { Users, Mail, Sparkles, Check, ShieldCheck, DollarSign, Star, Copy, Plus, X } from 'lucide-react';

export default function VendorsView() {
  const { currentEvent, updateVendor, addVendor, showToast } = useEvent();
  const vendors = currentEvent.vendors || [];

  const [selectedVendorForInquiry, setSelectedVendorForInquiry] = useState(null);
  const [inquiryEmailText, setInquiryEmailText] = useState("");
  const [isDraftingInquiry, setIsDraftingInquiry] = useState(false);
  const [copiedInquiry, setCopiedInquiry] = useState(false);

  // Quote Comparison State
  const [selectedVendorForComparison, setSelectedVendorForComparison] = useState(null);
  const [quoteAnalysisResult, setQuoteAnalysisResult] = useState(null);
  const [isComparingQuotes, setIsComparingQuotes] = useState(false);

  // New Vendor Modal State
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [newCategory, setNewCategory] = useState("Catering");
  const [newVendorName, setNewVendorName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [newQuotePrice, setNewQuotePrice] = useState(2500);

  const handleDraftInquiry = async (vendor) => {
    setSelectedVendorForInquiry(vendor);
    setIsDraftingInquiry(true);
    setCopiedInquiry(false);
    
    // Simulate/Generate AI RFP inquiry
    const inquiry = `Subject: Inquiry for ${currentEvent.occasion} - ${currentEvent.title} (${currentEvent.date})

Dear ${vendor.name} Team,

I hope this message finds you well. We are organizing a ${currentEvent.occasion} on ${currentEvent.date} for approximately ${currentEvent.guestCount} guests in ${currentEvent.location}.

We are currently reviewing vendor partners for ${vendor.category} and were impressed by your work. Our top priorities for this event include: ${currentEvent.priorities?.join(', ') || 'exceptional guest experience'}.

Could you kindly share your availability for this date along with an itemized quotation covering:
1. Standard package inclusions and staffing ratios for ${currentEvent.guestCount} attendees.
2. Overtime policies and load-in/setup windows.
3. Your contingency protocols in case of weather or unexpected delays.
${currentEvent.culturalNuances ? `4. Accommodation for our cultural traditions: "${currentEvent.culturalNuances}".\n` : ''}
We aim to finalize our partner by next Friday. Looking forward to hearing from you!

Warm regards,
Event Planning Team`;

    setInquiryEmailText(inquiry);
    setIsDraftingInquiry(false);
  };

  const handleRunQuoteComparison = async (vendor) => {
    setSelectedVendorForComparison(vendor);
    setIsComparingQuotes(true);
    try {
      const res = await analyzeVendorQuotes(vendor.category, vendor.quotes || [], currentEvent);
      setQuoteAnalysisResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsComparingQuotes(false);
    }
  };

  const handleAddVendorSubmit = (e) => {
    e.preventDefault();
    if (!newVendorName.trim()) return;
    addVendor({
      id: `v-${Date.now()}`,
      category: newCategory,
      name: newVendorName.trim(),
      status: "shortlisted",
      contact: newContact.trim() || "contact@vendor.com",
      quotes: [{ name: "Standard Package", price: Number(newQuotePrice) || 2000, rating: 4.8, highlights: "Initial preliminary estimate" }]
    });
    setNewVendorName("");
    setNewContact("");
    setShowAddVendor(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.825rem', fontWeight: 600 }}>
              <ShieldCheck size={16} />
              <span>Mandatory Criterion #4: Vendor Coordination & Quote Comparison</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', marginTop: '4px' }}>
              Vendor Hub & Negotiation Matrix
            </h2>
          </div>

          <button onClick={() => setShowAddVendor(true)} className="btn btn-secondary btn-sm">
            <Plus size={16} />
            <span>Add New Vendor</span>
          </button>
        </div>
      </div>

      {/* Vendor Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
        {vendors.map(v => {
          const isBooked = v.status === 'booked' || v.status === 'paid';
          const quotes = v.quotes || [];

          return (
            <div key={v.id} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div>
                  <span className="badge badge-indigo" style={{ marginBottom: '6px' }}>{v.category}</span>
                  <h3 style={{ fontSize: '1.2rem', color: '#FFF' }}>{v.name}</h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{v.contact}</div>
                </div>

                <select
                  aria-label="Vendor Booking Status"
                  className="select-field"
                  style={{ width: 'auto', fontSize: '0.78rem', padding: '6px 10px' }}
                  value={v.status}
                  onChange={e => updateVendor(v.id, { status: e.target.value })}
                >
                  <option value="shortlisted">Shortlisted</option>
                  <option value="inquiry_sent">Inquiry Sent</option>
                  <option value="quote_received">Quote Received</option>
                  <option value="booked">Booked (Deposit Paid)</option>
                  <option value="paid">Fully Settled</option>
                </select>
              </div>

              {/* Quotations List */}
              <div style={{ background: 'rgba(15, 23, 42, 0.7)', borderRadius: 'var(--radius-md)', padding: '14px', marginBottom: '16px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Logged Quotations ({quotes.length})
                </div>

                {quotes.map((q, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: idx < quotes.length - 1 ? '1px solid var(--border-glass)' : 'none'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFF' }}>{q.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{q.highlights}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, color: 'var(--accent-gold)' }}>
                        {currentEvent.currency}{q.price.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#FCD34D', display: 'flex', alignItems: 'center', gap: '2px', justifyContent: 'flex-end' }}>
                        <Star size={11} fill="#FCD34D" />
                        <span>{q.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons: AI RFP & Compare Quotes */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => handleDraftInquiry(v)}
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                >
                  <Mail size={14} />
                  <span>Draft AI Inquiry</span>
                </button>

                <button
                  onClick={() => handleRunQuoteComparison(v)}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1, fontSize: '0.78rem' }}
                >
                  <Sparkles size={14} />
                  <span>Compare Quotes</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Inquiry Email Modal */}
      {selectedVendorForInquiry && (
        <div className="modal-backdrop" onClick={() => setSelectedVendorForInquiry(null)}>
          <div className="modal-content glass-panel" style={{ padding: '28px', maxWidth: '640px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={20} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1.2rem' }}>AI-Generated Vendor RFP Inquiry</h3>
              </div>
              <button onClick={() => setSelectedVendorForInquiry(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
              Targeting: <strong style={{ color: '#FFF' }}>{selectedVendorForInquiry.name}</strong> ({selectedVendorForInquiry.category})
            </p>

            <textarea
              className="textarea-field"
              rows={12}
              value={inquiryEmailText}
              onChange={e => setInquiryEmailText(e.target.value)}
              style={{ fontFamily: 'monospace', fontSize: '0.825rem', marginBottom: '16px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(inquiryEmailText);
                  setCopiedInquiry(true);
                  showToast("Inquiry email copied to clipboard!");
                  setTimeout(() => setCopiedInquiry(false), 2000);
                }}
                className="btn btn-primary btn-sm"
              >
                {copiedInquiry ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedInquiry ? "Copied!" : "Copy to Clipboard"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Quote Comparison Modal */}
      {selectedVendorForComparison && quoteAnalysisResult && (
        <div className="modal-backdrop" onClick={() => setSelectedVendorForComparison(null)}>
          <div className="modal-content glass-panel" style={{ padding: '32px', maxWidth: '780px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Sparkles size={22} color="var(--accent-gold)" />
                <h3 style={{ fontSize: '1.3rem' }}>Quote Comparison Analysis: {selectedVendorForComparison.category}</h3>
              </div>
              <button onClick={() => setSelectedVendorForComparison(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={22} />
              </button>
            </div>

            {/* AI Recommendation Banner */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6EE7B7', textTransform: 'uppercase' }}>
                AI Recommended Choice: {quoteAnalysisResult.winnerVendorName}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#D1FAE5', marginTop: '4px' }}>
                {quoteAnalysisResult.rational}
              </div>
            </div>

            {/* Matrix Table */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              {quoteAnalysisResult.comparisonMatrix?.map((item, idx) => (
                <div key={idx} style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFF', marginBottom: '8px' }}>
                    {item.vendorName}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>Cost Score:</span>
                    <strong style={{ color: 'var(--accent-gold)' }}>{item.costScore}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>Value Deliverables:</span>
                    <strong style={{ color: 'var(--accent-emerald)' }}>{item.valueScore}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    <span>Risk Level:</span>
                    <strong style={{ color: item.riskFactor?.includes('Low') ? '#6EE7B7' : '#FDA4AF' }}>{item.riskFactor}</strong>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {item.keyDifferentiator}
                  </div>
                </div>
              ))}
            </div>

            {/* Negotiation Levers */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)', marginBottom: '8px' }}>
                Key Questions & Negotiation Levers to Secure Best Terms:
              </div>
              <ul style={{ paddingLeft: '20px', fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {quoteAnalysisResult.negotiationTips?.map((tip, idx) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>{tip}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add Vendor Modal */}
      {showAddVendor && (
        <div className="modal-backdrop" onClick={() => setShowAddVendor(false)}>
          <div className="modal-content glass-panel" style={{ padding: '28px', maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>Add Vendor to Pipeline</h3>
            <form onSubmit={handleAddVendorSubmit}>
              <div className="input-group">
                <label className="input-label" htmlFor="new-vendor-cat">Vendor Category</label>
                <select
                  id="new-vendor-cat"
                  className="select-field"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                >
                  <option value="Venue">Venue</option>
                  <option value="Catering">Catering & Bar</option>
                  <option value="Photography">Photography & Film</option>
                  <option value="Music & DJ">Music & DJ</option>
                  <option value="Decor & Florals">Decor & Florals</option>
                  <option value="Baker">Bakery & Cake</option>
                  <option value="Permitting & Security">Permitting & Security</option>
                  <option value="Transport & Logistics">Transport & Logistics</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="new-vendor-name">Business / Vendor Name</label>
                <input
                  id="new-vendor-name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g., Stellar Audio & Lighting"
                  value={newVendorName}
                  onChange={e => setNewVendorName(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="new-vendor-contact">Contact Email or Phone</label>
                <input
                  id="new-vendor-contact"
                  type="text"
                  className="input-field"
                  placeholder="contact@company.com"
                  value={newContact}
                  onChange={e => setNewContact(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="new-vendor-quote">Estimated / Quoted Price ({currentEvent.currency})</label>
                <input
                  id="new-vendor-quote"
                  type="number"
                  className="input-field"
                  value={newQuotePrice}
                  onChange={e => setNewQuotePrice(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddVendor(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Add Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
