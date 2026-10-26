import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { generateTradeoffSuggestions } from '../../services/geminiService';
import { IndianRupee, TrendingDown, Sparkles, Check, AlertCircle, Plus, Edit2, ShieldAlert } from 'lucide-react';

export default function BudgetView() {
  const { currentEvent, updateBudgetCategory, addBudgetCategory, showToast } = useEvent();
  
  const totalBudget = currentEvent.budget || 20000;
  const categories = currentEvent.budgetCategories || [];
  const totalAllocated = categories.reduce((sum, c) => sum + (Number(c.allocated) || 0), 0);
  const totalSpent = categories.reduce((sum, c) => sum + (Number(c.spent) || 0), 0);
  const remaining = totalBudget - totalSpent;

  // Tradeoff Advisor State
  const [targetCategory, setTargetCategory] = useState(categories[0]?.name || "Gourmet Catering & Drinks");
  const [cutAmount, setCutAmount] = useState(25000);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [tradeoffResult, setTradeoffResult] = useState(null);

  // New Category Modal / Input State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatAllocated, setNewCatAllocated] = useState(50000);
  const [newCatNotes, setNewCatNotes] = useState("");

  const handleRunTradeoffAnalysis = async () => {
    setIsAnalyzing(true);
    setTradeoffResult(null);
    try {
      const result = await generateTradeoffSuggestions({
        eventData: currentEvent,
        currentBudget: totalBudget,
        targetBudget: totalBudget - cutAmount,
        categoryToAdjust: targetCategory,
        reductionAmount: cutAmount
      });
      setTradeoffResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleApplyTradeoff = (option) => {
    const cat = categories.find(c => c.name === targetCategory);
    if (cat) {
      const newAllocated = Math.max(0, cat.allocated - cutAmount);
      updateBudgetCategory(cat.id, { 
        allocated: newAllocated, 
        notes: `${cat.notes || ''} [AI Tradeoff Applied: ${option.optionTitle}]` 
      });
      showToast(`Applied: ${option.optionTitle}. Saved ${currentEvent.currency}${cutAmount.toLocaleString()}`);
    }
  };

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addBudgetCategory({
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      allocated: Number(newCatAllocated) || 0,
      spent: 0,
      notes: newCatNotes.trim() || "User added line item"
    });
    setNewCatName("");
    setNewCatAllocated(1000);
    setNewCatNotes("");
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Summary Banner */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.825rem', fontWeight: 600 }}>
              <IndianRupee size={16} />
              <span>Mandatory Criterion #2: Dynamic Constraint & Tradeoff Engine</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', marginTop: '4px' }}>
              Budget Optimizer & Spend Allocation
            </h2>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-secondary btn-sm"
          >
            <Plus size={16} />
            <span>Add Custom Category</span>
          </button>
        </div>

        {/* 3 Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Target Total Budget</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFF', marginTop: '4px' }}>
              {currentEvent.currency}{totalBudget.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              ~{currentEvent.currency}{Math.round(totalBudget / (currentEvent.guestCount || 1)).toLocaleString()} / attendee
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Currently Allocated</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: totalAllocated > totalBudget ? 'var(--accent-rose)' : 'var(--accent-gold)', marginTop: '4px' }}>
              {currentEvent.currency}{totalAllocated.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: totalAllocated > totalBudget ? '#FDA4AF' : 'var(--text-secondary)', marginTop: '4px' }}>
              {Math.round((totalAllocated / totalBudget) * 100)}% of target budget
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Actual Committed / Spent</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
              {currentEvent.currency}{totalSpent.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6EE7B7', marginTop: '4px' }}>
              {currentEvent.currency}{remaining.toLocaleString()} remaining buffer
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Category Table vs AI Tradeoff Advisor */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '24px' }}>
        
        {/* Categories & Line Items */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Category Line Items ({categories.length})</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Adjust spend & allocation</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {categories.map(cat => {
              const allocated = Number(cat.allocated) || 0;
              const spent = Number(cat.spent) || 0;
              const pct = totalBudget > 0 ? Math.round((allocated / totalBudget) * 100) : 0;
              const isOverspent = spent > allocated;

              return (
                <div 
                  key={cat.id} 
                  style={{
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: `1px solid ${isOverspent ? 'rgba(244, 63, 94, 0.35)' : 'var(--border-glass)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '16px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#FFF' }}>{cat.name}</span>
                      <span className="badge badge-indigo" style={{ marginLeft: '8px', fontSize: '0.7rem' }}>{pct}%</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: 700, color: isOverspent ? 'var(--accent-rose)' : 'var(--accent-gold)' }}>
                        {currentEvent.currency}{allocated.toLocaleString()}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '6px' }}>allocated</span>
                    </div>
                  </div>

                  {/* Progress vs Spent */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '8px 0' }}>
                    <div style={{ flex: 1, height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${Math.min(100, (spent / (allocated || 1)) * 100)}%`,
                        background: isOverspent ? 'var(--accent-rose)' : 'var(--accent-emerald)',
                        borderRadius: '3px'
                      }} />
                    </div>
                    <div style={{ fontSize: '0.8rem', color: isOverspent ? '#FDA4AF' : 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                      Spent: {currentEvent.currency}{spent.toLocaleString()}
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>{cat.notes}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => {
                          const newSpend = prompt(`Update actual spent for "${cat.name}":`, spent);
                          if (newSpend !== null) {
                            updateBudgetCategory(cat.id, { spent: Number(newSpend) || 0 });
                          }
                        }}
                        style={{ background: 'none', border: 'none', color: '#818CF8', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}
                      >
                        Log Expense
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI CONSTRAINT & TRADEOFF ADVISOR */}
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(245, 158, 11, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TrendingDown size={20} color="var(--accent-gold)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem' }}>AI Constraint & Tradeoff Advisor</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Simulate budget adjustments with AI-guided trade-off strategies</p>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: '16px', marginBottom: '20px' }}>
            <div className="input-group">
              <label className="input-label" htmlFor="tradeoff-category-select">Select Category to Rebalance / Trim</label>
              <select
                id="tradeoff-category-select"
                className="select-field"
                value={targetCategory}
                onChange={e => setTargetCategory(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({currentEvent.currency}{c.allocated.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label className="input-label" htmlFor="cut-amount-slider">Simulate Budget Reduction</label>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                  {currentEvent.currency}{Number(cutAmount).toLocaleString()}
                </span>
              </div>
              <input
                id="cut-amount-slider"
                type="range"
                min="5000"
                max={Math.max(10000, (categories.find(c => c.name === targetCategory)?.allocated || 100000))}
                step="5000"
                value={cutAmount}
                onChange={e => setCutAmount(Number(e.target.value))}
              />
            </div>

            <button
              onClick={handleRunTradeoffAnalysis}
              disabled={isAnalyzing}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '6px' }}
            >
              <Sparkles size={16} />
              <span>{isAnalyzing ? "Analyzing Financial Constraints..." : "Generate AI Tradeoffs"}</span>
            </button>
          </div>

          {/* Tradeoff Results */}
          {tradeoffResult && (
            <div style={{ animation: 'fadeIn 0.3s ease' }}>
              <div style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: '16px',
                padding: '10px 14px',
                background: 'rgba(99, 102, 241, 0.08)',
                border: '1px solid rgba(99, 102, 241, 0.25)',
                borderRadius: 'var(--radius-md)'
              }}>
                {tradeoffResult.analysis}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {tradeoffResult.tradeoffs?.map((opt, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'rgba(15, 23, 42, 0.85)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: 'var(--radius-md)',
                      padding: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#FFF' }}>
                        Option {idx + 1}: {opt.optionTitle}
                      </div>
                      <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                        Saves {opt.estimatedSavings}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                      {opt.action}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.75rem', marginBottom: '12px' }}>
                      <div style={{ color: '#6EE7B7' }}><strong>Pro:</strong> {opt.pro}</div>
                      <div style={{ color: '#FDA4AF' }}><strong>Con:</strong> {opt.con}</div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: opt.priorityImpact === 'Protected' ? '#10B981' : 'var(--text-muted)' }}>
                        Priority Status: <strong>{opt.priorityImpact}</strong>
                      </span>
                      <button
                        onClick={() => handleApplyTradeoff(opt)}
                        className="btn btn-secondary btn-sm"
                        style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#6EE7B7' }}
                      >
                        <Check size={14} />
                        <span>Apply Tradeoff</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Custom Category Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content glass-panel" style={{ padding: '28px', maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>Add Budget Category</h3>
            <form onSubmit={handleCreateCategory}>
              <div className="input-group">
                <label className="input-label" htmlFor="new-cat-name">Category Name</label>
                <input
                  id="new-cat-name"
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g., Transportation & Shuttles"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="new-cat-allocated">Allocated Amount ({currentEvent.currency})</label>
                <input
                  id="new-cat-allocated"
                  type="number"
                  required
                  className="input-field"
                  value={newCatAllocated}
                  onChange={e => setNewCatAllocated(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label className="input-label" htmlFor="new-cat-notes">Notes / Inclusions</label>
                <input
                  id="new-cat-notes"
                  type="text"
                  className="input-field"
                  placeholder="e.g., Shuttle for 60 guests from hotel"
                  value={newCatNotes}
                  onChange={e => setNewCatNotes(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Line Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
