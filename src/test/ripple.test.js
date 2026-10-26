import { describe, it, expect } from 'vitest';
import { simulateScenarioRipple } from '../services/geminiService';

describe('What-If Scenario Ripple Simulator', () => {
  const baseEvent = {
    budget: 20000,
    guestCount: 100
  };

  it('correctly calculates budget expansion when guest count increases', () => {
    const result = simulateScenarioRipple({
      baseEvent,
      deltaGuests: 30, // 100 -> 130
      venueTypeShift: 'Standard Ballroom',
      tierMultiplier: 1.0
    });

    expect(result.newGuests).toBe(130);
    expect(result.projectedTotalBudget).toBeGreaterThan(baseEvent.budget);
    expect(result.totalBudgetDelta).toBeGreaterThan(0);
    expect(result.tablesNeeded).toBe(Math.ceil(130 / 8));
  });

  it('correctly calculates budget reduction when guest count is reduced', () => {
    const result = simulateScenarioRipple({
      baseEvent,
      deltaGuests: -30, // 100 -> 70
      venueTypeShift: 'Standard Ballroom',
      tierMultiplier: 1.0
    });

    expect(result.newGuests).toBe(70);
    expect(result.projectedTotalBudget).toBeLessThan(baseEvent.budget);
    expect(result.totalBudgetDelta).toBeLessThan(0);
  });

  it('flags capacity risk when guest count exceeds intimate venue limits', () => {
    const result = simulateScenarioRipple({
      baseEvent,
      deltaGuests: 20, // 100 -> 120
      venueTypeShift: 'Intimate Boutique',
      tierMultiplier: 1.0
    });

    expect(result.venueCapacityRisk).toBe('High Risk');
    expect(result.venueWarning).toContain('Capacity warning');
  });

  it('elevates timeline urgency when significant guest expansion occurs', () => {
    const result = simulateScenarioRipple({
      baseEvent,
      deltaGuests: 60,
      venueTypeShift: 'Standard Ballroom',
      tierMultiplier: 1.0
    });

    expect(result.timelineUrgency).toBe('High Urgency');
    expect(result.timelineAdvice).toContain('catering headcount');
  });

  it('enforces a safe minimum guest floor of 10 attendees even with extreme negative deltas', () => {
    const result = simulateScenarioRipple({
      baseEvent,
      deltaGuests: -150, // 100 -> negative
      venueTypeShift: 'Standard Ballroom',
      tierMultiplier: 1.0
    });

    expect(result.newGuests).toBe(10);
    expect(result.tablesNeeded).toBe(2);
  });

  it('applies luxury tier multiplier (1.5x) to catering calculations', () => {
    const standardResult = simulateScenarioRipple({
      baseEvent,
      deltaGuests: 0,
      venueTypeShift: 'Standard Ballroom',
      tierMultiplier: 1.0
    });

    const luxuryResult = simulateScenarioRipple({
      baseEvent,
      deltaGuests: 0,
      venueTypeShift: 'Standard Ballroom',
      tierMultiplier: 1.5
    });

    expect(luxuryResult.breakdownChanges.catering.projected).toBeGreaterThan(
      standardResult.breakdownChanges.catering.projected
    );
  });

  it('calculates proper staffing ratios (1 server per 15 guests)', () => {
    const result = simulateScenarioRipple({
      baseEvent,
      deltaGuests: 50, // 150 guests
      venueTypeShift: 'Standard Ballroom',
      tierMultiplier: 1.0
    });

    expect(result.staffingRatioNeeded).toBe(10); // 150 / 15 = 10
  });
});
