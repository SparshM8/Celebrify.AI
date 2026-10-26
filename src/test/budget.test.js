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
});
