import { describe, it, expect } from 'vitest';
import { calculateCascadingTaskDelays } from '../services/geminiService';

describe('Dynamic Cascading Task Delay Engine', () => {
  const sampleTasks = [
    { id: 'task-1', title: 'Sign Venue Contract', dependencies: [] },
    { id: 'task-2', title: 'Menu Tasting & Catering Finalization', dependencies: ['task-1'] },
    { id: 'task-3', title: 'Send Invitations', dependencies: ['task-2'] },
    { id: 'task-4', title: 'DJ Playlist Review', dependencies: ['task-1'] },
    { id: 'task-5', title: 'Unrelated Milestone (Buy Rings)', dependencies: [] }
  ];

  it('correctly delays the target milestone and marks it as delayed', () => {
    const result = calculateCascadingTaskDelays(sampleTasks, 'task-1', 14);
    const target = result.find(t => t.id === 'task-1');
    expect(target.isDelayed).toBe(true);
    expect(target.delayDays).toBe(14);
  });

  it('cascades delay through the full chain of dependent tasks (task-1 -> task-2 -> task-3)', () => {
    const result = calculateCascadingTaskDelays(sampleTasks, 'task-1', 14);
    
    const task2 = result.find(t => t.id === 'task-2');
    const task3 = result.find(t => t.id === 'task-3');
    const task4 = result.find(t => t.id === 'task-4');

    expect(task2.cascadedDelayDays).toBe(14);
    expect(task2.isCriticalRisk).toBe(true);

    expect(task3.cascadedDelayDays).toBe(14);
    expect(task3.isCriticalRisk).toBe(true);

    expect(task4.cascadedDelayDays).toBe(14);
    expect(task4.isCriticalRisk).toBe(true);
  });

  it('leaves independent tasks completely unaffected by the upstream delay', () => {
    const result = calculateCascadingTaskDelays(sampleTasks, 'task-1', 14);
    const task5 = result.find(t => t.id === 'task-5');
    
    expect(task5.isDelayed).toBeUndefined();
    expect(task5.cascadedDelayDays).toBeUndefined();
    expect(task5.isCriticalRisk).toBeUndefined();
  });

  it('handles non-existent task IDs gracefully without throwing errors', () => {
    const result = calculateCascadingTaskDelays(sampleTasks, 'invalid-id-999', 10);
    expect(result).toHaveLength(sampleTasks.length);
    expect(result.some(t => t.isDelayed)).toBe(false);
  });

  it('handles empty task lists gracefully', () => {
    const result = calculateCascadingTaskDelays([], 'task-1', 10);
    expect(result).toEqual([]);
  });
});
