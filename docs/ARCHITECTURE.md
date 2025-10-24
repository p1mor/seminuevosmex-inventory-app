# System Architecture

**SeminuevosMex Inventory App - Comprehensive System Design Document**

---

## 📐 Architecture Overview

The SeminuevosMex Inventory App follows a **three-layer architecture** with strict separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER (HTML)                   │
│  • Semantic markup with data-* attributes               │
│  • QWeb template compatibility                          │
│  • SVG sprite system for icons                          │
│  • ARIA roles for accessibility                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│            STYLING LAYER (CSS)                           │
│  • Glass morphism design system                         │
│  • CSS custom properties (variables)                    │
│  • Responsive grid system                              │
│  • Animation framework                                 │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│         APPLICATION LAYER (JavaScript)                   │
│  • InventarioBigData module (IIFE)                      │
│  • State management                                     │
│  • Event handling                                       │
│  • DOM manipulation & rendering                        │
│  • External API integration                            │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│          EXTERNAL INTEGRATIONS                           │
│  • Odoo QWeb Framework (parent)                         │
│  • Bootstrap 5 (responsive grid)                        │
│  • Tawk.to (chat support)                              │
│  • Web Share API (sharing)                             │
│  • Google Analytics (tracking)                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Core Module: InventarioBigData

The JavaScript application is built around a single, self-contained module: **`InventarioBigData`**

### Module Structure

```javascript
(function () {
    'use strict';
    
    var InventarioBigData = {
        // DATA LAYER
        vehiculos: [],
        vehiculosFiltrados: [],
        filtrosActivos: {},
        
        // STATE LAYER
        esMobile: false,
        ordenActual: 'precio',
        inicializado: false,
        
        // PERFORMANCE LAYER
        renderTimeout: null,
        searchTimeout: null,
        resizeTimeout: null,
        
        // METHODS
        init: function() { /* initialization */ },
        // ... 20+ other methods
    };
    
    // IIFE Pattern for encapsulation
    window.InventarioBigData = InventarioBigData;
    document.addEventListener('DOMContentLoaded', function() {
        InventarioBigData.init();
    });
})();
```

### Module Responsibilities

| Component | Responsibility |
|-----------|-----------------|
| **Data Layer** | Manages vehicle data, filtering results, active filters |
| **State Layer** | Tracks UI state (mobile/desktop, current sort, initialization) |
| **Rendering** | Converts state to DOM (desktop/mobile rendering paths) |
| **Events** | Listens to user interactions and triggers appropriate handlers |
| **Integrations** | Manages external APIs (chat, sharing, analytics) |
| **Performance** | Debouncing, lazy loading, animation optimization |

---

## 🔄 Data Flow Architecture

### 1. Initialization Flow

```
DOMContentLoaded Event
         ↓
InventarioBigData.init()
         ↓
├─ detectarDispositivo() → Set esMobile flag
├─ cargarVehiculos() → Read from data-* attributes
├─ cargarDatosGaleria() → Setup gallery images
├─ configurarEventos() → Attach all listeners
├─ initCleanFilterSystem() → Setup filter UI
└─ renderizar() → Initial render
         ↓
Dashboard Ready for User Interaction
```

### 2. Search Flow

```
User types in search box
         ↓
Input Event → Debounce (300ms)
         ↓
buscarInteligente()
├─ Split search into keywords
├─ Match against vehiculos array
├─ Create dynamic tags
└─ Return filtered results
         ↓
aplicarFiltros() → Apply combined filters
         ↓
renderizar() → Update UI
```

### 3. Filter Flow

```
User opens filter popover
         ↓
showCleanFilter() → Display glass-morphism panel
         ↓
getCleanFilterValues() → Normalize current values
         ↓
User adjusts filters (price, km, type, etc.)
         ↓
aplicarFiltros() → Check each vehicle
├─ verificarRangoPrecio()
├─ verificarRangoKM()
├─ Match type/brand/condition
└─ Return matching vehicles
         ↓
renderizar() → Update results
```

### 4. Sorting Flow

```
User clicks sort button
         ↓
ejecutarOrdenamiento()
├─ Parse sort option (precio, km, fecha, etc.)
└─ Store in ordenActual
         ↓
aplicarOrdenamiento()
├─ Sort vehiculosFiltrados array
└─ Execute sort logic
         ↓
renderizar() → Update table/mobile view
```

