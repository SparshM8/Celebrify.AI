# 🎊 Celebrify AI — GenAI Celebration & Event Planner
> **[Challenge 5] Celebration & Event Planner** — Final Submission Release  
> *Transforming event planning from a stressful, fragmented process into an intelligent, coordinated experience.*

![Celebrify AI Badge](https://img.shields.io/badge/Challenge-5%20Celebration%20Planner-indigo)
![Tests](https://img.shields.io/badge/Unit%20Tests-9%2F9%20Passing-emerald)
![Repo Size](https://img.shields.io/badge/Repo%20Size-%3C2MB%20(Rule%20Compliant)-blue)
![Security](https://img.shields.io/badge/Security-Zero%20Hardcoded%20Keys-success)

---

## 🌟 1. Project Overview & Chosen Vertical
**Celebrify AI** is an intelligent, high-touch celebration management assistant built for **Challenge 5: Celebration & Event Planner**. It is engineered to solve the real-world operational challenges of event planning: **budget volatility, complex vendor coordination, schedule dependencies, and cascading ripple effects**.

Moving far beyond superficial conversational chatbots, Celebrify AI functions as an **operational coordination engine** that models interdependent planning variables for **Weddings**, **Milestone Birthdays**, and **Community Festivals**.

---

## 🚀 2. Core Problem Statement Alignment

| Criterion | Implementation in Celebrify AI |
| :--- | :--- |
| **Interactive Situational Planning (Mandatory #1)** | **Situational Intake Wizard**: Gathers occasion, headcount, budget, location, non-negotiable priorities, cultural traditions, and accessibility needs to architect a tailored plan. |
| **Constraint Awareness & Tradeoffs (Mandatory #2)** | **AI Tradeoff Advisor**: When budgets are trimmed or line items spike, the advisor evaluates financial constraints and proposes 3 concrete tradeoffs while strictly protecting user must-haves. |
| **Dynamic Task Management (Mandatory #3)** | **Cascading Dependency Timeline**: Sequenced milestones linked by dependency graphs. Reporting a delay on an upstream milestone automatically reschedules downstream tasks and flags critical path risks. |
| **Vendor Coordination (Mandatory #4)** | **Vendor Hub & Quote Matrix**: Tracks vendor lifecycles, drafts customized AI RFP inquiry emails, and provides side-by-side comparative scoring on cost vs. value. |
| **Scenario Analysis (Bonus High-Impact #1)** | **"What-If" Sensitivity & Ripple Simulator**: Interactive sliders for guest count, culinary tiers, and venue settings dynamically recalculate budget variances, table rentals, staffing ratios, and venue capacity risks in real-time. |
| **Deep Personalization (Bonus High-Impact #2)** | **Inclusivity & Cultural Customs Studio**: Distinct handling of cultural rituals (e.g., tea ceremonies, blessings, tribute playlists) and universal accessibility accommodations (wheelchair paths, sensory zones, dietary safety). |

---

## ⚙️ 3. Architecture & Technical Design

### Tech Stack
- **Frontend Framework**: React 18 + Vite (fast reactive state management, sub-second renders)
- **Styling**: Tailored Modern CSS Design System (accessible contrast, glassmorphism, responsive mobile/desktop, print stylesheet)
- **Icons**: Lucide React (vector-based, zero heavy binary assets)
- **Testing**: Vitest with `@testing-library/react` and `jsdom`
- **AI Integration**: Google Gemini API (Gemini 1.5 Flash via REST API with structured JSON output schemas) backed by an offline dynamic reasoning engine.

### Zero-Hardcoding Security Architecture
- **Zero Credentials in Git**: No API keys or secrets exist in the codebase, `.env`, or commit history.
- **Client-Side Key Injection**: Users/evaluators can supply a Gemini API key via the in-app secure modal, stored ephemerally in `sessionStorage`.
- **Zero-Friction Offline Fallback**: If no key is entered, an embedded dynamic reasoning engine processes user inputs in real-time. Evaluators can test the entire workflow with zero setup.

---

## 🧪 4. Testing & Code Quality Validation

Automated unit tests validate the mathematical and logistical integrity of the business logic:
- `src/test/cascade.test.js`: Validates milestone dependency propagation and downstream delay cascading.
- `src/test/ripple.test.js`: Validates sensitivity formulas for guest count scaling, rental counts, and capacity risk thresholds.
- `src/test/budget.test.js`: Validates budget category allocation, percentage splits, and overspend detection.

Run tests locally:
```bash
npm test
```

---

## 💻 5. How to Run Locally

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
1. Clone this public repository:
   ```bash
   git clone <REPO_URL>
   cd Challenge5
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build production bundle:
   ```bash
   npm run build
   ```

---

## 🌐 6. One-Click Deployment Guide (Vercel / Netlify)

### Deploy to Vercel
1. Install Vercel CLI or connect via GitHub:
   ```bash
   npx vercel
   ```
2. Follow prompts (framework preset: `Vite`, output directory: `dist`).

### Deploy to Netlify
1. Connect repository on [netlify.com](https://netlify.com).
2. Set Build Command to `npm run build` and Publish Directory to `dist`.

---

## 📋 7. Deliverables & Evaluation Alignment

- **Repository Size Compliance**: The entire repository is `< 2 MB` (strictly under the 10 MB limit).
- **Single Branch**: All commits are strictly on `main`.
- **In-App Submission Kit**: Click the **"Submission Kit"** button in the app header to instantly copy:
  1. *Describe the changes/updates made in the deployed version* (< 1024 characters).
  2. *Mention the Gen AI services utilized in the submission, and where did you utilize it?* (< 1024 characters).
  3. *LinkedIn Post copy* with architectural breakdown and tags.
  4. *3-Minute Video Walkthrough Script*.
- **Printable Master Dossier**: Click **"Export Brief"** to preview or print a clean executive summary via browser PDF export.

---

## ⚖️ 8. Assumptions Made
1. **Currency & Localization**: Defaults to USD ($) but supports INR (₹), EUR (€), and GBP (£) with dynamic cost factors.
2. **Standard Event Ratios**: 1 table per 8-10 attendees; 1 service staff per 15 guests; standard 10-15% contingency reserve.
3. **Data Storage**: Client-side `localStorage` ensures all custom plans, logged expenses, and vendor quotes persist across reloads without requiring server setup.
