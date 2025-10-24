# Styling Guide

**CSS Design System - Design Tokens, Components, and Patterns**

---

## 🎨 Design System Overview

The SeminuevosMex Inventory App uses a sophisticated **glass morphism design system** built on top of Bootstrap 5. This document describes all design tokens, component patterns, and styling guidelines.

---

## 📐 Design Tokens

### Color Palette

#### Primary Colors
```css
:root {
    --brand-purple: #262633;         /* Dark purple - brand primary */
    --brand-dark-purple: #4c1d95;    /* Darker purple - accents */
    --brand-black: #181425;          /* Near black - backgrounds */
    --brand-grey: #262633;           /* Grey - borders, dividers */
}
```

#### Semantic Colors
```css
:root {
    --white: #f9fafb;                /* Almost white - text on dark */
    --text-primary: #f9fafb;         /* Main text color */
    --text-secondary: #d1d5db;       /* Secondary text */
    --text-muted: #a1a1aa;           /* Disabled/muted text */
}
```

#### Glass Morphism Colors
```css
:root {
    --glass-bg: rgba(19, 17, 34, 0.80);      /* Main glass container */
    --glass-card: rgba(29, 25, 59, 0.75);    /* Card variant, more opaque */
    --glass-light: rgba(50, 45, 80, 0.60);   /* Lighter variant for hover */
}
```

#### Semantic Status Colors
```css
:root {
    --success: #10b981;              /* Green - success states */
    --warning: #f59e0b;              /* Amber - warnings */
    --danger: #ef4444;               /* Red - errors */
    --info: #3b82f6;                 /* Blue - information */
}
```

---

### Shadow System

**Elevation Shadows** - Create depth through layering:

```css
:root {
    /* Extra small - subtle shadow */
    --shadow-xs: 0 1px 2px rgba(124, 58, 237, 0.05);
    
    /* Small - card shadow */
    --shadow-sm: 0 2px 4px rgba(124, 58, 237, 0.08);
    
    /* Medium - elevated elements */
    --shadow-md: 0 4px 12px rgba(124, 58, 237, 0.18), 
                 0 1px 4px rgba(0, 0, 0, 0.15);
    
    /* Large - modals, popovers */
    --shadow-lg: 0 8px 32px rgba(124, 58, 237, 0.24), 
                 0 2px 8px rgba(0, 0, 0, 0.25);
    
    /* Extra large - fullscreen overlays */
    --shadow-xl: 0 16px 48px rgba(124, 58, 237, 0.30), 
                 0 4px 12px rgba(0, 0, 0, 0.30);
}
```

**Usage**:
```css
.card {
    box-shadow: var(--shadow-md);
}

.modal {
    box-shadow: var(--shadow-lg);
}

.popover {
    box-shadow: var(--shadow-md);
}
```

---

### Spacing System

**Consistent spacing scale** (based on 0.5rem = 8px):

```css
:root {
    --spacing-xs: 0.25rem;     /* 4px - minimal spacing */
    --spacing-sm: 0.5rem;      /* 8px - small padding */
    --spacing-md: 1rem;        /* 16px - standard padding */
    --spacing-lg: 1.5rem;      /* 24px - large padding */
    --spacing-xl: 2rem;        /* 32px - extra large padding */
    --spacing-2xl: 3rem;       /* 48px - double large */
}
```

**Usage**:
```css
.card {
    padding: var(--spacing-lg);           /* 24px all around */
    margin-bottom: var(--spacing-md);     /* 16px below */
}

.section {
    padding: var(--spacing-xl) 0;         /* Vertical: 32px, horizontal: 0 */
}
```

---

### Typography Tokens

```css
:root {
    /* Font Family */
    --font-primary: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    
    /* Font Sizes */
    --font-size-xs: 0.75rem;       /* 12px */
    --font-size-sm: 0.875rem;      /* 14px */
    --font-size-base: 1rem;        /* 16px */
    --font-size-lg: 1.125rem;      /* 18px */
    --font-size-xl: 1.25rem;       /* 20px */
    --font-size-2xl: 1.5rem;       /* 24px */
    --font-size-3xl: 1.875rem;     /* 30px */
    --font-size-4xl: 2.25rem;      /* 36px */
    
    /* Font Weights */
    --font-weight-regular: 400;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    /* Line Heights */
    --line-height-tight: 1.2;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;
}
```