### 5. Gallery Flow

```
User clicks image thumbnail
         ↓
openLightboxGallery(carId)
         ↓
createLightboxOverlay()
├─ Create fullscreen overlay
├─ Position images
└─ Setup navigation
         ↓
User navigates (arrows/swipe)
├─ updateLightboxImage()
└─ requestAnimationFrame() for smooth animation
         ↓
User closes lightbox
└─ Remove overlay from DOM
```

---

## 🏗️ File Synchronization Architecture

### The Three-File Relationship

```
┌─────────────────────────────────────────┐
│          HTML (inventory.html)          │
│  • Defines structure                   │
│  • Sets data-* attributes              │
│  • References CSS/JS                   │
└─────────────────────────────────────────┘
                    ↓
         Defines points of contact
                    ↓
    ┌───────────────────────────────┐
    │  CSS (inventory.css)          │
    │  • Styles data-* classes      │
    │  • Glass morphism effects     │
    │  • Responsive breakpoints     │
    └───────────────────────────────┘
                    ↓
    ┌───────────────────────────────┐
    │  JS (inventory.js)            │
    │  • Reads data-* attributes    │
    │  • Manipulates DOM            │
    │  • Adds/removes classes       │
    └───────────────────────────────┘
```

### Synchronization Points

**HTML ↔ CSS**
- HTML defines: `<div class="glass-card" data-type="sedan">`
- CSS targets: `.glass-card { background: var(--glass-bg); }`
- Change rule: Update class name in BOTH files

**HTML ↔ JS**
- HTML defines: `<input id="search-inventario" />`
- JS targets: `document.getElementById('search-inventario')`
- Change rule: Update ID/selector in BOTH files

**CSS ↔ JS**
- CSS defines: `.vehicle-row.viewed { opacity: 0.6; }`
- JS adds/removes: `vehicleElement.classList.add('viewed')`
- Change rule: Add style + add class toggle in BOTH files

---

## 📊 Data Structure

### Vehicle Object Schema

```javascript
{
    id: "CAR-001",                    // Unique identifier
    marca: "Toyota",                  // Brand
    modelo: "Camry 2020",            // Model
    precio: 185000,                  // Price in MXN
    km: 45000,                       // Mileage
    tipo: "sedan",                   // Type: sedan, suv, truck, etc.
    color: "Gris",                   // Color
    condicion: "Certificado",        // Certified/Used
    transmision: "Automática",       // Transmission
    combustible: "Gasolina",         // Fuel type
    puertas: 4,                      // Number of doors
    imagenes: [                      // Image URLs
        "https://cdn.example.com/car1.jpg",
        "https://cdn.example.com/car2.jpg"
    ],
    visible: true                    // Display flag
}
```

### Filter Object Schema

```javascript
filtrosActivos: {
    precioMin: 100000,
    precioMax: 500000,
    kmMin: 0,
    kmMax: 200000,
    tipo: ["sedan", "suv"],
    marca: ["Toyota", "Honda"],
    condicion: "Certificado",
    busqueda: ""  // Active search terms
}
```

### State Object Schema

```javascript
{
    esMobile: false,                 // Device type flag
    ordenActual: "precio",           // Current sort: precio|km|fecha|demanda
    inicializado: false,             // Setup complete flag
    vehiculosFiltrados: [],          // Current filtered set
    renderTimeout: null,             // Debounce reference
    searchTimeout: null,             // Search debounce reference
    resizeTimeout: null              // Resize debounce reference
}
```

---

## 🎨 Styling Architecture

### CSS Cascade Structure

