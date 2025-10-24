# Synchronization Requirements

**HTML ↔ CSS ↔ JavaScript - File Synchronization Rules and Guidelines**

---

## 🎯 The Synchronization Principle

The SeminuevosMex Inventory App consists of **three inseparable files** that must be kept in perfect synchronization. A change in one file requires corresponding changes in the other two.

**Golden Rule**: If you change the structure/classes in HTML, you must update the CSS selectors and JavaScript listeners.

---

## 📋 Synchronization Checklist

Use this checklist when making ANY change to the application:

### Before Making Changes
- [ ] Read all three files completely
- [ ] Understand the dependency chain
- [ ] Create a feature branch: `git checkout -b feature/your-change`
- [ ] Document your changes in a comment

### HTML Changes
- [ ] Updated HTML markup/attributes
- [ ] Added corresponding CSS classes
- [ ] Updated JavaScript selectors if needed
- [ ] Verified ARIA roles and data-* attributes
- [ ] Tested on desktop and mobile

### CSS Changes
- [ ] Updated CSS rules
- [ ] Added to HTML classes or attributes
- [ ] Updated JavaScript selectors if needed
- [ ] Checked responsive breakpoints
- [ ] Verified glass morphism effects

### JavaScript Changes
- [ ] Updated JavaScript selectors
- [ ] Added corresponding HTML elements or data-* attributes
- [ ] Updated CSS classes for new states
- [ ] Updated event listeners
- [ ] Tested all interactions

### Final Steps
- [ ] Updated version numbers in all three file headers
- [ ] Tested in Odoo QWeb environment
- [ ] Verified no console errors
- [ ] Committed with descriptive message
- [ ] Updated this documentation if new patterns created

---

## 🔗 Synchronization Points

### Critical Sync Points

#### 1. Element IDs and Classes

**Pattern**: If HTML has an element with ID/class, JavaScript must target it, CSS must style it.

**Example: Search Input**

*HTML* (inventory.html):
```html
<input 
    id="search-inventario" 
    class="search-input glass-bg"
    type="text" 
    placeholder="Buscar marca, modelo..."
    data-search-type="multi"
/>
```

*CSS* (inventory.css):
```css
#search-inventario {
    background: var(--glass-bg);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    color: var(--text-primary);
}

#search-inventario:focus {
    border-color: var(--brand-purple);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
}
```

*JavaScript* (inventory.js):
```javascript
// Selector must match exactly
var searchInput = document.getElementById('search-inventario');
searchInput.addEventListener('input', function() {
    clearTimeout(InventarioBigData.searchTimeout);
    InventarioBigData.searchTimeout = setTimeout(function() {
        InventarioBigData.buscarInteligente();
        InventarioBigData.renderizar();
    }, 300);
});
```

**Change Rule**: If you rename `id="search-inventario"`:
1. Update HTML: `id="new-search-id"`
2. Update CSS: `#new-search-id { ... }`
3. Update JS: `document.getElementById('new-search-id')`

---

#### 2. Data Attributes

**Pattern**: Data attributes carry information from HTML to JavaScript.

**Example: Vehicle Row Data**

*HTML*:
```html
<tr data-vehiculo='{"id":"CAR-001","marca":"Toyota","modelo":"Camry 2020",...}'>
    <td class="col-brand" data-field="marca">Toyota</td>
    <td class="col-model" data-field="modelo">Camry 2020</td>
    <td class="col-price" data-field="precio">$185,000</td>
</tr>
```

*JavaScript* (reading):
```javascript
cargarVehiculos: function() {
    var rows = document.querySelectorAll('tr[data-vehiculo]');
    rows.forEach(function(row) {
        var vehiculoData = JSON.parse(row.getAttribute('data-vehiculo'));
        this.vehiculos.push(vehiculoData);
    });
}
```

*CSS* (styling):
```css
tr[data-vehiculo] {
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

td[data-field="precio"] {
    color: var(--brand-purple);
    font-weight: 600;
}
```

**Change Rule**: If you add a new data attribute:
1. Update HTML: Add `data-new-attribute="value"`
2. Update JS: Read with `getAttribute('data-new-attribute')`
3. Update CSS: Style with `[data-new-attribute] { ... }`

