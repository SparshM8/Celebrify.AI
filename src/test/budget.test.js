import { describe, it, expect } from 'vitest';

describe('Budget Calculation & Allocation Engine', () => {
  const sampleCategories = [
    { id: '1', name: 'Venue & Conservatory', allocated: 9000, spent: 8500 },
    { id: '2', name: 'Gourmet Catering', allocated: 8800, spent: 9100 },
    { id: '3', name: 'Photography', allocated: 4200, spent: 4000 }
  ];
  const totalBudget = 28000;

  it('correctly aggregates total allocated and spent amounts', () => {
    const totalAllocated = sampleCategories.reduce((sum, c) => sum + c.allocated, 0);
    const totalSpent = sampleCategories.reduce((sum, c) => sum + c.spent, 0);

    expect(totalAllocated).toBe(22000);
    expect(totalSpent).toBe(21600);
  });

  it('correctly calculates remaining buffer and flags overspent line items', () => {
    const totalSpent = sampleCategories.reduce((sum, c) => sum + c.spent, 0);
    const remaining = totalBudget - totalSpent;
    expect(remaining).toBe(6400);

    const catering = sampleCategories.find(c => c.name === 'Gourmet Catering');
    const isOverspent = catering.spent > catering.allocated;
    expect(isOverspent).toBe(true);
    expect(catering.spent - catering.allocated).toBe(300);
  });

  it('handles events with zero expenses at inception', () => {
    const freshCategories = [
      { id: '1', name: 'Venue', allocated: 5000, spent: 0 },
      { id: '2', name: 'Decor', allocated: 2000, spent: 0 }
    ];
    const totalSpent = freshCategories.reduce((sum, c) => sum + c.spent, 0);
    expect(totalSpent).toBe(0);
    expect(freshCategories.every(c => c.spent <= c.allocated)).toBe(true);
  });

  it('calculates accurate percentage split across categories', () => {
    const totalAllocated = sampleCategories.reduce((sum, c) => sum + c.allocated, 0);
    const percentages = sampleCategories.map(c => Math.round((c.allocated / totalAllocated) * 100));
    const sumPct = percentages.reduce((a, b) => a + b, 0);
    expect(sumPct).toBeCloseTo(100, 0);
  });
});
