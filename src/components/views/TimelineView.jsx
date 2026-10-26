import React, { useState } from 'react';
import { useEvent } from '../../context/EventContext';
import { Clock, AlertTriangle, CheckCircle2, Circle, ArrowRight, Plus, RefreshCw, Calendar } from 'lucide-react';

export default function TimelineView() {
  const { currentEvent, toggleTaskStatus, reportTaskDelay, addTask } = useEvent();
  const tasks = currentEvent.tasks || [];

  const [selectedTaskForDelay, setSelectedTaskForDelay] = useState(null);
  const [delayDaysInput, setDelayDaysInput] = useState(14);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newPhase, setNewPhase] = useState("3 Months Out");
  const [newDueDate, setNewDueDate] = useState("2026-08-15");
  const [selectedDep, setSelectedDep] = useState("");

  const hasAnyDelays = tasks.some(t => t.isDelayed || t.cascadedDelayDays > 0);

  const handleConfirmDelay = () => {
    if (selectedTaskForDelay) {
      reportTaskDelay(selectedTaskForDelay.id, Number(delayDaysInput));
      setSelectedTaskForDelay(null);
    }
  };

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask({
      id: `task-${Date.now()}`,
      title: newTitle.trim(),
      phase: newPhase,
      dueDate: newDueDate,
      status: "todo",
      dependencies: selectedDep ? [selectedDep] : [],
      isDelayed: false,
      delayDays: 0
    });
    setNewTitle("");
    setShowAddModal(false);
  };

  // Group tasks by phase
  const phases = [...new Set(tasks.map(t => t.phase))];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-gold)', fontSize: '0.825rem', fontWeight: 600 }}>
              <Clock size={16} />
              <span>Mandatory Criterion #3: Sequence-Based Dynamic Scheduling</span>
            </div>
            <h2 style={{ fontSize: '1.6rem', marginTop: '4px' }}>
              Cascading Dependency Timeline & Run of Show
            </h2>
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-secondary btn-sm"
          >
            <Plus size={16} />
            <span>Add Task</span>
          </button>
        </div>

        {/* Dynamic Cascading Alert Banner */}
        {hasAnyDelays && (
          <div style={{
            marginTop: '20px',
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <AlertTriangle size={24} color="#F43F5E" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: '0.875rem', color: '#FDA4AF' }}>
              <strong>AI Schedule Alert:</strong> Milestone delays have been reported. The dependency engine has dynamically pushed downstream deadlines to protect execution integrity. Review critical path tasks highlighted below.
            </div>
          </div>
        )}
      </div>

      {/* Phased Task List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {phases.map(phaseName => {
          const phaseTasks = tasks.filter(t => t.phase === phaseName);

          return (
            <div key={phaseName} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span className="badge badge-indigo">{phaseName}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  ({phaseTasks.filter(t => t.status === 'done').length}/{phaseTasks.length} Done)
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {phaseTasks.map(task => {
                  const isDone = task.status === 'done';
                  const isInProgress = task.status === 'in-progress';
                  const hasCascadeRisk = task.cascadedDelayDays > 0;
                  const isDirectlyDelayed = task.isDelayed;

                  // Find parent dependency titles
                  const parentNames = (task.dependencies || [])
                    .map(depId => tasks.find(t => t.id === depId)?.title)
                    .filter(Boolean);

                  return (
                    <div
                      key={task.id}
                      style={{
                        background: hasCascadeRisk || isDirectlyDelayed 
                          ? 'rgba(244, 63, 94, 0.08)' 
                          : 'rgba(15, 23, 42, 0.75)',
                        border: `1px solid ${
                          isDirectlyDelayed 
                            ? 'rgba(244, 63, 94, 0.5)' 
                            : hasCascadeRisk 
                            ? 'rgba(245, 158, 11, 0.45)' 
                            : 'var(--border-glass)'
                        }`,
                        borderRadius: 'var(--radius-md)',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '14px',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {/* Left: Checkbox & Info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '280px' }}>
                        <button
                          onClick={() => toggleTaskStatus(task.id)}
                          aria-label={`Mark task ${task.title} status`}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isDone ? 'var(--accent-emerald)' : isInProgress ? 'var(--accent-gold)' : 'var(--text-muted)'
                          }}
                        >
                          {isDone ? <CheckCircle2 size={24} /> : isInProgress ? <Clock size={24} /> : <Circle size={24} />}
                        </button>

                        <div>
                          <div style={{
                            fontSize: '0.975rem',
                            fontWeight: 600,
                            color: isDone ? 'var(--text-muted)' : '#FFFFFF',
                            textDecoration: isDone ? 'line-through' : 'none'
                          }}>
                            {task.title}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '4px', flexWrap: 'wrap', fontSize: '0.75rem' }}>
                            <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Calendar size={12} />
                              <span>Due: {task.dueDate}</span>
                            </span>

                            {parentNames.length > 0 && (
                              <span style={{ color: '#818CF8' }}>
                                Depends on: {parentNames.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Delay badges & Trigger Action */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {isDirectlyDelayed && (
                          <span className="badge badge-rose" style={{ fontSize: '0.7rem' }}>
                            Delayed +{task.delayDays}d
                          </span>
                        )}

                        {hasCascadeRisk && !isDirectlyDelayed && (
                          <span className="badge badge-gold" style={{ fontSize: '0.7rem' }}>
                            Cascaded +{task.cascadedDelayDays}d (Critical Risk)
                          </span>
                        )}

                        <span className={`badge ${isDone ? 'badge-emerald' : isInProgress ? 'badge-gold' : 'badge-indigo'}`} style={{ fontSize: '0.7rem' }}>
                          {task.status}
                        </span>

                        {!isDone && (
                          <button
                            onClick={() => setSelectedTaskForDelay(task)}
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.75rem', padding: '4px 10px' }}
                            title="Simulate delay and recalculate downstream schedule"
                          >
                            <RefreshCw size={12} />
                            <span>Report Delay</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Delay Modal */}
      {selectedTaskForDelay && (
        <div className="modal-backdrop" onClick={() => setSelectedTaskForDelay(null)}>
          <div className="modal-content glass-panel" style={{ padding: '28px', maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <AlertTriangle size={22} color="var(--accent-rose)" />
              <h3 style={{ fontSize: '1.2rem' }}>Report Milestone Delay</h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Target Milestone: <strong style={{ color: '#FFF' }}>{selectedTaskForDelay.title}</strong>
            </p>

            <div className="input-group">
              <label className="input-label" htmlFor="delay-days-input">Delay Duration (Days)</label>
              <input
                id="delay-days-input"
                type="number"
                min="1"
                max="90"
                className="input-field"
                value={delayDaysInput}
                onChange={e => setDelayDaysInput(e.target.value)}
              />
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              The dynamic engine will trace all downstream tasks with direct or indirect dependency on this milestone and automatically recalculate schedule urgency.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button onClick={() => setSelectedTaskForDelay(null)} className="btn btn-secondary btn-sm">
                Cancel
              </button>
              <button onClick={handleConfirmDelay} className="btn btn-danger btn-sm">
                Cascade Delay ({delayDaysInput} Days)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="modal-content glass-panel" style={{ padding: '28px', maxWidth: '480px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>Add Milestone Task</h3>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label className="input-label" htmlFor="new-task-title">Task Description</label>
                <input
                  id="new-task-title"
                  type="text"
                  required
                  className="input-field"
                  placeholder="e.g., Finalize floral centerpieces"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="new-task-phase">Timeline Phase</label>
                <select
                  id="new-task-phase"
                  className="select-field"
                  value={newPhase}
                  onChange={e => setNewPhase(e.target.value)}
                >
                  <option value="6 Months Out">6 Months Out</option>
                  <option value="4 Months Out">4 Months Out</option>
                  <option value="3 Months Out">3 Months Out</option>
                  <option value="1 Month Out">1 Month Out</option>
                  <option value="Week Of">Week Of</option>
                  <option value="Day-Of Run of Show">Day-Of Run of Show</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="new-task-date">Target Due Date</label>
                <input
                  id="new-task-date"
                  type="date"
                  className="input-field"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                />
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="new-task-dep">Prerequisite Milestone (Dependency)</label>
                <select
                  id="new-task-dep"
                  className="select-field"
                  value={selectedDep}
                  onChange={e => setSelectedDep(e.target.value)}
                >
                  <option value="">None (Independent Milestone)</option>
                  {tasks.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