---

#### 3. CSS Classes for State

**Pattern**: JavaScript adds/removes classes; CSS defines their appearance.

**Example: Viewed Vehicle**

*CSS* (defines appearance):
```css
.vehicle-row.viewed {
    opacity: 0.6;
    background-color: rgba(255, 255, 255, 0.02);
}

.vehicle-row.viewed::before {
    content: '✓ Visto';
    font-size: 0.75rem;
    color: var(--text-muted);
    position: absolute;
    right: 1rem;
    top: 0.5rem;
}
```

*JavaScript* (applies class):
```javascript
configurarAcciones: function() {
    document.querySelectorAll('.vehicle-row').forEach(function(row) {
        row.addEventListener('click', function() {
            // Mark as viewed
            this.classList.add('viewed');
            // Store in localStorage
            localStorage.setItem('viewed_' + carId, 'true');
        });
    });
}
```

*HTML* (no state classes initially):
```html
<tr class="vehicle-row" data-vehiculo="{...}">
    <!-- Class 'viewed' added dynamically by JS -->
</tr>
```

**Change Rule**: If you add a new state class:
1. Update CSS: `.vehicle-row.new-state { ... }`
2. Update JS: `element.classList.add('new-state')`
3. Update HTML: No change (state is dynamic)

---

#### 4. Event Listeners

**Pattern**: HTML structure enables JavaScript to attach listeners.

**Example: Filter Apply Button**

*HTML*:
```html
<button id="btn-apply-filter" class="btn-primary glass-card">
    <span class="btn-icon">✓</span>
    <span class="btn-text">Aplicar Filtros</span>
</button>
```

*CSS*:
```css
#btn-apply-filter {
    background: var(--glass-card);
    border: 1px solid rgba(124, 58, 237, 0.3);
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

#btn-apply-filter:hover {
    background: rgba(124, 58, 237, 0.2);
    border-color: rgba(124, 58, 237, 0.6);
}

#btn-apply-filter:active {
    transform: scale(0.98);
}
```

*JavaScript*:
```javascript
document.getElementById('btn-apply-filter').addEventListener('click', function() {
    InventarioBigData.getCleanFilterValues();
    InventarioBigData.aplicarFiltros();
    InventarioBigData.renderizar();
});
```

**Change Rule**: If you rename or move the button:
1. Update HTML: Change ID/location
2. Update CSS: Update selector `#new-id`
3. Update JS: Update selector in `getElementById`

---

### Responsive Breakpoint Synchronization

**Pattern**: All three files must use identical breakpoint definitions.

**Define in CSS** (single source of truth):
```css
/* Mobile: < 576px (default, no media query) */
/* Tablet: 576px - 767px */
/* Desktop: 768px+ */
```

*CSS Breakpoints*:
```css
@media (max-width: 575px) {
    /* Mobile-only styles */
}

@media (min-width: 576px) and (max-width: 767px) {
    /* Tablet-only styles */
}

@media (min-width: 768px) {
    /* Desktop-only styles */
}
```

*JavaScript Breakpoint*:
```javascript
detectarDispositivo: function() {
    var ancho = window.innerWidth;
    
    // Match CSS breakpoint: 768px
    if (ancho < 768) {
        this.esMobile = true;
    } else {
        this.esMobile = false;
    }
}
```

*HTML Structure* (supports both layouts):
```html
<!-- Desktop table -->
<table id="tabla-inventario" class="desktop-view">
    <tbody id="tabla-body"></tbody>
</table>

<!-- Mobile cards (hidden on desktop) -->
<div id="mobile-table-body" class="mobile-view">
    <!-- Mobile cards inserted here -->
</div>
```

*CSS Responsive*:
```css
.desktop-view {
    display: table;
}

.mobile-view {
    display: none;
}

@media (max-width: 767px) {
    .desktop-view {
        display: none;
    }
    
    .mobile-view {
        display: grid;
        grid-template-columns: 1fr;
    }
}
```