---

### Animation Timing

```css
:root {
    /* Duration tokens */
    --duration-fast: 150ms;
    --duration-base: 300ms;
    --duration-slow: 500ms;
    
    /* Easing functions */
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-linear: linear;
}
```

---

## 🎯 Glass Morphism System

### Base Glass Container

The foundation of all glass morphism effects:

```css
.glass-bg {
    /* Semi-transparent background */
    background: var(--glass-bg);
    
    /* Blur effect - the key to glass morphism */
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);  /* Safari support */
    
    /* Subtle border for definition */
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    /* Rounded corners */
    border-radius: 12px;
    
    /* Shadow for elevation */
    box-shadow: var(--shadow-md);
    
    /* Prevent text blur */
    background-clip: padding-box;
}
```

### Glass Card Variant

Enhanced version with more opacity:

```css
.glass-card {
    /* Higher opacity than glass-bg for more definition */
    background: var(--glass-card);
    
    /* Stronger blur for more pronounced effect */
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    
    /* Border remains subtle */
    border: 1px solid rgba(255, 255, 255, 0.12);
    
    /* Standard rounding */
    border-radius: 12px;
    
    /* Elevated shadow */
    box-shadow: var(--shadow-lg);
    
    /* Internal padding */
    padding: var(--spacing-lg);
    
    /* Smooth transitions for interactive states */
    transition: all var(--duration-base) var(--ease-out);
}

/* Interactive state - hover */
.glass-card:hover {
    /* Increase opacity on hover */
    background: rgba(29, 25, 59, 0.85);
    
    /* Enhance border visibility */
    border-color: rgba(124, 58, 237, 0.3);
    
    /* Increase shadow for lift effect */
    box-shadow: var(--shadow-xl);
    
    /* Subtle scale effect */
    transform: translateY(-2px);
}

/* Active/Pressed state */
.glass-card:active {
    /* Return to base scale */
    transform: translateY(0);
    
    /* Reduce shadow briefly */
    box-shadow: var(--shadow-md);
}
```

### Glass Morphism with Backdrop

For overlay elements (modals, menus):

```css
.glass-overlay {
    /* Semi-transparent dark background */
    background: rgba(0, 0, 0, 0.4);
    
    /* Apply blur to entire backdrop */
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    
    /* Full screen positioning */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    
    /* Allow interaction with elements beneath */
    pointer-events: none;
}

/* Actual modal on top of overlay */
.glass-modal {
    position: relative;
    background: var(--glass-card);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 16px;
    box-shadow: var(--shadow-lg);
    
    /* Z-index higher than overlay */
    z-index: 100;
}
```

---

## 🎨 Component Styles

### Buttons

#### Primary Button
```css
.btn-primary {
    /* Glass morphism styling */
    background: var(--glass-card);
    border: 1px solid rgba(124, 58, 237, 0.3);
    color: var(--text-primary);
    
    /* Padding and spacing */
    padding: var(--spacing-sm) var(--spacing-lg);
    margin: 0;
    
    /* Shape */
    border-radius: 8px;
    
    /* Typography */
    font-family: var(--font-primary);
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    
    /* Cursor */
    cursor: pointer;
    
    /* Transitions */
    transition: all var(--duration-base) var(--ease-out);
}

.btn-primary:hover {
    background: rgba(124, 58, 237, 0.2);
    border-color: rgba(124, 58, 237, 0.6);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
}

.btn-primary:active {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
}

.btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}
```

