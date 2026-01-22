# Editable Dashboard Design

**Date:** January 22, 2026
**Status:** Design Proposal
**Author:** Research & Design

---

## Executive Summary

This document outlines the design for making the Pool App dashboard customizable. Users will be able to add, remove, and rearrange dashboard widgets to create a personalized view of their business. The design prioritizes simplicity for small business owners who are not power users.

**Goal:** "Simple but flexible" - users should be able to customize their dashboard in under 30 seconds without reading any documentation.

---

## 1. Technical Research

### 1.1 Drag-and-Drop Library Comparison

| Library | Pros | Cons | Verdict |
|---------|------|------|---------|
| **@dnd-kit/core** | Modern, accessible, lightweight (13kb), actively maintained, works with React 18+, excellent TypeScript support | Requires more manual setup for grid layouts | **Recommended for flexibility** |
| **react-grid-layout** | Purpose-built for dashboards, built-in grid snapping, resize support, responsive breakpoints | Larger bundle (30kb+), less modern API, styling can be tricky | **Recommended for dashboards** |
| **react-beautiful-dnd** | Great UX, beautiful animations | **Deprecated** (2023), no longer maintained, issues with React 18+ strict mode | Avoid |
| **@hello-pangea/dnd** | Fork of react-beautiful-dnd, maintained | Still carries technical debt from original | Consider as fallback |

**Recommendation: react-grid-layout**

For dashboard-specific use cases, react-grid-layout is the better choice because:
1. Built-in grid snapping prevents messy layouts
2. Native resize handles - users can make widgets larger/smaller
3. Responsive breakpoints - layout adapts to screen size
4. Collision detection built-in - widgets can't overlap
5. Battle-tested in production dashboards (Grafana, Apache Superset)

### 1.2 Layout System Approaches

| Approach | Description | Complexity | Best For |
|----------|-------------|------------|----------|
| **Fixed Grid** | Widgets snap to predefined columns/rows | Low | Simple dashboards |
| **Responsive Grid** | Grid adapts to screen size with breakpoints | Medium | Desktop + tablet |
| **Free-form Canvas** | Widgets can be placed anywhere | High | Power users, design tools |
| **Column-based** | Widgets stack in columns, like Notion | Low-Medium | Content-heavy dashboards |

**Recommendation: Responsive Grid (12-column)**

A 12-column grid with 3 breakpoints (lg: 12, md: 6, sm: 1) provides:
- Predictable layouts that always look good
- Easy mental model for users ("this takes half the width")
- Prevents broken layouts from user error
- Standard pattern users know from other apps

### 1.3 State Persistence Strategy

| Storage | Pros | Cons | When to Use |
|---------|------|------|-------------|
| **localStorage** | Instant, no backend, works offline | Device-specific, no sync, 5MB limit | MVP, single-device users |
| **Database (user preferences)** | Syncs across devices, backup, analytics | Requires API, latency, migration complexity | Multi-device users, teams |
| **Hybrid** | localStorage for speed, DB for durability | More complex | Production systems |

**Recommendation: Hybrid approach**

```
Phase 1 (MVP): localStorage only
Phase 2: Add database sync with localStorage as cache
```

### 1.4 Performance Considerations

1. **Lazy Loading Widgets:** Only render widgets in viewport initially
2. **Memoization:** Widgets should be memoized to prevent re-renders during drag
3. **Virtualization:** Not needed for typical dashboard (10-15 widgets max)
4. **CSS Grid vs JS:** react-grid-layout uses CSS transforms, which is GPU-accelerated
5. **Animation:** Keep drag animations simple (60fps target)

---

## 2. UX Research

### 2.1 How Leading Products Handle Dashboard Customization

#### Notion
- Click "..." menu to customize
- Drag blocks by handle on left
- No explicit "edit mode" - always editable
- Works because everything is a block

#### Linear
- Settings icon opens customization panel
- Toggle widgets on/off
- Reorder via drag-and-drop in list
- Clean, focused approach

#### Datadog/Grafana
- Explicit "Edit" button in header
- Full edit mode with controls overlay
- Add widget via "+" button
- Grid-based with resize handles
- "Save" to persist changes

#### Stripe Dashboard
- Minimal customization
- Focus on showing the right data automatically
- Less flexibility, more focus

#### HubSpot
- "Edit Dashboard" button
- Sidebar widget catalog
- Drag from catalog onto grid
- Clear save/cancel actions