**Change Rule**: If you change breakpoint from 768px to 800px:
1. Update CSS: Change all `@media (min-width: 768px)`
2. Update JS: Change `if (ancho < 768)` to `if (ancho < 800)`
3. Update HTML: May need layout adjustments

---

## 📝 Common Synchronization Scenarios

### Scenario 1: Add a New Filter Type

**Requirement**: Users need to filter by year

**Step 1: HTML - Add Filter Control**
```html
<div class="filter-group" data-filter="ano">
    <label>Año del Vehículo:</label>
    <input 
        type="number" 
        id="filter-ano-min" 
        class="filter-input"
        placeholder="Desde"
        data-filter-type="ano"
        data-filter-bound="min"
    />
    <input 
        type="number" 
        id="filter-ano-max" 
        class="filter-input"
        placeholder="Hasta"
        data-filter-type="ano"
        data-filter-bound="max"
    />
</div>
```

**Step 2: CSS - Style the Filter**
```css
.filter-group[data-filter="ano"] {
    margin-bottom: 1.5rem;
}

#filter-ano-min,
#filter-ano-max {
    width: 48%;
    padding: 0.5rem 0.75rem;
    background: var(--glass-card);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    border-radius: 6px;
}

#filter-ano-min:focus,
#filter-ano-max:focus {
    border-color: var(--brand-purple);
    outline: none;
}
```

**Step 3: JavaScript - Add Filter Logic**
```javascript
// Update data structure
filtrosActivos: {
    // ... existing filters ...
    anoMin: 2010,
    anoMax: new Date().getFullYear()
}

// Update filter reading
getCleanFilterValues: function() {
    // ... existing code ...
    var anoMin = parseInt(document.getElementById('filter-ano-min').value) || 2010;
    var anoMax = parseInt(document.getElementById('filter-ano-max').value) || new Date().getFullYear();
    return {
        // ... existing ...
        anoMin: anoMin,
        anoMax: anoMax
    };
}

// Update filter application
aplicarFiltros: function() {
    // ... existing code ...
    return this.vehiculos.filter(function(v) {
        // ... existing checks ...
        var anoOk = v.ano >= this.filtrosActivos.anoMin && 
                    v.ano <= this.filtrosActivos.anoMax;
        return anoOk && otrasCondiciones;
    });
}
```

**Step 4: Update Version**
```
// Old:
// SEMINUEVOSMEX INVENTARIO – VERSIÓN 15.0

// New:
// SEMINUEVOSMEX INVENTARIO – VERSIÓN 15.1
```

**Step 5: Test & Commit**
```bash
git add src/html/inventory.html src/css/inventory.css src/js/inventory.js
git commit -m "feat: Add year filter to inventory dashboard"
```

---

### Scenario 2: Change UI Component Library

**Requirement**: Replace search input styling with new class

**Before**:
```html
<input id="search-inventario" class="search-input" />
```

```css
.search-input {
    /* old styles */
}
```

```javascript
var searchInput = document.querySelector('.search-input');
```

**After**:
```html
<input id="search-inventario" class="form-control-custom" />
```

```css
.form-control-custom {
    /* new styles */
}
```

```javascript
var searchInput = document.querySelector('.form-control-custom');
```

**Sync Steps**:
1. HTML: Change class name ✓
2. CSS: Update selector ✓
3. JS: Update selector ✓

---

### Scenario 3: Add Mobile-Specific Component

**Requirement**: Add bottom sheet filter for mobile

**Step 1: HTML - Add Mobile Element**
```html
<!-- Desktop popover -->
<div id="filter-popover" class="popover-desktop">
    <!-- desktop filter ui -->
</div>

<!-- Mobile bottom sheet (new) -->
<div id="filter-bottom-sheet" class="bottom-sheet" style="display: none;">
    <!-- mobile filter ui -->
</div>
```

**Step 2: CSS - Responsive Display**
```css
.popover-desktop {
    display: flex;
    position: absolute;
    top: 100%;
    left: 0;
    background: var(--glass-card);
}

.bottom-sheet {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--glass-card);
}

@media (max-width: 767px) {
    .popover-desktop {
        display: none;
    }
    
    .bottom-sheet {
        display: block;
    }
}
```