#### Icon Button
```css
.btn-icon {
    /* Remove default button styles */
    background: transparent;
    border: none;
    
    /* Icon sizing */
    width: 2.5rem;
    height: 2.5rem;
    
    /* Center icon */
    display: flex;
    align-items: center;
    justify-content: center;
    
    /* Icon color */
    color: var(--text-primary);
    
    /* Cursor */
    cursor: pointer;
    
    /* Rounding */
    border-radius: 8px;
    
    /* Transitions */
    transition: all var(--duration-fast) var(--ease-out);
}

.btn-icon:hover {
    background: rgba(124, 58, 237, 0.15);
}

.btn-icon:active {
    transform: scale(0.95);
}
```

---

### Forms

#### Input Fields
```css
.form-control {
    /* Glass morphism */
    background: var(--glass-bg);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    
    /* Padding */
    padding: var(--spacing-sm) var(--spacing-md);
    
    /* Sizing */
    width: 100%;
    
    /* Shape */
    border-radius: 8px;
    
    /* Typography */
    font-family: var(--font-primary);
    font-size: var(--font-size-base);
    line-height: var(--line-height-normal);
    
    /* Transitions */
    transition: all var(--duration-fast) var(--ease-out);
}

.form-control:focus {
    outline: none;
    border-color: var(--brand-purple);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    background: var(--glass-card);
}

.form-control::placeholder {
    color: var(--text-muted);
}
```

---

### Badges

#### Type Badge
```css
.badge {
    /* Inline display */
    display: inline-block;
    
    /* Padding and shape */
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    
    /* Typography */
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-semibold);
    
    /* Appearance */
    border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Color variants */
.badge-sedan {
    background: rgba(6, 182, 212, 0.15);
    color: #06b6d4;
    border-color: rgba(6, 182, 212, 0.3);
}

.badge-suv {
    background: rgba(251, 146, 60, 0.15);
    color: #fb923c;
    border-color: rgba(251, 146, 60, 0.3);
}

.badge-truck {
    background: rgba(239, 68, 68, 0.15);
    color: #ef4444;
    border-color: rgba(239, 68, 68, 0.3);
}

.badge-van {
    background: rgba(167, 139, 250, 0.15);
    color: #a78bfa;
    border-color: rgba(167, 139, 250, 0.3);
}
```

---

### Tables

#### Desktop Table
```css
.table-desktop {
    width: 100%;
    border-collapse: collapse;
    background: transparent;
}

.table-desktop thead {
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
}

.table-desktop th {
    padding: var(--spacing-md);
    text-align: left;
    font-weight: var(--font-weight-semibold);
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.table-desktop tbody tr {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    transition: all var(--duration-fast) var(--ease-out);
}

.table-desktop tbody tr:hover {
    background: rgba(124, 58, 237, 0.08);
}

.table-desktop td {
    padding: var(--spacing-md);
    color: var(--text-primary);
    vertical-align: middle;
}
```

---

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile: < 576px (default, no media query needed) */
/* Tablet: 576px - 767px */
/* Desktop: 768px+ */
```

### Mobile Strategies

#### 1. Hide/Show by Breakpoint
```css
/* Hidden by default, show on desktop */
.desktop-only {
    display: none;
}

@media (min-width: 768px) {
    .desktop-only {
        display: block;
    }
}

/* Show by default, hide on desktop */
.mobile-only {
    display: block;
}

@media (min-width: 768px) {
    .mobile-only {
        display: none;
    }
}
```

#### 2. Layout Adapts by Breakpoint
```css
/* Mobile: single column */
.grid-responsive {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
}

/* Tablet: two columns */
@media (min-width: 576px) {
    .grid-responsive {
        grid-template-columns: repeat(2, 1fr);
    }
}

/* Desktop: three columns */
@media (min-width: 768px) {
    .grid-responsive {
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-lg);
    }
}
```

#### 3. Spacing Adjusts by Breakpoint
```css
/* Mobile: compact spacing */
.container {
    padding: var(--spacing-md);
}

/* Desktop: generous spacing */
@media (min-width: 768px) {
    .container {
        padding: var(--spacing-xl);
    }
}
```

---

## ✨ Animations and Transitions

### Base Transition Pattern
```css
.element {
    transition: all var(--duration-base) var(--ease-out);
}

.element:hover {
    transform: translateY(-2px);
}

