import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { generateCreativeContent } from '../../services/geminiService';
import { Sparkles, MessageSquare, Mic, Copy, Check, Music, Smile, Send } from 'lucide-react';

export default function CreativeStudioView() {
  const { currentEvent, showToast } = useEvent();

  const [activeTab, setActiveTab] = useState("invitation"); // "invitation" | "speech" | "activities"
  const [tone, setTone] = useState("Warm, joyful, and elegant");
  const [customPrompt, setCustomPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  const handleGenerate = async (contentType) => {
    setIsGenerating(true);
    try {
      const res = await generateCreativeContent({
        contentType,
        eventData: currentEvent,
        tone,
        customPrompt
      });
      setGeneratedOutput(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast("Copied to clipboard!");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.825rem', fontWeight: 600 }}>
          <Sparkles size={16} />
          <span>GenAI Personalization Suite</span>
        </div>
        <h2 style={{ fontSize: '1.6rem', marginTop: '4px' }}>
          Creative Studio & Invitation Copywriter
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '780px', marginTop: '6px' }}>
          Generate customized invitations, emotional toasts, and engaging activities tailored to your occasion, cultural traditions, and tone.
        </p>

        {/* Tab Pills */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          {[
            { id: "invitation", label: "Invitations & RSVPs", icon: MessageSquare },
            { id: "speech", label: "Toasts & Speeches", icon: Mic },
            { id: "activities", label: "Games & Icebreakers", icon: Smile }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setGeneratedOutput(null);
                }}
                className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        
        {/* Controls Column */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
            {activeTab === "invitation" && "Invitation Parameters"}
            {activeTab === "speech" && "Speech & Toast Parameters"}
            {activeTab === "activities" && "Activity & Entertainment Parameters"}
          </h3>

          <div className="input-group">
            <label className="input-label" htmlFor="tone-select">Desired Tone & Voice</label>
            <select
              id="tone-select"
              className="select-field"
              value={tone}
              onChange={e => setTone(e.target.value)}
            >
              <option value="Warm, joyful, and elegant">Warm, joyful, and elegant</option>
              <option value="High-energy, witty, and festive">High-energy, witty, and festive</option>
              <option value="Deeply sentimental and emotional">Deeply sentimental and emotional</option>
              <option value="Community-focused and inclusive">Community-focused and inclusive</option>
              <option value="Modern minimalist and chic">Modern minimalist and chic</option>
            </select>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="custom-prompt-input">
              Special Names, Inside Jokes, or Themes to Mention
            </label>
            <textarea
              id="custom-prompt-input"
              className="textarea-field"
              rows={4}
              placeholder={
                activeTab === "invitation"
                  ? "e.g., Mention Italian family tradition, RSVP link, and dress code."
                  : activeTab === "speech"
                  ? "e.g., Mention how we met in college, travel memories, and heartfelt thanks to parents."
                  : "e.g., Age group 25-40, retro trivia, interactive cocktail challenge."
              }
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
            />
          </div>

          <button
            onClick={() => handleGenerate(activeTab)}
            disabled={isGenerating}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '10px' }}
          >
            <Sparkles size={16} />
            <span>{isGenerating ? "Crafting with GenAI..." : `Generate ${activeTab === 'invitation' ? 'Invitations' : activeTab === 'speech' ? 'Speech' : 'Activities'}`}</span>
          </button>
        </div>

        {/* Results Output Column */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>
            Generated Content Preview
          </h3>

          {generatedOutput ? (
            <div style={{ animation: 'fadeIn 0.25s ease' }}>
              <div style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid var(--border-glass)',
                borderRadius: 'var(--radius-md)',
                padding: '18px',
                marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                    {generatedOutput.headline}
                  </span>
                  <button
                    onClick={() => handleCopyText(generatedOutput.primaryText, 'main')}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                  >
                    {copiedKey === 'main' ? <Check size={12} color="#10B981" /> : <Copy size={12} />}
                    <span>{copiedKey === 'main' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#FFF', whiteSpace: 'pre-line', lineHeight: 1.6 }}>
                  {generatedOutput.primaryText}
                </div>
              </div>

              {/* WhatsApp / Short Version */}
              {generatedOutput.alternativeShortSnippet && (
                <div style={{
                  background: 'rgba(99, 102, 241, 0.08)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: 'var(--radius-md)',
                  padding: '14px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A5B4FC', textTransform: 'uppercase' }}>
                      WhatsApp / SMS Ready Snippet
                    </span>
                    <button
                      onClick={() => handleCopyText(generatedOutput.alternativeShortSnippet, 'short')}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '0.7rem', padding: '2px 6px' }}
                    >
                      {copiedKey === 'short' ? <Check size={11} color="#10B981" /> : <Copy size={11} />}
                      <span>{copiedKey === 'short' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: '#E0E7FF' }}>
                    {generatedOutput.alternativeShortSnippet}
                  </div>
                </div>
              )}

              {/* Delivery Tips */}
              {generatedOutput.curatedTips && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <strong>Curator Note:</strong> {generatedOutput.curatedTips.join(" • ")}
                </div>
              )}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              border: '1px dashed var(--border-glass)',
              borderRadius: 'var(--radius-md)'
            }}>
              <Sparkles size={28} color="var(--accent-primary)" style={{ opacity: 0.5, marginBottom: '10px' }} />
              <div>Select parameters on the left and click Generate to produce personalized copy.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
