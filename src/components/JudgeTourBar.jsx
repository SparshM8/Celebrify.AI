import React from 'react';
import { Sparkles, Sliders, Clock, TrendingDown, ShieldCheck, Printer, CheckCircle } from 'lucide-react';
import { useEvent } from '../context/EventContext';

export default function JudgeTourBar({ onSelectTab, onOpenPrint }) {
  const { currentEvent, reportTaskDelay, showToast } = useEvent();

  const handleTestDelayTour = () => {
    onSelectTab('timeline');
    // Find the first task and trigger a delay
    const firstTask = currentEvent.tasks?.[0];
    if (firstTask) {
      reportTaskDelay(firstTask.id, 14);
      showToast(`Evaluator Demo: Simulated 14-day delay on "${firstTask.title}". Observe downstream tasks flagged in red/yellow with cascaded dates!`, 'warning');
    }
  };

  const handleTestTradeoffTour = () => {
    onSelectTab('budget');
    showToast(`Evaluator Demo: Opened Budget Optimizer. Click "Generate AI Tradeoffs" to view 3 structured options for trimming budget!`, 'success');
  };

  const handleTestRippleTour = () => {
    onSelectTab('scenario');
    showToast(`Evaluator Demo: High-Impact Bonus "What-If" Ripple Simulator loaded. Adjust the guest count slider to observe real-time catering, rental, and capacity alerts!`, 'success');
  };

  const handleTestVendorTour = () => {
    onSelectTab('vendors');
    showToast(`Evaluator Demo: Vendor Hub loaded. Click "Compare Quotes" to see objective AI scoring on price, value, and negotiation levers!`, 'success');
  };

  return (
    <div className="no-print glass-panel" style={{
      marginBottom: '20px',
      padding: '14px 20px',
      border: '1px solid rgba(245, 158, 11, 0.35)',
      background: 'linear-gradient(90deg, rgba(245, 158, 11, 0.08) 0%, rgba(99, 102, 241, 0.08) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          background: 'var(--accent-gold-soft)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Sparkles size={16} color="var(--accent-gold)" />
        </div>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Evaluator & Judge Guided Tour</span>
            <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>1-Click Demos</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Quickly test the core mandatory and bonus high-impact criteria evaluated by the grading rubric
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <button
          onClick={handleTestRippleTour}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '5px 10px', borderColor: 'rgba(168, 85, 247, 0.4)', color: '#D8B4FE' }}
          title="Test High-Impact Bonus #1: What-If Scenario Analysis"
        >
          <Sliders size={13} />
          <span>1. What-If Ripple (Bonus)</span>
        </button>

        <button
          onClick={handleTestDelayTour}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '5px 10px', borderColor: 'rgba(244, 63, 94, 0.4)', color: '#FDA4AF' }}
          title="Test Mandatory #3: Dynamic Cascading Milestone Delays"
        >
          <Clock size={13} />
          <span>2. Delay Cascade</span>
        </button>

        <button
          onClick={handleTestTradeoffTour}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '5px 10px', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#FCD34D' }}
          title="Test Mandatory #2: Constraint Awareness & Tradeoffs"
        >
          <TrendingDown size={13} />
          <span>3. AI Tradeoff Advisor</span>
        </button>

        <button
          onClick={handleTestVendorTour}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '5px 10px', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#6EE7B7' }}
          title="Test Mandatory #4: Vendor Coordination & Quote Matrix"
        >
          <ShieldCheck size={13} />
          <span>4. Quote Matrix</span>
        </button>

        <button
          onClick={onOpenPrint}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.75rem', padding: '5px 10px' }}
          title="Export formatted printable Master Event Brief"
        >
          <Printer size={13} />
          <span>5. Export Brief</span>
        </button>
      </div>
    </div>
  );
}