.element:active {
    transform: translateY(0);
}
```

### Fade Animation
```css
@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.fade-in {
    animation: fadeIn var(--duration-base) var(--ease-out);
}
```

### Slide Animation
```css
@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

.slide-in {
    animation: slideIn var(--duration-base) var(--ease-out);
}
```

### Scale Animation
```css
@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.scale-in {
    animation: scaleIn var(--duration-base) var(--ease-out);
}
```

---

## ♿ Accessibility

### Focus States
```css
/* Visible focus for keyboard navigation */
:focus-visible {
    outline: 2px solid var(--brand-purple);
    outline-offset: 2px;
}

/* Remove browser default outline, add custom */
button:focus {
    outline: none;
}

button:focus-visible {
    outline: 2px solid var(--brand-purple);
    outline-offset: 2px;
}
```

### High Contrast Mode
```css
@media (prefers-contrast: more) {
    .glass-bg {
        border-color: rgba(255, 255, 255, 0.4);  /* More visible */
    }
    
    .text-secondary {
        color: rgba(255, 255, 255, 0.9);  /* Higher contrast */
    }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

### Dark Mode Support
```css
@media (prefers-color-scheme: dark) {
    :root {
        /* Already dark by default, no changes needed */
    }
}

@media (prefers-color-scheme: light) {
    /* Only if light mode support needed in future */
}
```

---

## 🔍 CSS Organization

### File Structure
```css
/* ===============================================================================
   1. VARIABLES AND DESIGN TOKENS
   =============================================================================== */
:root { /* All --custom-property definitions */ }

/* ===============================================================================
   2. RESET AND BASE STYLES
   =============================================================================== */
* { /* Global resets */ }
html, body { /* Base tags */ }

/* ===============================================================================
   3. TYPOGRAPHY
   =============================================================================== */
h1, h2, h3 { /* Headings */ }
p, span { /* Text elements */ }

/* ===============================================================================
   4. COMPONENTS
   =============================================================================== */
.btn-primary { /* Button styles */ }
.badge { /* Badge styles */ }
.card { /* Card styles */ }

/* ===============================================================================
   5. LAYOUT
   =============================================================================== */
.container { /* Main container */ }
.grid { /* Grid systems */ }

/* ===============================================================================
   6. RESPONSIVE
   =============================================================================== */
@media (min-width: 576px) { /* Tablet */ }
@media (min-width: 768px) { /* Desktop */ }

/* ===============================================================================
   7. ANIMATIONS
   =============================================================================== */
@keyframes fadeIn { /* Animation definitions */ }

/* ===============================================================================
   8. UTILITIES
   =============================================================================== */
.hidden { /* Utility classes */ }
.no-scroll { /* Functional utilities */ }
```

---

## 📏 Sizing Guidelines

### Width Constraints
```css
/* Full width */
.w-full {
    width: 100%;
}

/* Max content width */
.max-w-container {
    max-width: 1200px;
}

/* Specific sizes */
.w-64 {
    width: 16rem;  /* 256px */
}
```

### Height Constraints
```css
/* Match parent height */
.h-full {
    height: 100%;
}

/* Specific heights */
.h-48 {
    height: 12rem;  /* 192px */
}

/* Min/Max heights */
.min-h-96 {
    min-height: 24rem;
}
```

---

## 🎯 Best Practices

### DO
✅ **Use CSS variables for all design tokens**  
✅ **Follow mobile-first responsive approach**  
✅ **Maintain consistent spacing with spacing scale**  
✅ **Use semantic color names**  
✅ **Group related properties together**  
✅ **Add transition effects for smooth interactions**  
✅ **Test on multiple devices and browsers**  

### DON'T
❌ **Use inline styles**  
❌ **Create custom colors without adding to tokens**  
❌ **Use magic numbers instead of variables**  
❌ **Ignore responsive design**  
❌ **Skip accessibility considerations**  
❌ **Override Bootstrap without good reason**  

---

**Styling Guide Version**: 1.0.0  
**Last Updated**: October 24, 2025  
**Author**: Camilo Pimor