### 2.2 Key UX Patterns Identified

1. **Explicit Edit Mode** - Toggle between view and edit (Grafana, HubSpot, Datadog)
2. **Widget Catalog** - Browse and add widgets from a sidebar/modal (HubSpot, Grafana)
3. **Drag Handles** - Visual indicator for draggable areas (Notion, Linear)
4. **Confirmation Flow** - Save/Cancel buttons prevent accidental changes (Grafana, HubSpot)
5. **Reset to Default** - Escape hatch for users who mess up (universal)
6. **Resize Handles** - Corner/edge handles for resizing (Grafana, Datadog)

### 2.3 UX Recommendation for Pool App

Given our target users (small business owners, not power users):

**Approach: "Friendly Edit Mode"**

1. **Single "Customize" button** in dashboard header
2. **Slide-in sidebar** with widget catalog (not modal - user sees dashboard while adding)
3. **Clear visual change** when entering edit mode (subtle overlay, visible handles)
4. **Constrained grid** prevents broken layouts
5. **"Save" and "Cancel" buttons** with clear affordance
6. **"Reset to Default"** option for easy recovery
7. **Auto-save draft** to localStorage (recover after accidental close)

---

## 3. Recommended Approach

### 3.1 Technical Stack

```json
{
  "drag-and-drop": "react-grid-layout",
  "state-management": "React useState + localStorage (Phase 1)",
  "animations": "framer-motion (existing)",
  "persistence": "localStorage -> Supabase (Phase 2)"
}
```

### 3.2 Widget Architecture

```typescript
// Widget definition schema
interface WidgetDefinition {
  id: string;                    // Unique identifier
  type: WidgetType;              // Component type
  name: string;                  // Display name
  description: string;           // Help text
  icon: React.ReactNode;         // For widget catalog
  defaultSize: { w: number; h: number };  // Grid units
  minSize?: { w: number; h: number };
  maxSize?: { w: number; h: number };
  isRemovable: boolean;          // Can user remove it?
  isResizable: boolean;          // Can user resize it?
  category: 'core' | 'metrics' | 'quick-actions';
}

// Layout item (what gets persisted)
interface LayoutItem {
  i: string;      // Widget instance ID
  x: number;      // Grid position X
  y: number;      // Grid position Y
  w: number;      // Width in grid units
  h: number;      // Height in grid units
}

// Full dashboard config
interface DashboardConfig {
  version: number;           // For migrations
  layout: LayoutItem[];      // Widget positions
  hiddenWidgets: string[];   // Widgets user removed
}
```

### 3.3 Widget Catalog

#### Core Widgets (Always Available)
| Widget | Default Size | Removable | Description |
|--------|--------------|-----------|-------------|
| Needs Attention | 8x3 | Yes | Actionable alerts and issues |
| Today's Stats | 4x3 | Yes | Revenue, completed, remaining |
| This Week | 8x3 | Yes | Weekly progress chart |
| Business Health | 12x2 | Yes | 30-day metrics strip |
| Quick Links | 4x2 | Yes | Navigation shortcuts |

#### Additional Widgets (Can Be Added)
| Widget | Default Size | Description |
|--------|--------------|-------------|
| Weather | 4x2 | Local weather for outdoor work |
| Tech Locations | 8x4 | Live map of technician positions |
| Recent Invoices | 4x3 | Latest invoice activity |
| Customer Alerts | 4x3 | Chemistry alerts, equipment issues |
| Monthly Revenue | 4x3 | Revenue chart (30 days) |
| Route Efficiency | 4x2 | Miles saved, optimization score |
| Upcoming Services | 4x3 | Next 5 scheduled services |

### 3.4 Default Layout

```typescript
const DEFAULT_LAYOUT: LayoutItem[] = [
  // Row 1: Business Health (full width)
  { i: 'business-health', x: 0, y: 0, w: 12, h: 2 },

  // Row 2: Needs Attention (2/3) + Today (1/3)
  { i: 'needs-attention', x: 0, y: 2, w: 8, h: 4 },
  { i: 'today-stats', x: 8, y: 2, w: 4, h: 4 },

  // Row 3: This Week (2/3) + Quick Links (1/3)
  { i: 'this-week', x: 0, y: 6, w: 8, h: 3 },
  { i: 'quick-links', x: 8, y: 6, w: 4, h: 3 },
];
```

