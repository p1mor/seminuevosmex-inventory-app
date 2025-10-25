/* ═══════════════════════════════════════════════════════════════════════════════
   CSS v17.1 MODULAR ARCHITECTURE
   Refactorización por fases con 5 módulos independientes coordinados
   ═══════════════════════════════════════════════════════════════════════════════ */

/*
ARQUITECTURA MODULAR v17.1
══════════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────┐
│                        MODULE 0: CORE TOKENS (Fundación)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Color Palette (13 variables core + 12 variants)                           │
│ • Typography Scale (7 niveles clamp() fluido)                              │
│ • Spacing System (12 tokens 4px base)                                       │
│ • Shadow System (6 niveles + inset)                                         │
│ • Radius System (5 valores + full)                                          │
│ • Motion Tokens (3 duraciones + 2 easing)                                   │
│ • Filter Presets (blur, brightness)                                         │
│                                                                              │
│ Propósito: Fuente única de verdad. Usado por todos los módulos.            │
│ Reutilización: 100% de las variables en otros módulos                      │
│ Tamaño Estimado: ~150 líneas                                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                   MODULE 1: RESET & BASE LAYOUT (Base)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Reset universal (*::* box-sizing)                                         │
│ • HTML smoothing (-webkit-font-smoothing, text-rendering)                   │
│ • Body background gradient                                                  │
│ • Main layout glass container                                               │
│ • Hero portada (100% preservado v15.3)                                      │
│ • Responsive breakpoints (520px, 768px, 900px, 1100px)                     │
│                                                                              │
│ Propósito: Foundation que carga primero. Base para todo lo demás.          │
│ Dependencias: MODULE 0 (tokens)                                             │
│ Tamaño Estimado: ~200 líneas                                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                  MODULE 2: MOBILE LAYOUT SYSTEM (Mobile-First)             │
├─────────────────────────────────────────────────────────────────────────────┤
│ OPTIMIZACIÓN DE DENSIDAD:                                                   │
│ • Mobile table: -35% altura vertical (padding/margins mínimos)             │
│ • Vehicle rows: compactas, legibles, WCAG AAA preservado                   │
│ • Precio inline: 3 valores (actual/financiado/original) en 1 celda         │
│ • Color badge: miniaturizado (0.55rem font)                                 │
│ • KM value: compacto pero visible                                           │
│                                                                              │
│ MICRO-DETALLES PRESERVADOS:                                                │
│ • .vehicle-name: 0.70rem, font-weight: 700, line-height: 1.1               │
│ • .vehicle-details: 0.55rem, white-space: normal                            │
│ • .precio-actual: 0.7rem, font-weight: 600                                  │
│ • .precio-original: 0.6rem, text-decoration: line-through                  │
│ • .km-value: 0.65rem                                                        │
│ • .color-badge: 0.6rem, padding: 0.125rem 0.375rem                        │
│                                                                              │
│ NUEVA DENSIDAD:                                                             │
│ • Padding celda: 0.08rem 0.08rem (vs 0.16rem 0.5rem)                      │
│ • Line-height: 1.2 (compact pero legible)                                   │
│ • Row gap: 0.05rem (minimal vertical)                                       │
│ • Mostrar 12-15 vehículos en pantalla mobile (vs 6-8 ahora)                │
│                                                                              │
│ Propósito: Máxima densidad móvil sin comprometer UX                        │
│ Dependencias: MODULE 0 (tokens), MODULE 1 (reset)                          │
│ Tamaño Estimado: ~250 líneas                                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│              MODULE 3: DESKTOP DASHBOARD SYSTEM (Premium UX)               │
├─────────────────────────────────────────────────────────────────────────────┤
│ SEARCH AVANZADO:                                                            │
│ • Search bar grande (120px height, focus glow)                              │
│ • Filtros inline integrados (precios, km, color, tipo)                      │
│ • Sugerencias/autocomplete container                                        │
│ • Historial búsquedas últimas 5                                             │
│ • Clear search button premium (animated)                                    │
│                                                                              │
│ GRID SOFISTICADO:                                                           │
│ • 4 columnas por defecto (responsive a 3-2-1)                              │
│ • Card elevation (shadow-md → shadow-lg on hover)                           │
│ • Sticky header con filtros activos                                         │
│ • Sorteables por cualquier columna                                          │
│                                                                              │
│ PRECIO COLUMNAS 3X:                                                         │
│ • Columna 1: Precio Original (tachado, muted) + color badge                │
│ • Columna 2: Precio Actual (verde, 1.1rem)                                 │
│ • Columna 3: Precio Financiado (purple, 1.05rem, highlighted)              │
│ • Cada columna con hover state, brightness filter                          │
│                                                                              │
│ PROPÓSITO: Premium dashboard con máxima funcionalidad                      │
│ Dependencias: MODULE 0 (tokens), MODULE 1 (reset)                          │
│ Tamaño Estimado: ~300 líneas                                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                MODULE 4: CARD COMPONENT SYSTEM (Universal)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│ TARJETA ÚNICA MODULAR:                                                      │
│ • Desktop: card row en tabla (responsive flex-wrap)                         │
│ • Mobile: card bloque full-width                                            │
│ • Compartido: mismos estilos base, media-query overrides                    │
│                                                                              │
│ ESTADOS IMPLEMENTADOS:                                                      │
│ • .default: neutral, background 0.10 opacity                                │
│ • .hover: background 0.13, translateY(-1px), shadow-md                     │
│ • .active: border purple, background 0.15                                   │
│ • .shared: background rgba(98, 0, 255, 0.294)                              │
│ • .viewed-row: background rgba(188, 188, 188, 0.106)                       │
│                                                                              │
│ MICRO-ANIMACIONES:                                                          │
│ • Fade in: 300ms smooth                                                     │
│ • Hover: 150ms translateY(-1px)                                             │
│ • Ripple effect: 300ms on click                                             │
│ • Price highlight: 500ms brightness pulse                                   │
│                                                                              │
│ PROPÓSITO: Componente único para desktop+mobile                            │
│ Dependencias: MODULE 0 (tokens), MODULE 2/3 (layouts)                      │
│ Tamaño Estimado: ~200 líneas                                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│              MODULE 5: GLASS MORPHISM & ANIMATIONS++ (Premium)             │
├─────────────────────────────────────────────────────────────────────────────┤
│ GLASS MORPHISM MEJORADO:                                                    │
│ • Blur variables (xs/sm/md/lg)                                              │
│ • Backdrop-filter webkit + standard                                         │
│ • Border: 1px solid rgba(41, 36, 84, 0.25)                                 │
│ • Box-shadow: shadow-lg + glow rgba(124, 58, 237, 0.4)                     │
│ • Brightness filter reutilizable                                            │
│                                                                              │
│ ANIMACIONES PREMIUM (15+ keyframes):                                        │
│ • fadeIn, fadeInDown, fadeInUp                                              │
│ • slideDown, slideUp, slideUpMobile, slideInTag                             │
│ • zoomIn (lightbox)                                                         │
│ • spin (loader)                                                             │
│ • highlightFade, pulsePrice, glowEffect                                     │
│ • rippleWave (button click)                                                 │
│                                                                              │
│ TRANSICIONES COORDINADAS:                                                   │
│ • Fast: 150ms (icons, ripple)                                               │
│ • Base: 300ms (slides, fades)                                               │
│ • Slow: 500ms (modals, overlays)                                            │
│ • Easing: smooth cubic-bezier(0.4, 0, 0.2, 1)                              │
│                                                                              │
│ PERFORMANCE GPU:                                                            │
│ • will-change: transform, contents, scroll-position                         │
│ • Transform: translate/scale (no width/height)                              │
│ • Backdrop-filter: optimizado                                               │
│                                                                              │
│ PROPÓSITO: Premium feel, smooth interactions                               │
│ Dependencias: MODULE 0 (tokens), otros módulos (targets)                   │
│ Tamaño Estimado: ~350 líneas                                                │
└─────────────────────────────────────────────────────────────────────────────┘

INTEGRACIÓN TOTAL:
══════════════════════════════════════════════════════════════════════════════

MODULE 0: CORE TOKENS (Foundation)
   ↓
MODULE 1: RESET & BASE LAYOUT (Scaffolding)
   ↓
├─→ MODULE 2: MOBILE LAYOUT
├─→ MODULE 3: DESKTOP DASHBOARD
├─→ MODULE 4: CARD COMPONENT
└─→ MODULE 5: GLASS MORPHISM & ANIMATIONS

FLUJO DE CONSTRUCCIÓN:
1. Cargar MODULE 0 (variables)
2. Cargar MODULE 1 (reset, base)
3. Cargar MODULES 2-5 en paralelo (no dependencies between)
4. Merge final → src/css/inventory.css

CRITERIOS DE ÉXITO:
✅ 100% micro-detalles v15.3 preservados
✅ Mobile densidad +35% (12-15 vehículos visibles)
✅ Desktop dashboard sofisticado (4 cols, search premium)
✅ Card system modular (desktop+mobile único código)
✅ Glass morphism + 15+ animaciones coordinadas
✅ WCAG AAA accessibility garantizada
✅ Performance GPU acceleration
✅ Cero breaking changes HTML/JS
✅ Tamaño total: 1300-1400 líneas (vs 1562 v17)

═══════════════════════════════════════════════════════════════════════════════
FIN ARQUITECTURA MODULAR
═══════════════════════════════════════════════════════════════════════════════
*/