```
1. CSS VARIABLES (Global design tokens)
   ├── Colors (--brand-purple, --glass-bg, etc.)
   ├── Spacing (--spacing-xs through --spacing-xl)
   ├── Shadows (--shadow-sm through --shadow-xl)
   └── Timing (--transition-fast, --transition-smooth)

2. BASE STYLES (HTML elements)
   ├── Reset browser defaults
   ├── Typography hierarchy
   └── Focus states for accessibility

3. COMPONENT STYLES (Reusable classes)
   ├── .glass-card (Glass morphism container)
   ├── .glass-bg (Background with blur)
   ├── .btn-primary (Primary button)
   ├── .badge-* (Type indicators)
   └── .filter-popover (Filter UI container)

4. LAYOUT STYLES (Grid & positioning)
   ├── Desktop layout (flexbox grid)
   ├── Tablet layout (responsive adjustment)
   └── Mobile layout (single column)

5. RESPONSIVE OVERRIDES (Breakpoint-specific)
   ├── @media (max-width: 767px) { /* Mobile */ }
   ├── @media (min-width: 768px) { /* Tablet */ }
   └── @media (min-width: 1024px) { /* Desktop */ }

6. UTILITY CLASSES (Single-purpose)
   ├── .hidden (display: none)
   ├── .loading (animation: spin)
   └── .no-scroll (overflow: hidden)

7. STATE MODIFIERS (Dynamic classes)
   ├── .active (Current selection)
   ├── .disabled (Inactive state)
   ├── .viewed (Already seen)
   └── .shared (Already shared)
```

### Glass Morphism System

```css
/* Base glass container */
.glass-bg {
    background: rgba(19, 17, 34, 0.80);  /* Semi-transparent dark */
    backdrop-filter: blur(12px);          /* Blur effect */
    border: 1px solid rgba(255, 255, 255, 0.1);  /* Subtle border */
    border-radius: 12px;                  /* Rounded corners */
}

/* Card variant with more opacity */
.glass-card {
    background: rgba(29, 25, 59, 0.75);  /* Slightly more opaque */
    backdrop-filter: blur(16px);          /* Stronger blur */
    box-shadow: var(--shadow-md);         /* Elevation */
    padding: 1.5rem;                      /* Internal spacing */
}

/* On hover - enhance effect */
.glass-bg:hover {
    background: rgba(19, 17, 34, 0.90);  /* More opaque on hover */
    border-color: rgba(124, 58, 237, 0.3);  /* Purple tint border */
}
```

---

## ⚡ Performance Optimization Strategy

### 1. Debouncing

**Search Input** (300ms debounce)
```javascript
searchTimeout = setTimeout(function() {
    buscarInteligente();
    renderizar();
}, 300);
```

**Resize Listener** (200ms debounce)
```javascript
resizeTimeout = setTimeout(function() {
    detectarDispositivo();
    renderizar();
}, 200);
```

### 2. RequestAnimationFrame

Used for smooth animations and DOM updates:
```javascript
requestAnimationFrame(function() {
    // Update transform for smooth scroll/animation
    element.style.transform = 'translateX(' + x + 'px)';
});
```

### 3. Lazy Loading

Gallery images loaded on-demand:
- Thumbnails: Low-res placeholders
- Full gallery: Load when lightbox opens
- Images: Preload next/previous images

### 4. Event Delegation

Single event listener for multiple elements:
```javascript
// Instead of adding listener to each row:
// document.querySelectorAll('.vehicle-row').forEach(...)

// Use delegation on parent:
tableContainer.addEventListener('click', function(e) {
    if (e.target.closest('.vehicle-row')) {
        // Handle click
    }
});
```

### 5. Efficient DOM Manipulation

- Batch updates using DocumentFragment
- Minimize reflows with CSS transforms
- Use classes for bulk style changes instead of inline styles

---

## 🔌 Integration Points

### 1. Odoo QWeb Integration
- Template lives in Odoo module XML
- JavaScript injected via QWeb tags
- CSS linked in template `<head>`
- Data passed from Odoo backend via `t-set` directives

### 2. Bootstrap 5 Integration
- Grid system: `container`, `row`, `col-*`
- Components: Buttons, badges, utilities
- Utilities: Spacing, flexbox, display helpers
- Overrides: Minimal custom CSS, preserves Bootstrap defaults

### 3. Tawk.to Chat Integration
```javascript
configurarChat: function() {
    var chatData = InventarioBigData.generarSuperEtiquetaChat(vehicleId);
    Tawk_API.setAttributes({
        'car_id': vehicleId,
        'car_model': vehicleName
    });
}
```

### 4. Web Share API Integration
```javascript
configurarCompartir: function() {
    if (navigator.share) {
        navigator.share({
            title: 'Auto: ' + vehicleName,
            text: 'Mira este auto en SeminuevosMex',
            url: shareUrl
        });
    } else {
        compartirFallback();  // Fallback method
    }
}
```

---

## 🎯 Responsive Design Architecture

### Mobile-First Approach