**Step 3: JavaScript - Handle Both**
```javascript
showCleanFilter: function() {
    if (this.esMobile) {
        // Show bottom sheet
        document.getElementById('filter-bottom-sheet').style.display = 'flex';
        // Add slide-up animation
    } else {
        // Show popover
        document.getElementById('filter-popover').style.display = 'flex';
        // Position correctly
    }
}
```

---

## 🔍 Verification Checklist

### After Every Change, Verify:

- [ ] **HTML is Valid**: No unclosed tags, proper nesting
- [ ] **CSS Selectors Match HTML**: No orphaned CSS rules
- [ ] **JavaScript Selectors Work**: No "undefined" in console
- [ ] **Responsive**: Tested at 320px, 768px, 1920px
- [ ] **Accessibility**: Tested with keyboard, screen reader
- [ ] **QWeb Compatible**: Works in Odoo environment
- [ ] **No Console Errors**: `console.error()` is empty
- [ ] **Performance**: Load time < 2 seconds
- [ ] **Version Updated**: Headers match across all files
- [ ] **Committed**: Git changes documented

---

## 📊 Synchronization Status Reference

| Component | HTML | CSS | JS |
|-----------|------|-----|-----|
| Search Input | ✓ | ✓ | ✓ |
| Filter Button | ✓ | ✓ | ✓ |
| Sort Dropdown | ✓ | ✓ | ✓ |
| Vehicle Row | ✓ | ✓ | ✓ |
| Gallery Button | ✓ | ✓ | ✓ |
| Mobile Card | ✓ | ✓ | ✓ |
| Bottom Sheet | ✓ | ✓ | ✓ |
| Glass Morphism | ✗ | ✓ | ✗ |
| Animations | ✗ | ✓ | ✓ |
| Data Attributes | ✓ | ✗ | ✓ |

---

## 🚀 Best Practices

### DO
✅ **Update all three files for any structural change**  
✅ **Increment version numbers together**  
✅ **Use meaningful CSS class names**  
✅ **Comment complex synchronization points**  
✅ **Test on all breakpoints before committing**  
✅ **Use consistent naming conventions**  

### DON'T
❌ **Change one file without updating others**  
❌ **Use inline styles (defeats CSS sync)**  
❌ **Add IDs/classes without CSS counterparts**  
❌ **Ignore console warnings/errors**  
❌ **Commit partially-synced changes**  
❌ **Mix old and new patterns in same file**  

---

## 📞 Troubleshooting

### Issue: "Element is undefined" in JavaScript Console

**Cause**: JavaScript selector doesn't match HTML ID/class  
**Fix**:
1. Verify element exists in HTML
2. Check selector spelling exactly matches
3. Ensure element has the ID/class
4. Use browser DevTools to inspect element

### Issue: Styles not applying to new element

**Cause**: CSS selector doesn't match HTML class  
**Fix**:
1. Check CSS has selector for the class
2. Verify no more specific rule overrides it
3. Check for typos in class name
4. Inspect with DevTools to see applied styles

### Issue: Mobile view looks wrong

**Cause**: Breakpoint or responsive rule mismatch  
**Fix**:
1. Compare CSS breakpoint with JS breakpoint
2. Check media queries in CSS
3. Inspect viewport width with DevTools
4. Test at exact breakpoint values

### Issue: QWeb template won't render

**Cause**: Invalid HTML, XML escaping, or Odoo sync issue  
**Fix**:
1. Check HTML validity with HTML validator
2. Verify XML special characters are escaped
3. Test in Odoo sandbox first
4. Review Odoo validation rules document

---

## 📚 Reference Documentation

For detailed information, see:
- `ARCHITECTURE.md` - System design and data flow
- `API_REFERENCE.md` - JavaScript method documentation
- `STYLING_GUIDE.md` - CSS design tokens and patterns
- `README.md` - Project overview and getting started

---

**Document Version**: 1.0.0  
**Last Updated**: October 24, 2025  
**Author**: Camilo Pimor  
**Critical Document**: ⚠️ Read before any code changes
