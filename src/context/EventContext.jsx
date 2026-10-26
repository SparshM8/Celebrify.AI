import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateCascadingTaskDelays, generateTailoredEventPlan } from '../services/geminiService';

export const INITIAL_PRESETS = [
  {
    id: "preset-wedding",
    title: "Aria & Julian's Botanical Garden Wedding",
    occasion: "Wedding",
    date: "2026-11-14",
    location: "Royal Glasshouse Conservatory & Lawn",
    currency: "₹",
    budget: 1500000,
    guestCount: 120,
    venueType: "Glasshouse Conservatory & Lawn",
    priorities: ["Gourmet Dining & Fine Wine", "Cinematic Photography & Film", "Romantic Ambience"],
    culturalNuances: "Bilingual vows (English/Hindi), acoustic instrumental ceremony, garland exchange ritual.",
    accessibilityNeeds: "Step-free paved walkways for elderly grandparents, quiet sensory room, full vegetarian and Jain dietary labeling.",
    themeTitle: "Mediterranean Flora & Starlight Glass",
    conceptSummary: "An organic luxury celebration marrying classical conservatory architecture with romantic candlelight, cascading bougainvillea, and artisanal seasonal gastronomy.",
    colorPalette: [
      { name: "Olive Leaf", hex: "#4D7C0F", usage: "Lush botanical garlands, menu borders" },
      { name: "Tuscan Terracotta", hex: "#C2410C", usage: "Handmade ceramic centerpieces, ribbons" },
      { name: "Champagne Velvet", hex: "#FDE68A", usage: "Warm candlelight glow, table runners" },
      { name: "Crisp Linen", hex: "#F8FAFC", usage: "Tables, drapery, invitations" },
      { name: "Midnight Sky", hex: "#0F172A", usage: "Evening lighting, formal tuxedos" }
    ],
    budgetCategories: [
      { id: "cat-1", name: "Venue & Conservatory Hire", allocated: 450000, spent: 425000, notes: "Includes sound curfew waiver until 11 PM" },
      { id: "cat-2", name: "Gourmet Catering & Drinks", allocated: 480000, spent: 500000, notes: "Plated 3-course organic feast (₹3,500/head)" },
      { id: "cat-3", name: "Photo & Film Documentary", allocated: 220000, spent: 210000, notes: "10 hours dual camera coverage + cinematic film" },
      { id: "cat-4", name: "Floral Installations & Decor", allocated: 180000, spent: 165000, notes: "Suspended botanical cloud over stage" },
      { id: "cat-5", name: "Live Acoustic Artists & DJ", allocated: 90000, spent: 90000, notes: "Ceremony acoustic strings + 5hr evening DJ" },
      { id: "cat-6", name: "Stationery & Favors", allocated: 40000, spent: 35000, notes: "Seed paper invitations & mini keepsake hampers" },
      { id: "cat-7", name: "Contingency & Overtime Buffer", allocated: 40000, spent: 0, notes: "Reserved for unexpected vendor overtime" }
    ],
    tasks: [
      { id: "task-w1", title: "Finalize Conservatory & Lawn Contract", phase: "6 Months Out", dueDate: "2026-05-15", status: "done", dependencies: [], isDelayed: false, delayDays: 0 },
      { id: "task-w2", title: "Catering Menu Tasting & Dietary Survey", phase: "4 Months Out", dueDate: "2026-07-20", status: "done", dependencies: ["task-w1"], isDelayed: false, delayDays: 0 },
      { id: "task-w3", title: "Book Cinematographer & Golden Hour Scout", phase: "3 Months Out", dueDate: "2026-08-10", status: "in-progress", dependencies: ["task-w1"], isDelayed: false, delayDays: 0 },
      { id: "task-w4", title: "Order Custom Seed Paper Invitations", phase: "2 Months Out", dueDate: "2026-09-01", status: "todo", dependencies: ["task-w2"], isDelayed: false, delayDays: 0 },
      { id: "task-w5", title: "Final Headcount & Escort Card Printing", phase: "3 Weeks Out", dueDate: "2026-10-24", status: "todo", dependencies: ["task-w4"], isDelayed: false, delayDays: 0 },
      { id: "task-w6", title: "Day-of Run of Show Rehearsal & Soundcheck", phase: "Day Before", dueDate: "2026-11-13", status: "todo", dependencies: ["task-w5"], isDelayed: false, delayDays: 0 }
    ],
    vendors: [
      {
        id: "v-1",
        category: "Venue",
        name: "Glasshouse Botanical Conservatory",
        status: "booked",
        contact: "events@botanicglasshouse.org",
        quotes: [
          { name: "Full Glasshouse & Lawn Package", price: 425000, rating: 4.9, highlights: "12-hr exclusive hire, dressing suite, tables & chairs included" }
        ]
      },
      {
        id: "v-2",
        category: "Catering",
        name: "Heritage Farm Table Catering",
        status: "booked",
        contact: "chef@heritagefarmtable.com",
        quotes: [
          { name: "Plated 3-Course Organic Farm Menu", price: 500000, rating: 4.9, highlights: "Locally sourced, organic juice pairing, customized dietary tags" },
          { name: "Family Style Harvest Feast", price: 420000, rating: 4.7, highlights: "Platters passed at tables, reduced service staff" }
        ]
      },
      {
        id: "v-3",
        category: "Photography",
        name: "Lumina Cine Arts",
        status: "shortlisted",
        contact: "hello@luminacine.com",
        quotes: [
          { name: "Cinematic Gold Package", price: 210000, rating: 4.9, highlights: "Dual shooters, drone aerials, raw archive + 6-min film" },
          { name: "Essential Still Photography", price: 150000, rating: 4.6, highlights: "Single shooter, 8 hours, 500 edited stills" }
        ]
      },
      {
        id: "v-4",
        category: "Music & Sound",
        name: "Aura Sound Collective",
        status: "quote_received",
        contact: "bookings@aurasound.com",
        quotes: [
          { name: "Ceremony Strings + Reception DJ", price: 90000, rating: 4.8, highlights: "Acoustic strings duo + full wireless sound setup" }
        ]
      }
    ]
  },
  {
    id: "preset-birthday",
    title: "Marcus's 30th Retro Neon Birthday Bash",
    occasion: "Milestone Birthday",
    date: "2026-11-28",
    location: "Velvet Underground Warehouse Lounge",
    currency: "₹",
    budget: 150000,
    guestCount: 55,
    venueType: "Industrial Loft / Lounge",
    priorities: ["Live DJ & Turntable Beats", "Custom Neon Photo Booth", "Interactive Cocktail Crafting"],
    culturalNuances: "Retro Synthwave and Bollywood fusion tribute, commemorative Polaroid guestbook wall.",
    accessibilityNeeds: "Designated quiet conversation chillout zone, vibrant mocktail options for non-drinkers.",
    themeTitle: "Cyber Synth & 90s Neon Glow",
    conceptSummary: "An electric 30th celebration pulsing with vintage synths, glowing neon installations, artisanal street tacos, and signature custom mixology.",
    colorPalette: [
      { name: "Laser Violet", hex: "#8B5CF6", usage: "Neon sign backlight, ambient LED" },
      { name: "Electric Magenta", hex: "#EC4899", usage: "Drink stirrers, photo booth props" },
      { name: "Cyber Cyan", hex: "#06B6D4", usage: "Welcome glow wristbands, stage wash" },
      { name: "Onyx Black", hex: "#111827", usage: "Industrial walls, tableware" },
      { name: "Chrome Silver", hex: "#E2E8F0", usage: "Retro disco elements" }
    ],
    budgetCategories: [
      { id: "cat-b1", name: "Loft Venue & Bar Staffing", allocated: 45000, spent: 42000, notes: "Includes audio gear and lighting rig" },
      { id: "cat-b2", name: "Artisanal Food & Beverage Package", allocated: 50000, spent: 52000, notes: "Taco bar + 2 signature mocktails/cocktails" },
      { id: "cat-b3", name: "DJ & Sound Engineer", allocated: 25000, spent: 24000, notes: "4 hours live mixing" },
      { id: "cat-b4", name: "Custom Neon Sign & Decor", allocated: 15000, spent: 14000, notes: "'Marcus 30' LED neon keepsake sign" },
      { id: "cat-b5", name: "Polaroid Station & Favors", allocated: 10000, spent: 9500, notes: "Cameras, 150 film exposures, metallic pens" },
      { id: "cat-b6", name: "Contingency Fund", allocated: 5000, spent: 0, notes: "Extra ice and last-minute replenishment" }
    ],
    tasks: [
      { id: "task-b1", title: "Secure Warehouse Loft Venue", phase: "2 Months Out", dueDate: "2026-09-28", status: "done", dependencies: [], isDelayed: false, delayDays: 0 },
      { id: "task-b2", title: "Design Custom Neon Signage", phase: "6 Weeks Out", dueDate: "2026-10-14", status: "done", dependencies: ["task-b1"], isDelayed: false, delayDays: 0 },
      { id: "task-b3", title: "Finalize DJ Playlist & Cue Tracks", phase: "3 Weeks Out", dueDate: "2026-11-07", status: "in-progress", dependencies: ["task-b1"], isDelayed: false, delayDays: 0 },
      { id: "task-b4", title: "Send Animated Digital Invites via WhatsApp", phase: "2 Weeks Out", dueDate: "2026-11-14", status: "in-progress", dependencies: ["task-b2"], isDelayed: false, delayDays: 0 },
      { id: "task-b5", title: "Pick Up Birthday Cake & Bar Supplies", phase: "Day Of", dueDate: "2026-11-28", status: "todo", dependencies: ["task-b4"], isDelayed: false, delayDays: 0 }
    ],
    vendors: [
      {
        id: "vb-1",
        category: "Venue",
        name: "Sub-Level Industrial Loft",
        status: "booked",
        contact: "marcus@sublevelspace.com",
        quotes: [{ name: "Evening Party Rental", price: 42000, rating: 4.8, highlights: "Built-in PA, bar counter, 2 security guards" }]
      },
      {
        id: "vb-2",
        category: "DJ",
        name: "DJ Pulsewave",
        status: "booked",
        contact: "pulsewave@beats.io",
        quotes: [{ name: "4-Hour Live Set", price: 24000, rating: 4.9, highlights: "Includes wireless mic, 2 subwoofers" }]
      }
    ]
  },
  {
    id: "preset-community",
    title: "Greenwood Community Harvest & Music Fair",
    occasion: "Community Event",
    date: "2026-10-10",
    location: "Greenwood Town Common & Amphitheater",
    currency: "₹",
    budget: 600000,
    guestCount: 450,
    venueType: "Public Park & Amphitheater",
    priorities: ["City Permitting & Crowd Safety", "Diverse Food Truck Vendors", "All-Ages Community Stage"],
    culturalNuances: "Community welcome blessing, multicultural folk performances, bilingual town announcements.",
    accessibilityNeeds: "ADA ramp to amphitheater stage, designated ASL interpreter for opening addresses, stroller & wheelchair parking zone.",
    themeTitle: "Autumn Harvest & Shared Roots",
    conceptSummary: "An inclusive, vibrant community gathering uniting families, local growers, artisans, and youth performers in an eco-friendly outdoor jubilee.",
    colorPalette: [
      { name: "Harvest Gold", hex: "#D97706", usage: "Wayfinding signage, stage banners" },
      { name: "Pine Forest", hex: "#047857", usage: "Waste sorting stations, eco tote bags" },
      { name: "Cider Amber", hex: "#F59E0B", usage: "Festive bunting, craft booths" },
      { name: "Natural Burlap", hex: "#E5E7EB", usage: "Picnic mats, straw bale decor" },
      { name: "Midnight Navy", hex: "#1E293B", usage: "Volunteer staff t-shirts" }
    ],
    budgetCategories: [
      { id: "cat-c1", name: "City Permits, EMS & Security", allocated: 150000, spent: 140000, notes: "Special event permit, security personnel, EMT crew" },
      { id: "cat-c2", name: "Amphitheater Sound & Stage Rig", allocated: 140000, spent: 140000, notes: "Stage lighting, sound engineering for local musical acts" },
      { id: "cat-c3", name: "Sanitation, Handwash & Waste Stations", allocated: 100000, spent: 95000, notes: "Includes accessible units and eco waste collection" },
      { id: "cat-c4", name: "Volunteer T-Shirts & Signage", allocated: 70000, spent: 65000, notes: "High-visibility vests, directional lawn signs, banners" },
      { id: "cat-c5", name: "Children's Craft & Activity Tent", allocated: 80000, spent: 78000, notes: "Art painting, face painting, acoustic storytellers" },
      { id: "cat-c6", name: "Safety & Weather Contingency", allocated: 60000, spent: 15000, notes: "Emergency canopy weights and safety buffers" }
    ],
    tasks: [
      { id: "task-c1", title: "Submit City Parks Department Permit Application", phase: "5 Months Out", dueDate: "2026-05-10", status: "done", dependencies: [], isDelayed: false, delayDays: 0 },
      { id: "task-c2", title: "Coordinate Police & EMT Safety Meeting", phase: "3 Months Out", dueDate: "2026-07-15", status: "done", dependencies: ["task-c1"], isDelayed: false, delayDays: 0 },
      { id: "task-c3", title: "Curate Local Food Vendors & Health Licenses", phase: "2 Months Out", dueDate: "2026-08-15", status: "done", dependencies: ["task-c2"], isDelayed: false, delayDays: 0 },
      { id: "task-c4", title: "Confirm Stage Accessibility & Sound Protocols", phase: "1 Month Out", dueDate: "2026-09-10", status: "in-progress", dependencies: ["task-c2"], isDelayed: false, delayDays: 0 },
      { id: "task-c5", title: "Stage Build, Power Generator Inspection & Load-In", phase: "Day Of (6:00 AM)", dueDate: "2026-10-10", status: "todo", dependencies: ["task-c4"], isDelayed: false, delayDays: 0 }
    ],
    vendors: [
      {
        id: "vc-1",
        category: "Sound & Stage",
        name: "Valley Pro Audio & Stage",
        status: "booked",
        contact: "staging@valleyproaudio.com",
        quotes: [{ name: "Community Festival Stage & PA", price: 140000, rating: 4.9, highlights: "Generator included, sound engineer on duty for full 8 hrs" }]
      },
      {
        id: "vc-2",
        category: "Sanitation & Facilities",
        name: "CleanSite Solutions",
        status: "booked",
        contact: "rentals@cleansite.com",
        quotes: [{ name: "Festival Sanitation Bundle", price: 95000, rating: 4.7, highlights: "8 standard units, 2 accessible units, 4 dual handwash sinks" }]
      }
    ]
  }
];

