/* ═══════════════════════════════════════════════════════════════════════════════
   FASE 3 - PLAN DE ACCIÓN CONCRETO
   Optimizar Densidad Mobile - MODULE 2_MOBILE_LAYOUT
   ═══════════════════════════════════════════════════════════════════════════════ */

📋 FASE 3: OPTIMIZAR DENSIDAD MOBILE
════════════════════════════════════════════════════════════════════════════════

OBJETIVO PRINCIPAL:
  Implementar MODULE 2 (Mobile Layout System)
  • Aumentar densidad visual +35% en mobile
  • Mostrar 12-15 vehículos completos en pantalla
  • Preservar WCAG AAA accessibility
  • Mantener 100% de micro-detalles v15.3

MEDIDA DE ÉXITO:
  ✅ 12-15 vehículos visibles en pantalla mobile
  ✅ Todos los textos >= 16px (WCAG - iOS no zoom)
  ✅ Contraste 4.5:1 mínimo (WCAG AA)
  ✅ Touch targets >= 44x44px
  ✅ ZERO breaking changes en HTML/JS
  ✅ Tamaño CSS: ~250 líneas

════════════════════════════════════════════════════════════════════════════════
📊 COMPARATIVA ANTES VS DESPUÉS FASE 3
════════════════════════════════════════════════════════════════════════════════

ESTADO ACTUAL (Desktop/Mobile Sin Optimización):
  Mobile viewport: 375px × 667px (iPhone SE)
  Vehículos visibles: 6-8 máximo
  Padding tabla: 0.16rem 0.5rem (preservado v15.3)
  Font table: 0.82rem (preservado v15.3)
  Font mobile: 0.68rem (MÍNIMO por WCAG)
  Line-height: 1.4 normal
  Resultado: Mucho espacio vacío, densidad baja

ESTADO DESEADO (Después FASE 3):
  Mobile viewport: 375px × 667px (iPhone SE)
  Vehículos visibles: 12-15 (exacto: depende cálculo)
  Padding tabla: 0.08rem 0.08rem (ultra-compacto)
  Font table: 0.68rem (mínimo mantenible)
  Font badges: 0.55rem (pequeño pero visible)
  Line-height: 1.2 (compacto), 1.15 (muy compacto)
  Resultado: Máxima densidad, legible, accesible

CÁLCULO DE DENSIDAD:
  altura_fila_actual = padding_top + padding_bottom + line_height_content + border
                     = 0.16rem + 0.16rem + (0.82rem × 1.4) + 1px
                     ≈ 1.7rem ≈ 27.2px
  
  filas_en_scrollable = (600px - header) / 27.2px ≈ 22 filas (ideal)
  filas_visibles_sin_scroll = 6-8 (por viewport)
  
  altura_fila_nuevo = 0.08rem + 0.08rem + (0.68rem × 1.2) + 1px
                    ≈ 0.95rem ≈ 15px
  
  filas_nuevas_visibles = 600px / 15px ≈ 40 filas (teórico)
  filas_visibles_sin_scroll = 12-15 (objetivo real)

════════════════════════════════════════════════════════════════════════════════
🎯 MICRO-DETALLES A PRESERVAR FASE 3
════════════════════════════════════════════════════════════════════════════════

VALORES CRÍTICOS QUE NO PUEDEN CAMBIAR (Consultados v15.3):

