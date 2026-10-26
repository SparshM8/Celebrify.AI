import React, { useState } from 'react';
import { EventProvider, useEvent } from './context/EventContext';
import Navbar from './components/Navbar';
import WizardModal from './components/WizardModal';
import ApiKeyModal from './components/ApiKeyModal';
import SubmissionKitModal from './components/SubmissionKitModal';
import JudgeTourBar from './components/JudgeTourBar';

import OverviewDashboard from './components/views/OverviewDashboard';
import BudgetView from './components/views/BudgetView';
import TimelineView from './components/views/TimelineView';
import VendorsView from './components/views/VendorsView';
import ScenarioSimulatorView from './components/views/ScenarioSimulatorView';
import CreativeStudioView from './components/views/CreativeStudioView';
import ExportBriefView from './components/views/ExportBriefView';

import { LayoutDashboard, IndianRupee, Clock, ShieldCheck, Sliders, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

function MainApp() {
  const { toast } = useEvent();
  const [activeTab, setActiveTab] = useState('overview'); // overview, budget, timeline, vendors, scenario, creative, export

  // Modals
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isSubmissionKitOpen, setIsSubmissionKitOpen] = useState(false);

  const TABS = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'budget', label: 'Budget & Tradeoffs (₹)', icon: IndianRupee },
    { id: 'timeline', label: 'Cascading Timeline', icon: Clock },
    { id: 'vendors', label: 'Vendor Matrix', icon: ShieldCheck },
    { id: 'scenario', label: 'What-If Simulator', icon: Sliders, isBonus: true },
    { id: 'creative', label: 'Creative Studio', icon: Sparkles }
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sticky Navigation Header */}
      <Navbar
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenApiKey={() => setIsApiKeyOpen(true)}
        onOpenSubmissionKit={() => setIsSubmissionKitOpen(true)}
        onOpenPrint={() => setActiveTab('export')}
      />

      <main style={{ maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '0 24px 60px 24px', flex: 1 }}>
        {/* Navigation Tabs (Hidden when viewing print brief) */}
        {activeTab !== 'export' && (
          <nav aria-label="Main Navigation" className="no-print" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            marginBottom: '20px',
            overflowX: 'auto',
            background: 'rgba(13, 19, 36, 0.75)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid var(--border-glass)',
            borderRadius: 'var(--radius-full)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.45)'
          }}>
            {TABS.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                  style={{
                    position: 'relative',
                    background: isActive ? 'var(--gradient-brand)' : 'transparent',
                    border: isActive ? '1px solid rgba(255, 255, 255, 0.3)' : '1px solid transparent',
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                    boxShadow: isActive ? '0 4px 18px rgba(139, 92, 246, 0.5)' : 'none',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.85rem'
                  }}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  {tab.isBonus && (
                    <span style={{
                      fontSize: '0.62rem',
                      background: 'rgba(245, 158, 11, 0.25)',
                      color: '#FCD34D',
                      border: '1px solid rgba(245, 158, 11, 0.45)',
                      borderRadius: 'var(--radius-full)',
                      padding: '1px 6px',
                      marginLeft: '4px',
                      fontWeight: 700
                    }}>
                      BONUS
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Evaluator & Judge Quick Tour Bar */}
        {activeTab !== 'export' && (
          <JudgeTourBar onSelectTab={setActiveTab} onOpenPrint={() => setActiveTab('export')} />
        )}

        {/* Dynamic Views */}
        {activeTab === 'overview' && (
          <OverviewDashboard 
            onSwitchTab={setActiveTab} 
            onOpenWizard={() => setIsWizardOpen(true)} 
          />
        )}
        {activeTab === 'budget' && <BudgetView />}
        {activeTab === 'timeline' && <TimelineView />}
        {activeTab === 'vendors' && <VendorsView />}
        {activeTab === 'scenario' && <ScenarioSimulatorView />}
        {activeTab === 'creative' && <CreativeStudioView />}
        {activeTab === 'export' && <ExportBriefView onBack={() => setActiveTab('overview')} />}
      </main>

      {/* Footer */}
      <footer className="no-print" style={{
        textAlign: 'center',
        padding: '24px',
        borderTop: '1px solid var(--border-glass)',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        Celebrify AI • [Challenge 5] Celebration & Event Planner • Powered by Google Gemini AI Engine
      </footer>

      {/* Modals */}
      <WizardModal isOpen={isWizardOpen} onClose={() => setIsWizardOpen(false)} />
      <ApiKeyModal isOpen={isApiKeyOpen} onClose={() => setIsApiKeyOpen(false)} />
      <SubmissionKitModal isOpen={isSubmissionKitOpen} onClose={() => setIsSubmissionKitOpen(false)} />

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 2000,
          background: toast.type === 'warning' ? '#78350F' : '#064E3B',
          border: `1px solid ${toast.type === 'warning' ? '#F59E0B' : '#10B981'}`,
          borderRadius: 'var(--radius-md)',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          color: '#FFF',
          boxShadow: 'var(--shadow-lg)',
          fontSize: '0.875rem',
          animation: 'slideUp 0.25s ease'
        }}>
          {toast.type === 'warning' ? <AlertCircle size={18} color="#FCD34D" /> : <CheckCircle2 size={18} color="#6EE7B7" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          background: '#0A0E17',
          color: '#FFF'
        }}>
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            borderRadius: '16px',
            padding: '32px',
            maxWidth: '540px'
          }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '12px', color: '#FDA4AF' }}>
              Something interrupted the view
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#94A3B8', marginBottom: '20px' }}>
              {this.state.error?.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => {
                localStorage.removeItem("CELEBRIFY_EVENTS_STATE");
                window.location.reload();
              }}
              className="btn btn-primary btn-sm"
            >
              Reset Session & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <EventProvider>
        <MainApp />
      </EventProvider>
    </ErrorBoundary>
  );
}