```css
/* Base: Mobile (320px) */
.vehicle-row {
    display: flex;
    flex-direction: column;
    padding: 1rem;
}

/* Tablet: 768px+ */
@media (min-width: 768px) {
    .vehicle-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        padding: 1.5rem;
    }
}

/* Desktop: 1024px+ */
@media (min-width: 1024px) {
    .vehicle-row {
        display: table-row;
        padding: 0;
    }
}
```

### Breakpoint-Specific Rendering

```javascript
detectarDispositivo: function() {
    var ancho = window.innerWidth;
    
    if (ancho < 768) {
        this.esMobile = true;
        this.renderizarMobile();
    } else {
        this.esMobile = false;
        this.renderizarDesktop();
    }
}
```

---

## 🔒 Security Architecture

### Input Sanitization
- Search input escaped before DOM insertion
- Filter values type-checked
- URLs validated before share

### XSS Prevention
- Avoid `innerHTML` (use `textContent`)
- Use data-* attributes for dynamic data
- Validate all user inputs

### CSRF Protection
- Relies on Odoo framework CSRF tokens
- No direct backend communication in this app
- Form submissions handled by parent template

---

## ♿ Accessibility Architecture

### ARIA Implementation
- Roles: `role="list"`, `role="listitem"`, `role="button"`
- Labels: `aria-label`, `aria-describedby`
- States: `aria-expanded`, `aria-selected`, `aria-disabled`
- Live regions: `aria-live="polite"` for dynamic updates

### Keyboard Navigation
- Tab order preserved through logical DOM order
- Enter/Space to activate buttons
- Escape to close modals/popovers
- Arrow keys for gallery navigation

### Screen Reader Support
- Semantic HTML: `<button>`, `<form>`, `<table>`
- Image alt text for vehicle photos
- Icon descriptions via `aria-label`
- Form labels via `<label for="id">`

---

## 📈 Scalability Architecture

### Current Capacity
- **Vehicles**: Up to 500+ entries (optimized rendering)
- **Page Load**: < 2 seconds on 4G
- **Interactions**: Sub-100ms response time

### Future Scalability (v1.1.0+)

**Virtual Scrolling** (for 1000+ vehicles)
```javascript
// Only render visible items in viewport
// Scroll simulation with offset calculations
renderVirtualScroll: function() {
    var visibleStart = scrollOffset / itemHeight;
    var visibleEnd = visibleStart + viewportHeight / itemHeight;
    return vehiculos.slice(visibleStart, visibleEnd);
}
```

**Pagination** (as alternative)
```javascript
currentPage: 1,
itemsPerPage: 50,
getPageItems: function() {
    var start = (this.currentPage - 1) * this.itemsPerPage;
    return vehiculosFiltrados.slice(start, start + this.itemsPerPage);
}
```

---

## 🧪 Testing Architecture

### Unit Testing (JavaScript)
```javascript
// Test: Search functionality
test('buscarInteligente finds by brand', function() {
    InventarioBigData.busqueda = 'Toyota';
    var results = InventarioBigData.buscarInteligente();
    assert(results.length > 0);
    assert(results[0].marca === 'Toyota');
});
```

### Integration Testing
```javascript
// Test: Filter + Sort + Search combined
test('combined filters work together', function() {
    InventarioBigData.filtrosActivos = { precioMax: 200000 };
    InventarioBigData.busqueda = 'sedan';
    InventarioBigData.ordenActual = 'precio';
    
    InventarioBigData.aplicarFiltros();
    InventarioBigData.aplicarOrdenamiento();
    
    assert(InventarioBigData.vehiculosFiltrados.length > 0);
});
```

### End-to-End Testing
- Manual testing across all breakpoints
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Accessibility testing with screen readers
- Performance testing with DevTools

---

## 🔄 Version Control Strategy

### Branching Model
```
main (production)
├── develop (staging)
└── feature/* (features)
    ├── feature/virtual-scroll
    ├── feature/favorites
    └── feature/comparison-tool
```

### Commit Message Format
```
feat: Add vehicle comparison tool
fix: Fix mobile filter positioning
style: Update glass morphism opacity
refactor: Simplify filter logic
docs: Update API documentation
perf: Optimize gallery rendering
```

### Version Numbering
- **MAJOR.MINOR.PATCH** (e.g., 1.0.0)
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

---

**Document Version**: 1.0.0  
**Last Updated**: October 24, 2025  
**Author**: Camilo Pimor
