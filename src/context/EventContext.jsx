import React, { createContext, useContext, useState, useEffect } from 'react';
import { calculateCascadingTaskDelays, generateTailoredEventPlan } from '../services/geminiService';

export const INITIAL_PRESETS = [
  {
    id: "preset-wedding",
    title: "Aria & Julian's Botanical Garden Wedding",
    occasion: "Wedding",
    date: "2026-11-14",
    location: "Glasshouse Conservatory, Botanical Gardens",
    currency: "$",
    budget: 28000,
    guestCount: 120,
    venueType: "Glasshouse Conservatory & Lawn",
    priorities: ["Gourmet Dining & Fine Wine", "Cinematic Photography & Film", "Romantic Ambience"],
    culturalNuances: "Bilingual vows (English/Spanish), acoustic Spanish guitar ceremony, olive branch blessing ritual.",
    accessibilityNeeds: "Step-free paved walkways for elderly grandparents, quiet sensory room, full gluten-free & nut-free catering tags.",
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
      { id: "cat-1", name: "Venue & Conservatory Hire", allocated: 9000, spent: 8500, notes: "Includes sound curfew waiver until 11 PM" },
      { id: "cat-2", name: "Gourmet Catering & Wine", allocated: 8800, spent: 9100, notes: "Plated 3-course meal ($75/head) + bar package" },
      { id: "cat-3", name: "Photo & Film Documentary", allocated: 4200, spent: 4000, notes: "10 hours dual camera coverage + highlight film" },
      { id: "cat-4", name: "Floral Installations & Decor", allocated: 3200, spent: 2900, notes: "Suspended botanical cloud over head table" },
      { id: "cat-5", name: "Live String Quartet & DJ", allocated: 1600, spent: 1600, notes: "Ceremony acoustic strings + 5hr evening DJ" },
      { id: "cat-6", name: "Stationery & Favors", allocated: 600, spent: 450, notes: "Seed paper invitations & mini olive oil bottles" },
      { id: "cat-7", name: "Contingency & Overtime Buffer", allocated: 600, spent: 0, notes: "Reserved for unexpected vendor load-in overtime" }
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
          { name: "Full Glasshouse & Lawn Package", price: 8500, rating: 4.9, highlights: "12-hr exclusive hire, dressing suite, tables & chairs included" }
        ]
      },
      {
        id: "v-2",
        category: "Catering",
        name: "Heritage Farm Table Catering",
        status: "booked",
        contact: "chef@heritagefarmtable.com",
        quotes: [
          { name: "Plated 3-Course Organic Farm Menu", price: 9100, rating: 4.9, highlights: "Locally sourced, organic wine pairing, customized dietary tags" },
          { name: "Family Style Harvest Feast", price: 7800, rating: 4.7, highlights: "Platters passed at tables, reduced service staff" }
        ]
      },
      {
        id: "v-3",
        category: "Photography",
        name: "Lumina Cine Arts",
        status: "shortlisted",
        contact: "hello@luminacine.com",
        quotes: [
          { name: "Cinematic Gold Package", price: 4000, rating: 4.9, highlights: "Dual shooters, drone aerials, raw archive + 6-min film" },
          { name: "Essential Still Photography", price: 3000, rating: 4.6, highlights: "Single shooter, 8 hours, 500 edited stills" }
        ]
      },
      {
        id: "v-4",
        category: "Music & Sound",
        name: "Aura Sound Collective",
        status: "quote_received",
        contact: "bookings@aurasound.com",
        quotes: [
          { name: "Ceremony Strings + Reception DJ", price: 1600, rating: 4.8, highlights: "Acoustic cello & guitar duo + full wireless mic setup" }
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
    currency: "$",
    budget: 5000,
    guestCount: 55,
    venueType: "Industrial Loft / Lounge",
    priorities: ["Live DJ & Turntable Beats", "Custom Neon Photo Booth", "Interactive Cocktail Crafting"],
    culturalNuances: "90s Golden Era Hip-Hop and Synthwave tribute, commemorative Polaroid guestbook wall.",
    accessibilityNeeds: "Designated quiet conversation chillout zone, vibrant mocktail options for non-drinkers.",
    themeTitle: "Cyber Synth & 90s Neon Glow",
    conceptSummary: "An electric 30th celebration pulsing with vintage synths, glowing neon installations, artisanal smash sliders, and signature custom mixology.",
    colorPalette: [
      { name: "Laser Violet", hex: "#8B5CF6", usage: "Neon sign backlight, ambient LED" },
      { name: "Electric Magenta", hex: "#EC4899", usage: "Drink stirrers, photo booth props" },
      { name: "Cyber Cyan", hex: "#06B6D4", usage: "Welcome glow wristbands, stage wash" },
      { name: "Onyx Black", hex: "#111827", usage: "Industrial walls, tableware" },
      { name: "Chrome Silver", hex: "#E2E8F0", usage: "Retro disco elements" }
    ],
    budgetCategories: [
      { id: "cat-b1", name: "Loft Venue & Bar Staffing", allocated: 1600, spent: 1500, notes: "Includes audio gear and lighting rig" },
      { id: "cat-b2", name: "Artisanal Sliders & Bar Package", allocated: 1700, spent: 1650, notes: "Taco & slider bar + 2 signature cocktails" },
      { id: "cat-b3", name: "DJ & Sound Engineer", allocated: 800, spent: 750, notes: "4 hours live vinyl mixing" },
      { id: "cat-b4", name: "Custom Neon Sign & Decor", allocated: 500, spent: 520, notes: "'Marcus 30' LED neon keepsake sign" },
      { id: "cat-b5", name: "Polaroid Station & Favors", allocated: 250, spent: 230, notes: "Cameras, 150 film exposures, metallic pens" },
      { id: "cat-b6", name: "Contingency Fund", allocated: 150, spent: 0, notes: "Extra ice and last-minute beverage replenishment" }
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
        quotes: [{ name: "Evening Party Rental", price: 1500, rating: 4.8, highlights: "Built-in PA, bar counter, 2 security guards" }]
      },
      {
        id: "vb-2",
        category: "DJ",
        name: "DJ Pulsewave",
        status: "booked",
        contact: "pulsewave@beats.io",
        quotes: [{ name: "4-Hour Vinyl & Digital Set", price: 750, rating: 4.9, highlights: "Includes wireless mic, 2 subwoofers" }]
      }
    ]
  },
  {
    id: "preset-community",
    title: "Greenwood Community Harvest & Music Fair",
    occasion: "Community Event",
    date: "2026-10-10",
    location: "Greenwood Town Common & Amphitheater",
    currency: "$",
    budget: 15000,
    guestCount: 450,
    venueType: "Public Park & Amphitheater",
    priorities: ["City Permitting & Crowd Safety", "Diverse Food Truck Vendors", "All-Ages Community Stage"],
    culturalNuances: "Indigenous land acknowledgment, multicultural folk dance performances, bilingual town announcements.",
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
      { id: "cat-c1", name: "City Permits, EMS & Security", allocated: 3800, spent: 3600, notes: "Special event permit, 2 off-duty police officers, EMT crew" },
      { id: "cat-c2", name: "Amphitheater Sound & Stage Rig", allocated: 3500, spent: 3500, notes: "Stage lighting, sound engineering for 6 local musical acts" },
      { id: "cat-c3", name: "Porta-Johns, Handwash & Waste Stations", allocated: 2600, spent: 2500, notes: "Includes 2 ADA compliant units and compost collection" },
      { id: "cat-c4", name: "Volunteer T-Shirts & Signage", allocated: 1800, spent: 1600, notes: "High-visibility vests, directional lawn signs, banners" },
      { id: "cat-c5", name: "Children's Craft & Activity Tent", allocated: 1800, spent: 1750, notes: "Pumpkin painting, face painting, acoustic storytellers" },
      { id: "cat-c6", name: "Safety & Weather Contingency", allocated: 1500, spent: 400, notes: "Used $400 for emergency canopy weights during wind" }
    ],
    tasks: [
      { id: "task-c1", title: "Submit City Parks Department Permit Application", phase: "5 Months Out", dueDate: "2026-05-10", status: "done", dependencies: [], isDelayed: false, delayDays: 0 },
      { id: "task-c2", title: "Coordinate Police & EMT Safety Meeting", phase: "3 Months Out", dueDate: "2026-07-15", status: "done", dependencies: ["task-c1"], isDelayed: false, delayDays: 0 },
      { id: "task-c3", title: "Curate 12 Local Food Trucks & Health Licenses", phase: "2 Months Out", dueDate: "2026-08-15", status: "done", dependencies: ["task-c2"], isDelayed: false, delayDays: 0 },
      { id: "task-c4", title: "Confirm ASL Interpreter & Stage Accessibility", phase: "1 Month Out", dueDate: "2026-09-10", status: "in-progress", dependencies: ["task-c2"], isDelayed: false, delayDays: 0 },
      { id: "task-c5", title: "Stage Build, Power Generator Inspection & Load-In", phase: "Day Of (6:00 AM)", dueDate: "2026-10-10", status: "todo", dependencies: ["task-c4"], isDelayed: false, delayDays: 0 }
    ],
    vendors: [
      {
        id: "vc-1",
        category: "Sound & Stage",
        name: "Valley Pro Audio & Stage",
        status: "booked",
        contact: "staging@valleyproaudio.com",
        quotes: [{ name: "Community Festival Stage & PA", price: 3500, rating: 4.9, highlights: "Generator included, sound engineer on duty for full 8 hrs" }]
      },
      {
        id: "vc-2",
        category: "Sanitation & Facilities",
        name: "CleanSite Solutions",
        status: "booked",
        contact: "rentals@cleansite.com",
        quotes: [{ name: "Festival Sanitation Bundle", price: 2500, rating: 4.7, highlights: "8 standard units, 2 ADA accessible, 4 dual handwash sinks" }]
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
    const saved = localStorage.getItem("CELEBRIFY_EVENTS_STATE");
    if (saved) {
      try {
        return JSON.parse(saved);
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
    localStorage.setItem("CELEBRIFY_EVENTS_STATE", JSON.stringify(events));
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
