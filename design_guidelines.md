# Design Guidelines: Knowledge Base Management System

## Design Approach
**System-Based Approach**: Drawing inspiration from modern productivity tools like Notion, Linear, and Confluence. This knowledge management system prioritizes clarity, efficiency, and professional usability for business users.

**Core Principles:**
- Clean, uncluttered interfaces that reduce cognitive load
- Consistent patterns that accelerate learning
- Clear information hierarchy for quick scanning
- Professional aesthetic appropriate for enterprise environments

---

## Typography System

**Font Selection:**
- Primary: Inter (Google Fonts) - exceptional readability for UI elements
- Monospace: JetBrains Mono - for code snippets or technical content if needed

**Hierarchy:**
- Page Titles: text-2xl font-semibold (32px)
- Section Headers: text-lg font-semibold (18px)
- Body Text: text-base font-normal (16px)
- Secondary/Meta Text: text-sm (14px)
- Input Labels: text-sm font-medium

**Line Height:**
- Headers: leading-tight (1.25)
- Body: leading-relaxed (1.625)
- Form elements: leading-normal (1.5)

---

## Layout System

**Spacing Primitives:**
Consistent use of Tailwind units: **2, 4, 6, 8, 12, 16** for margins, padding, and gaps.
- Micro spacing (between related elements): 2-4 units
- Component internal spacing: 4-6 units
- Section spacing: 8-12 units
- Major layout spacing: 16 units

**Grid & Container Strategy:**
- Sidebar: Fixed width 64 (256px) on desktop, full-width drawer on mobile
- Main content: flex-1 with max-w-6xl centered container, px-6 to px-8
- Form containers: max-w-md (448px) centered for login/authentication screens
- Card/Panel spacing: gap-4 to gap-6 for internal elements

---

## Component Library

### Authentication Components

**Login Form:**
- Centered card layout (max-w-md) with generous padding (p-8)
- Logo/branding at top with mb-8
- Input fields with full width, rounded-lg borders, p-3 spacing
- Labels positioned above inputs with mb-2
- "Remember me" checkbox with label in flex layout, items-center, gap-2
- Primary action button full width with p-3, rounded-lg, font-medium
- Clear focus states on all interactive elements (ring-2 offset-2)

### Sidebar Navigation

**Structure:**
- Full-height sidebar with flex flex-col
- Logo/branding area at top (p-6)
- Navigation menu items with flex-1, space-y-1 between items
- Each menu item: flex items-center gap-3, px-4 py-3, rounded-lg, transition
- Icons left-aligned (w-5 h-5) from Heroicons
- Logout button pinned to bottom with pt-4 border-t

**Mobile Behavior:**
- Hamburger menu trigger (fixed top-left)
- Slide-in drawer overlay with backdrop
- Close button in drawer header

### Main Content Layout

**Page Container:**
- Header bar: flex justify-between items-center with pb-6 mb-8 border-b
- Page title on left, actions/buttons on right
- Content area with consistent vertical rhythm using space-y-6

### Loading States

**Spinner Component:**
- Centered circular spinner using border-4 with partial transparent border
- Animate-spin utility class
- Available in three sizes: sm (w-4 h-4), md (w-8 h-8), lg (w-12 h-12)
- Use within flex items-center justify-center containers

### Form Elements

**Inputs:**
- Consistent height p-3, rounded-lg borders
- Placeholder text with reduced opacity
- Focus states with ring offset pattern
- Error states with border modification and helper text below (text-sm, mt-1)
- Disabled states with reduced opacity and cursor-not-allowed

**Buttons:**
- Primary: font-medium, px-4 py-2, rounded-lg
- Secondary: similar padding with alternative visual treatment
- Icon buttons: p-2, rounded-lg for square hit targets
- Hover states with subtle scale or opacity transitions

---

## Responsive Behavior

**Breakpoints Strategy:**
- Mobile-first approach (base styles for mobile)
- md: (768px) - Tablet, sidebar becomes visible
- lg: (1024px) - Desktop, full sidebar + content layout

**Mobile Adaptations:**
- Sidebar collapses to hamburger menu
- Full-width cards and forms (remove max-w constraints on mobile)
- Reduce padding on smaller screens (p-4 instead of p-8)
- Stack flex layouts to flex-col on mobile

---

## Navigation & Interaction Patterns

**Active States:**
- Current page highlighted in sidebar with visual distinction (background treatment)
- Breadcrumbs for deeper navigation (future consideration)

**Transitions:**
- Minimal, purposeful animations
- Page transitions: Simple fade or none
- Sidebar toggle: slide transition (300ms)
- Hover states: 150ms transitions on background/border changes

**Focus Management:**
- Visible focus indicators on all interactive elements
- Keyboard navigation support (tab order)
- Focus trap in modals/drawers

---

## Content Patterns

**Empty States:**
- Centered layout with icon (w-16 h-16), heading, description text
- Optional action button below description
- Use illustrations sparingly, prefer clean iconography

**Card Components:**
- Consistent padding (p-6), rounded-lg, border
- Header with title and optional actions
- Content area with proper spacing
- Footer for meta information or actions

**Search Interface:**
- Prominent search input with icon (w-5 h-5) positioned left inside input
- Results displayed as list with clear item separation (space-y-4)
- Each result shows title, preview text, metadata

---

## Accessibility Standards

- Semantic HTML throughout (nav, main, article, section)
- ARIA labels for icon-only buttons
- Sufficient contrast ratios (4.5:1 minimum for body text)
- Focus visible on all interactive elements
- Form inputs properly associated with labels (htmlFor/id pairing)
- Screen reader announcements for dynamic content changes