---

## 4. Implementation Plan

### Phase 1: Foundation (Week 1)

1. **Install react-grid-layout**
   ```bash
   npm install react-grid-layout
   ```

2. **Create widget registry**
   - Define all widget types and metadata
   - Create widget component wrapper with consistent styling

3. **Implement basic grid layout**
   - Wrap existing dashboard sections as widgets
   - Add react-grid-layout container
   - Test drag and resize functionality

4. **Add localStorage persistence**
   - Save layout on change
   - Load saved layout on mount
   - Handle migration from no-config to config

### Phase 2: Edit Mode (Week 2)

1. **Create edit mode toggle**
   - "Customize" button in dashboard header
   - Visual differentiation in edit mode
   - Save/Cancel/Reset buttons

2. **Build widget catalog sidebar**
   - List available widgets with previews
   - "Add to Dashboard" button
   - Category organization

3. **Implement widget removal**
   - "X" button on widgets in edit mode
   - Confirmation for important widgets
   - Undo capability (30 second window)

4. **Add resize handles**
   - Corner handles for resizing
   - Min/max size constraints
   - Size indicator while resizing

### Phase 3: Polish (Week 3)

1. **Animations and transitions**
   - Smooth enter/exit for widgets
   - Drag preview improvements
   - Edit mode transition

2. **Empty states and guidance**
   - "Add your first widget" for empty dashboard
   - Tooltips for new users
   - Onboarding hint on first visit

3. **Responsive behavior**
   - Define breakpoint layouts
   - Test on different screen sizes
   - Mobile: simplified single-column (view only)

4. **Error handling**
   - Corrupted localStorage recovery
   - Invalid layout detection and repair
   - Graceful fallback to default

### Phase 4: Database Sync (Future)

1. **API endpoints for dashboard config**
2. **Sync on save with conflict resolution**
3. **Team dashboard templates**
4. **Analytics on widget usage**

---

## 5. UX Flow

### 5.1 Entering Edit Mode

```
User clicks "Customize" button in header
         ↓
Dashboard transitions to edit mode:
  - Header shows "Save" and "Cancel" buttons
  - Widgets show drag handles and resize corners
  - "Remove" (X) buttons appear on removable widgets
  - Widget catalog slides in from right
         ↓
User makes changes (drag, resize, add, remove)
         ↓
User clicks "Save" → Layout persisted, exit edit mode
   OR
User clicks "Cancel" → Changes discarded, exit edit mode
```

### 5.2 Adding a Widget

```
User enters edit mode
         ↓
Widget catalog sidebar visible on right
         ↓
User browses widgets by category or searches
         ↓
User clicks widget → Widget added to bottom of dashboard
   OR
User drags widget → Widget placed at drop location
         ↓
User repositions/resizes as needed
         ↓
User saves layout
```

### 5.3 Removing a Widget

```
User enters edit mode
         ↓
User clicks "X" on widget they want to remove
         ↓
Widget fades out with "Undo" toast (30 seconds)
         ↓
If "Undo" clicked → Widget restored
If timeout or save → Widget removed from layout
```

### 5.4 Resetting to Default

```
User enters edit mode
         ↓
User clicks "Reset to Default" (in catalog footer or menu)
         ↓
Confirmation dialog: "Reset dashboard to default layout? Your customizations will be lost."
         ↓
User confirms → Layout reset, stays in edit mode
User cancels → No change
```

---

## 6. Component Structure

```
components/
├── dashboard/
│   ├── DashboardGrid.tsx          # Main grid container
│   ├── DashboardHeader.tsx        # Header with customize button
│   ├── EditModeProvider.tsx       # Context for edit state
│   ├── WidgetCatalog.tsx          # Sidebar for adding widgets
│   ├── WidgetWrapper.tsx          # HOC for widget chrome
│   └── widgets/
│       ├── index.ts               # Widget registry
│       ├── NeedsAttention.tsx     # Existing widget
│       ├── TodayStats.tsx         # Existing widget
│       ├── ThisWeek.tsx           # Existing widget
│       ├── BusinessHealth.tsx     # Existing widget
│       ├── QuickLinks.tsx         # Existing widget
│       ├── Weather.tsx            # New widget
│       ├── TechLocations.tsx      # New widget
│       └── ...
├── hooks/
│   └── useDashboardLayout.ts      # Layout state + persistence
└── lib/
    └── dashboardConfig.ts         # Types, defaults, migrations
```