1. Colores (EXACTOS):
   ✅ precio-actual: #059669 (verde)
   ✅ precio-original: #ef4444 (rojo)
   ✅ precio-financiado: #7c3aed (purple)
   ✅ 12 badges: colores exactos (plata #c0c0c0, etc)

2. Tipografía (MÍNIMOS WCAG):
   ✅ vehicle-name: 0.70rem (NOT cambiar a 0.65rem)
   ✅ vehicle-details: 0.55rem (pequeño pero legible)
   ✅ precio-actual: 0.7rem (preservar)
   ✅ font-weight: 600-700 (bold para legibilidad)

3. Espacios (COMPRESIÓN INTELIGENTE):
   ✅ Table padding: 0.08rem 0.08rem (vs 0.16rem 0.5rem desktop)
   ✅ Row gap: 0.05rem (minimal vertical)
   ✅ Badge padding: 0.1rem 0.25rem (vs 0.125rem 0.375rem desktop)

4. Contraste & Accessibility:
   ✅ WCAG AA: 4.5:1 mínimo en todos los textos
   ✅ Touch targets: 44x44px mínimo
   ✅ Focus states: preservados exactos
   ✅ prefers-reduced-motion: respetado

════════════════════════════════════════════════════════════════════════════════
📝 ESTRUCTURA MODULE 2_MOBILE_LAYOUT.css (~250 LÍNEAS)
════════════════════════════════════════════════════════════════════════════════

SECCIONES A IMPLEMENTAR:

/* ─────────────────────────────────────────────────────────────────────────
   MOBILE LAYOUT MODULE (MODULE 2)
   Optimiza densidad visual para pantallas móviles
   ───────────────────────────────────────────────────────────────────────── */

/* 1. MOBILE BREAKPOINT & CONTAINER
   ├─ @media (max-width: var(--breakpoint-tablet)): 768px
   ├─ Main scroll container: overflow-y auto, height 100vh
   └─ Maximize visible area sin scrollbar ancho
   Líneas estimadas: 15-20
*/

/* 2. TABLE OPTIMIZATION FOR MOBILE
   ├─ Padding: 0.08rem 0.08rem (ultra-compact vs desktop 0.16rem 0.5rem)
   ├─ Font-size: 0.68rem base (preservar v15.3 minimum)
   ├─ Line-height: 1.2 (vs desktop 1.4)
   ├─ Row gap: 0.05rem (minimal)
   ├─ White-space handling (ellipsis para textos largos)
   └─ Sticky header: preserve z-index 100
   Líneas estimadas: 30-40
*/

/* 3. VEHICLE NAME (MOBILE)
   ├─ Font-size: 0.70rem (preservado, NUNCA cambiar)
   ├─ Font-weight: 700 (bold - legibilidad)
   ├─ Line-height: 1.1 (compact)
   ├─ White-space: nowrap (evitar wrap)
   ├─ Text-overflow: ellipsis (si muy largo)
   └─ Max-width: 90% viewport
   Líneas estimadas: 10-15
*/

/* 4. PRICE SYSTEM (MOBILE)
   ├─ precio-actual: 0.65rem (vs desktop 0.7rem)
   ├─ precio-original: 0.55rem (vs desktop 0.6rem)
   ├─ precio-financiado: 0.6rem (vs desktop 0.75rem)
   ├─ Colores: PRESERVADOS EXACTOS (#059669, #ef4444, #7c3aed)
   ├─ Display: flex column (stack vertical en espacio apretado)
   ├─ Gap: 0.05rem entre precio items
   └─ Font-weight: 600 (vs desktop 800 financiado)
   Líneas estimadas: 20-30
*/

/* 5. COLOR BADGE (MOBILE)
   ├─ Font-size: 0.55rem (vs desktop 0.6rem)
   ├─ Padding: 0.1rem 0.25rem (vs desktop 0.125rem 0.375rem)
   ├─ 12 badges: colores exactos (preservados)
   ├─ White-space: nowrap
   ├─ Display: inline-block
   └─ Min-width: 2rem (readable minimum)
   Líneas estimadas: 30-40
*/

/* 6. KM VALUE (MOBILE)
   ├─ Font-size: 0.65rem
   ├─ Font-weight: 600
   ├─ Color: #6b7280 (neutral)
   ├─ Display: inline-block
   └─ Margin: 0.05rem (minimal)
   Líneas estimadas: 8-12
*/

/* 7. ROW STATES (MOBILE - PRESERVADOS)
   ├─ .highlighted-shared: rgba(98, 0, 255, 0.294)
   ├─ .viewed-row: rgba(188, 188, 188, 0.106)
   ├─ Hover: translateY(-1px) + shadow
   ├─ Opacity values: EXACTAS
   └─ Animation: slideIn 300ms
   Líneas estimadas: 20-25
*/

/* 8. BUTTON & ICON SIZING (MOBILE)
   ├─ Button min-width: 44px (from 36px desktop)
   ├─ Button min-height: 44px (from 36px desktop)
   ├─ Icon size: 16px (preserved)
   ├─ Border-radius: 7px (preserved)
   ├─ Background: #8a5cf69b (exact)
   ├─ Ripple: 0→120% (preserved)
   └─ Hover: brightness(1.12) + translateY(-2px)
   Líneas estimadas: 20-25
*/

/* 9. HEADER OPTIMIZATION (MOBILE)
   ├─ Sticky header: preserved z-index 100
   ├─ Padding: 0.08rem 0.08rem (match table)
   ├─ Font-size: 0.75rem (vs desktop 0.85rem)
   ├─ White-space: wrap (allow if needed)
   └─ Background: rgba(255, 255, 255, 0.98)
   Líneas estimadas: 10-15
*/

/* 10. SCROLLBAR STYLING (MOBILE)
   ├─ Webkit scrollbar: thin
   ├─ scrollbar-color: #d1d5db
   ├─ ::-webkit-scrollbar-width: 4px
   ├─ ::-webkit-scrollbar-thumb: #d1d5db
   └─ Touch-action: manipulation
   Líneas estimadas: 10-15
*/

/* 11. ACCESSIBILITY (MOBILE)
   ├─ Focus: outline 2px solid #7c3aed, offset 2px
   ├─ prefers-reduced-motion: animation-duration 0.01ms
   ├─ prefers-contrast: brightness(1.2) saturate(1.3)
   ├─ prefers-color-scheme: dark (if needed)
   └─ Input text-size: >= 16px (iOS no auto-zoom)
   Líneas estimadas: 15-20
*/

TOTAL ESTIMADO: 250 líneas

════════════════════════════════════════════════════════════════════════════════
📋 REFERENCIAS PARA IMPLEMENTAR
════════════════════════════════════════════════════════════════════════════════

1. VARIABLES DISPONIBLES (MODULE_0_CORE_TOKENS.css):
   ├─ --breakpoint-tablet: 768px
   ├─ --breakpoint-mobile: 520px
   ├─ --space-micro-1: 0.1rem
   ├─ --space-micro-2: 0.12rem
   ├─ --space-micro-3: 0.125rem
   ├─ --duration-fast: 150ms
   ├─ --duration-base: 300ms
   ├─ --easing-smooth: cubic-bezier(0.4, 0, 0.2, 1)
   ├─ --color-success: #059669
   ├─ --color-error: #ef4444
   ├─ --color-brand-purple: #7c3aed
   ├─ --button-radius: 7px
   ├─ --button-bg-primary: #8a5cf69b
   └─ --z-sticky: 100

2. VALORES EXACTOS DE v15.3 (/tmp/microdetails-analysis.txt SECCIÓN 3):
   ├─ Table padding v15.3: 0.16rem 0.5rem
   ├─ Table font: 0.82rem
   ├─ Vehicle name: 0.70rem, weight 700
   ├─ Precio actual: 0.7rem, #059669
   ├─ Precio original: 0.6rem, red
   ├─ Badge: 0.6rem, padding 0.125rem 0.375rem
   └─ Colores badges: 12 exactos (verificar en análisis)

3. MAPEO A PRESERVAR (PRESERVATION_MAPPING.md SECCIÓN 3):
   ├─ Líneas 380-650 estimadas para esta sección
   ├─ 270 líneas totales sección 3
   ├─ Validación: 12-15 vehículos visibles
   └─ WCAG AAA garantizado

════════════════════════════════════════════════════════════════════════════════
🔍 VALIDACIÓN FASE 3 - CHECKLIST
════════════════════════════════════════════════════════════════════════════════

ANTES DE COMPLETAR FASE 3:

Visual & Density:
  ☐ Contar vehículos visibles en iPhone SE 375×667: ¿12-15?
  ☐ Verificar padding ultra-compacto: 0.08rem 0.08rem
  ☐ Font sizes: 0.68rem base, 0.55rem badges, 0.70rem names
  ☐ Line-heights: 1.2 normal, 1.15 ultra-compacto
  ☐ NO wrapping de vehicle-name (ellipsis si largo)
  ☐ Espacios horizontal: respetados (no aplastado)

Accessibility:
  ☐ Contraste 4.5:1 en todos los textos (WCAG AA)
  ☐ Touch targets: buttons/inputs 44x44px
  ☐ Focus states: visible, accessible
  ☐ prefers-reduced-motion: respetado
  ☐ Zoom iOS: no activado (input font >= 16px)

Colorimetry:
  ☐ precio-actual: #059669 exacto
  ☐ precio-original: #ef4444 exacto
  ☐ precio-financiado: #7c3aed exacto
  ☐ 12 badges: colores v15.3 exactos
  ☐ Row states: rgba(98,0,255,0.294) y rgba(188,188,188,0.106)

Performance:
  ☐ Líneas CSS: ~250 (dentro de estimado)
  ☐ ZERO duplicación de variables
  ☐ TODAS las vars desde MODULE_0_CORE_TOKENS.css
  ☐ GPU acceleration: will-change optimizado
  ☐ Transforms only (no width/height changes)

Compatibility:
  ☐ ZERO breaking changes en HTML
  ☐ ZERO breaking changes en JS
  ☐ Tested en: Chrome, Firefox, Safari (mobile)
  ☐ Responsive breakpoints: 520px, 768px, 900px, 1100px

════════════════════════════════════════════════════════════════════════════════
🚀 PASOS EJECUTIVOS FASE 3
════════════════════════════════════════════════════════════════════════════════

PASO 1: Preparación
  1. Abrir CSS_V17_1_ARCHITECTURE.md (read architecture)
  2. Revisar MODULE_0_CORE_TOKENS.css (available variables)
  3. Consultar PRESERVATION_MAPPING.md SECCIÓN 3 (what to preserve)
  4. Consultar /tmp/microdetails-analysis.txt SECCIÓN 3 (exact values)

PASO 2: Crear MODULE_2_MOBILE_LAYOUT.css
  1. Create new file: MODULE_2_MOBILE_LAYOUT.css
  2. Add 11 sections as outlined above
  3. Cada sección: variable-based, no duplicación
  4. Líneas esperadas: 250 total

PASO 3: Validar Densidad
  1. Open html in browser (mobile viewport 375×667)
  2. Count visible vehicles: ¿12-15 en viewport?
  3. Measure row heights: ≤15px cada una
  4. Check scrollable area: responsive, no overflow horizontal

PASO 4: Auditar Accesibilidad
  1. Contrast checker: ¿4.5:1 todos textos?
  2. Focus states: ¿visible en todos targets?
  3. Touch targets: ¿44x44px mínimo?
  4. Lighthouse audit: ¿Accessibility >= 90?

PASO 5: Testing Multiplataforma
  1. iOS Safari: zoom behavior, font-size
  2. Android Chrome: scroll smoothness, touch areas
  3. Desktop (responsive): 768px breakpoint
  4. Very small mobile: 375px edge case

PASO 6: Documento Validación
  1. Create FASE_3_MOBILE_VALIDATION.md
  2. Include: screenshots before/after, measurements, audit results
  3. Confirm: 12-15 vehículos, WCAG AAA
  4. Sign off: ready for FASE 4

════════════════════════════════════════════════════════════════════════════════
💡 TIPS & PRECAUCIONES
════════════════════════════════════════════════════════════════════════════════

✅ HACER:
  ✓ Usar siempre variables de MODULE_0_CORE_TOKENS.css
  ✓ Preservar EXACTAMENTE todos los valores v15.3
  ✓ Media-query OVERRIDE solamente (no cambiar base)
  ✓ Test en dispositivos reales (no solo chrome devtools)
  ✓ Auditar accesibilidad antes de terminar
  ✓ Crear documento FASE_3_MOBILE_VALIDATION.md

❌ NO HACER:
  ✗ Duplicar variables (siempre referenciar)
  ✗ Cambiar colores RGB (exactos o nada)
  ✗ Modificar HTML o JS (CSS only)
  ✗ Usar padding < 0.08rem (readability risk)
  ✗ Font-size < 0.55rem (WCAG violation)
  ✗ Olvidar 44px touch targets en mobile

════════════════════════════════════════════════════════════════════════════════
📊 TIMELINE FASE 3
════════════════════════════════════════════════════════════════════════════════

Estimado total: 2-3 horas

├─ Preparación & lectura referencias: 20 min
├─ Implementar MODULE_2_MOBILE_LAYOUT.css: 60 min
├─ Validar densidad (12-15 vehículos): 20 min
├─ Auditar accesibilidad (WCAG AAA): 20 min
├─ Testing multiplataforma: 20 min
└─ Documentar FASE_3_MOBILE_VALIDATION.md: 15 min

════════════════════════════════════════════════════════════════════════════════
✨ SIGUIENTE: FASE 4 (Desktop Dashboard Premium)
════════════════════════════════════════════════════════════════════════════════

Después FASE 3 completada:
  → Proceder a FASE 4: Implementar MODULE 3
  → Objetivo: Search 120px, 4-col grid, 3 precio columns
  → Tiempo estimado: 2-3 horas

════════════════════════════════════════════════════════════════════════════════
FIN PLAN DE ACCIÓN FASE 3
════════════════════════════════════════════════════════════════════════════════
*/