export const DEFAULT_EVENT_CONTEXT = {
  events: INITIAL_PRESETS,
  currentEvent: INITIAL_PRESETS[0],
  currentEventId: INITIAL_PRESETS[0].id,
  setCurrentEventId: () => {},
  updateCurrentEvent: () => {},
  addEvent: () => {},
  updateBudgetCategory: () => {},
  addBudgetCategory: () => {},
  toggleTaskStatus: () => {},
  reportTaskDelay: () => {},
  addTask: () => {},
  updateVendor: () => {},
  addVendor: () => {},
  toast: null,
  showToast: () => {}
};

const EventContext = createContext(DEFAULT_EVENT_CONTEXT);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("CELEBRIFY_EVENTS_STATE_V2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(ev => ({ ...ev, currency: ev.currency === "$" ? "₹" : ev.currency }));
        }
      } catch (e) {
        console.error("Error parsing saved events:", e);
      }
    }
    return INITIAL_PRESETS;
  });

  const [currentEventId, setCurrentEventId] = useState(() => {
    return events[0]?.id || "preset-wedding";
  });

  const [toast, setToast] = useState(null);

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem("CELEBRIFY_EVENTS_STATE_V2", JSON.stringify(events));
  }, [events]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const currentEvent = events.find(e => e.id === currentEventId) || events[0];

  // Update current event properties
  const updateCurrentEvent = (updates) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === currentEventId) {
        return { ...ev, ...updates };
      }
      return ev;
    }));
  };

  // Add a newly generated event
  const addEvent = (newEvent) => {
    setEvents(prev => [newEvent, ...prev]);
    setCurrentEventId(newEvent.id);
    showToast(`Created new event: "${newEvent.title}"!`);
  };

  // Budget category operations
  const updateBudgetCategory = (categoryId, updates) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === currentEventId) {
        const updatedCats = ev.budgetCategories.map(cat => {
          if (cat.id === categoryId) return { ...cat, ...updates };
          return cat;
        });
        return { ...ev, budgetCategories: updatedCats };
      }
      return ev;
    }));
  };

  const addBudgetCategory = (newCat) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === currentEventId) {
        return { ...ev, budgetCategories: [...ev.budgetCategories, newCat] };
      }
      return ev;
    }));
    showToast("Added new budget category!");
  };

  // Task operations & cascading delay logic
  const toggleTaskStatus = (taskId) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === currentEventId) {
        const updatedTasks = ev.tasks.map(t => {
          if (t.id === taskId) {
            const nextStatus = t.status === "done" ? "todo" : t.status === "todo" ? "in-progress" : "done";
            return { ...t, status: nextStatus };
          }
          return t;
        });
        return { ...ev, tasks: updatedTasks };
      }
      return ev;
    }));
  };

  const reportTaskDelay = (taskId, delayDays) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === currentEventId) {
        const cascaded = calculateCascadingTaskDelays(ev.tasks, taskId, delayDays);
        return { ...ev, tasks: cascaded };
      }
      return ev;
    }));
    showToast(`Milestone delayed by ${delayDays} days. Downstream schedule dynamically cascaded!`, "warning");
  };

  const addTask = (newTask) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === currentEventId) {
        return { ...ev, tasks: [...ev.tasks, newTask] };
      }
      return ev;
    }));
    showToast("Added new milestone task!");
  };

  // Vendor operations
  const updateVendor = (vendorId, updates) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === currentEventId) {
        const updatedVendors = ev.vendors.map(v => {
          if (v.id === vendorId) return { ...v, ...updates };
          return v;
        });
        return { ...ev, vendors: updatedVendors };
      }
      return ev;
    }));
  };

  const addVendor = (newVendor) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === currentEventId) {
        return { ...ev, vendors: [...ev.vendors, newVendor] };
      }
      return ev;
    }));
    showToast("Added vendor to coordination hub!");
  };

  return (
    <EventContext.Provider value={{
      events,
      currentEvent,
      currentEventId,
      setCurrentEventId,
      updateCurrentEvent,
      addEvent,
      updateBudgetCategory,
      addBudgetCategory,
      toggleTaskStatus,
      reportTaskDelay,
      addTask,
      updateVendor,
      addVendor,
      toast,
      showToast
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    return {
      events: INITIAL_PRESETS,
      currentEvent: INITIAL_PRESETS[0],
      currentEventId: INITIAL_PRESETS[0].id,
      setCurrentEventId: () => {},
      updateCurrentEvent: () => {},
      addEvent: () => {},
      updateBudgetCategory: () => {},
      addBudgetCategory: () => {},
      toggleTaskStatus: () => {},
      reportTaskDelay: () => {},
      addTask: () => {},
      updateVendor: () => {},
      addVendor: () => {},
      toast: null,
      showToast: () => {}
    };
  }
  return context;
};