---

## 7. Technical Details

### 7.1 React Grid Layout Configuration

```typescript
// DashboardGrid.tsx
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';

const GRID_CONFIG = {
  cols: 12,
  rowHeight: 80,
  margin: [16, 16],
  containerPadding: [0, 0],
  compactType: 'vertical',
  preventCollision: false,
  isDroppable: true,
};

// Responsive breakpoints
const BREAKPOINTS = { lg: 1200, md: 996, sm: 768 };
const COLS = { lg: 12, md: 6, sm: 1 };
```

### 7.2 Layout Persistence Hook

```typescript
// useDashboardLayout.ts
const STORAGE_KEY = 'poolapp-dashboard-layout';
const CURRENT_VERSION = 1;

interface DashboardConfig {
  version: number;
  layout: LayoutItem[];
  hiddenWidgets: string[];
}

export function useDashboardLayout() {
  const [config, setConfig] = useState<DashboardConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return migrateConfig(parsed);
    }
    return getDefaultConfig();
  });

  const saveLayout = useCallback((layout: LayoutItem[]) => {
    const newConfig = { ...config, layout };
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
  }, [config]);

  const resetToDefault = useCallback(() => {
    const defaultConfig = getDefaultConfig();
    setConfig(defaultConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultConfig));
  }, []);

  return { config, saveLayout, resetToDefault };
}
```

### 7.3 Widget Registry Pattern

```typescript
// widgets/index.ts
import { NeedsAttention } from './NeedsAttention';
import { TodayStats } from './TodayStats';
// ... other imports

export const WIDGET_REGISTRY: Record<string, WidgetDefinition> = {
  'needs-attention': {
    id: 'needs-attention',
    type: 'needs-attention',
    name: 'Needs Attention',
    description: 'Actionable alerts requiring your attention',
    icon: <AlertIcon />,
    component: NeedsAttention,
    defaultSize: { w: 8, h: 4 },
    minSize: { w: 4, h: 3 },
    maxSize: { w: 12, h: 6 },
    isRemovable: true,
    isResizable: true,
    category: 'core',
  },
  // ... other widgets
};
```

---

## 8. Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Customization adoption | >30% of users customize | Track "Save" events |
| Time to customize | <30 seconds | Track edit session duration |
| Reset rate | <10% | Track "Reset to Default" events |
| Widget additions | 2+ widgets added per customizer | Track add events |
| Errors/frustration | <1% error rate | Track errors, rage clicks |

---

## 9. Future Considerations

### Not in Scope (Explicitly)
- Mobile editing (view only on mobile)
- Team shared dashboards
- Widget data configuration (e.g., which metrics to show)
- Custom widget creation
- Dashboard themes/skins

### Future Phases
1. **Database sync** - Save layout to Supabase
2. **Dashboard templates** - Pre-built layouts for different roles
3. **Widget settings** - Configure what data each widget shows
4. **Team dashboards** - Share layouts with team members
5. **Dashboard export/import** - Backup and restore configurations

---

## 10. Open Questions

1. **Should we allow multiple dashboard views?** (e.g., "Overview" vs "Operations")
   - Recommendation: No for MVP, adds complexity

2. **What happens on window resize?**
   - Recommendation: Responsive grid with breakpoints handles this automatically

3. **Should widgets be collapsible?**
   - Recommendation: No - resize handles give same benefit with simpler UX

4. **How do we handle widgets that fail to load?**
   - Recommendation: Error boundary per widget, show "Widget unavailable" placeholder

---

## Appendix A: Library Installation

```bash
# Install react-grid-layout
npm install react-grid-layout @types/react-grid-layout

# The library requires these CSS files to be imported
# (handled in DashboardGrid.tsx)
```

## Appendix B: Accessibility Considerations

1. **Keyboard navigation** in edit mode
   - Arrow keys to move selected widget
   - Tab to cycle through widgets
   - Enter to select, Escape to cancel

2. **Screen reader support**
   - ARIA labels on all interactive elements
   - Live region announcements for drag/drop
   - Widget position announced on move

3. **Focus management**
   - Focus trapped in catalog when open
   - Focus returns to trigger on close
   - Focus visible styling

---

**Document Status:** Ready for Review
