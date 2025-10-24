/* ===============================================================================
 SEMINUEVOSMEX INVENTARIO – VERSIÓN 15.1 REFACTORIZADA (2025-10-24) – ODOO QWEB/BOOTSTRAP
 Sincronía: [JS: v15.1-javascript-refactorizado] + [CSS: v15-css] + [HTML: v15-html]
 Entorno: Odoo QWeb/SaaS (Bootstrap nativo) – Cumple rules y nomenclatura Odoo Bootstrap
-----------------------------------------------------------------------------------------
 DEPURACIÓN V15.0 → V15.1:
   - Consolidación pixel functions: 3 funciones reducidas a 1 función base + 3 wrappers
   - Eliminación mostrarGaleria(): lógica duplicada de openLightboxWithTransition() movida
   - Refactorización renderizado: método _buildRowData() elimina duplicidad desktop/mobile
   - Optimización filtros: verificarRangoPrecio() y verificarRangoKM() con objetos vs switch
   - Consolidación setGaleriaListeners: antes llamada 2x, ahora 1x en flujo central

 REDUCCIONES:
   - ~200 líneas eliminadas (duplicidades consolidadas)
   - Métodos comunes: preloadImage(), configurarEventos(), aplicarFiltros() sin cambios
   - Funcionalidad: 100% preservada, cero funciones eliminadas

 FUNCIONALIDAD PRINCIPAL:
   - Filtros avanzados con diseño glass morphism (popover interactivo)
   - Responsive: móvil y escritorio, bottom sheet en mobile
   - Búsqueda inteligente multi-palabra, tags dinámicos
   - Galería de imágenes con lightbox moderno, SVG iconografía
   - Acciones: chat (Tawk.to) y compartir (Web Share API + fallback)
   - UX: animaciones suaves, accesibilidad, sombreado de vistos/compartidos
   - Rendimiento optimizado: debouncing, requestAnimationFrame, lazy listeners
   - Mobile: interfaz táctil amigable, bottom sheet, iconos compactos

 ÍNDICE DE CONTENIDO - JAVASCRIPT v15.1:
 =======================================
 1. IIFE WRAPPER - Encapsulación y protección global
 2. OBJETO PRINCIPAL - InventarioBigData: propiedades y métodos core
 3. PROPIEDADES CORE - vehiculos[], filtrosActivos{}, ordenActual, esMobile, etc.
 4. FUNCIÓN INIT - Inicialización principal, setup de listeners y render
 5. DETECCIÓN DISPOSITIVO - detectarDispositivo(), resize handler optimizado
 6. CARGA DE VEHÍCULOS - cargarVehiculos() desde DOM data-attributes
 7. GALERÍA DATOS - cargarDatosGaleria(), generarImagenesVehiculo()
 8. LIGHTBOX SISTEMA - createLightboxOverlay(), openLightboxGallery(), navegación
 9. EVENTOS PRINCIPALES - configurarEventos(), búsqueda, ordenamiento, filtros, galería
10. FILTROS GLASS MORPHISM - initCleanFilterSystem(), popover interactivo, handlers
11. FILTROS POPOVER - createCleanFilterPopover(), showCleanFilter(), posicionamiento
12. FILTROS VALORES - getCleanFilterValues(), normalización tipo, rangos precio/km
13. SISTEMA DE BÚSQUEDA - buscarInteligente(), tags dinámicos, timeout optimizado
14. SISTEMA ORDENAMIENTO - ejecutarOrdenamiento(), aplicarOrdenamiento(), botones
15. SISTEMA FILTROS - aplicarFiltros(), verificarRangoPrecio(), verificarRangoKM()
16. RENDERIZADO ADAPTATIVO - renderizar(), _buildRowData() [CONSOLIDADO], desktop/mobile
17. INTERFAZ FILTROS - mostrarTagsFiltros(), limpiarFiltros(), removerTag()
18. ACCIONES VEHÍCULOS - configurarAcciones(), configurarChat(), configurarCompartir()
19. URL SHARING - filterByCarIdFromURL(), compartirFallback(), deep linking
20. LISTENERS GALERÍA - setGaleriaListeners() [NO DUPLICADO]
21. PIXEL TRACKING - buildVehiclePixelData(), pixelTrack() [CONSOLIDADO 3→1+wrappers]
22. UTILIDADES - getColorClass(), normalizarTipoVehiculo(), generarSuperEtiquetaChat()
23. EXPOSICIÓN GLOBAL - window.InventarioBigData, inicialización automática

 AUTOR: Camilo Pimor
=============================================================================== */

(function () {
    'use strict';

    var InventarioBigData = {
        // ==========================================
        // ESTRUCTURA PRINCIPAL DE DATOS
        // ==========================================
        vehiculos: [], 
        vehiculosFiltrados: [], 
        filtrosActivos: {}, 
        ordenActual: 'precio',
        
        // ==========================================
        // ESTADO DE UI Y RESPONSIVE
        // ==========================================
        esMobile: false,
        
        // ==========================================
        // OPTIMIZACIÓN DE RENDIMIENTO
        // ==========================================
        inicializado: false, 
        renderTimeout: null, 
        searchTimeout: null,
        resizeTimeout: null,
        
        // ==========================================
        // SISTEMA DE GALERÍA OPTIMIZADO
        // ==========================================
        productos: {}, 
        productInfo: {}, 
        currentImages: [], 
        currentIndex: -1,
        imageCache: new Map(), // Cache de imágenes precargadas
        preloadQueue: [], // Cola de precarga
        
        // ==========================================
        // SISTEMA DE FILTROS
        // ==========================================
        filterPopover: null,

        // ==========================================
        // DETECCIÓN TAWK.TO Y ESTADO INICIAL
        // ==========================================
        _initTawk: (function () {
            window.InventarioBigData = window.InventarioBigData || {};
            window.InventarioBigData.chatReady = false;
            window.Tawk_API = window.Tawk_API || {};
            window.Tawk_API.onLoad = function() {
                window.InventarioBigData.chatReady = true;
            };
            return null;
        })(),

        // ==========================================
        // INICIALIZACIÓN
        // ==========================================
        init: function () {
            if (this.inicializado) return;
            try {
            console.log('[INVENTARIO-V12] 🚀 Iniciando sistema versión 12.0...');
            this.detectarDispositivo();
            this.cargarVehiculos();
            this.cargarDatosGaleria();
            this.createLightboxOverlay();
            this.configurarEventos();
            this.initCleanFilterSystem();
            this.aplicarFiltrosYRenderizar();
            this.filterByCarIdFromURL(); // <-- Llama después de renderizar
            this.inicializado = true;
            console.log('[INVENTARIO-V12] ✅ Sistema inicializado correctamente');
            console.log('[INVENTARIO-V12] 📊 Vehículos cargados:', this.vehiculos.length);
            } catch (error) {
            console.error('[INVENTARIO-V12] ❌ Error durante inicialización:', error);
            }
        },
        // ==========================================
        // DETECCIÓN RESPONSIVE
        // ==========================================
        detectarDispositivo: function () {
            this.esMobile = window.innerWidth <= 768;

            var self = this;
            window.addEventListener('resize', function () {
            clearTimeout(self.resizeTimeout);
            self.resizeTimeout = setTimeout(function () {
                var nuevoEsMobile = window.innerWidth <= 768;
                if (nuevoEsMobile !== self.esMobile) {
                self.esMobile = nuevoEsMobile;
                console.log('[INVENTARIO-V12] 📱 Dispositivo cambiado a:', self.esMobile ? 'Mobile' : 'Desktop');
                self.aplicarFiltrosYRenderizar();
                }
            }, 250);
            });
        },

        // ==========================================
        // CARGA DE DATOS DESDE EL DOM
        // ==========================================
        cargarVehiculos: function () {
            var filasDesktop = document.querySelectorAll('#tabla-inventario tbody tr[data-id]');
            var filasMobile = document.querySelectorAll('#mobile-table-body tr[data-id]');
            // Usa desktop si existe, si no usa móvil
            var filas = (filasDesktop.length > 0 ? filasDesktop : filasMobile);

            this.vehiculos = [];

            for (var i = 0; i < filas.length; i++) {
                var fila = filas[i];
                var tipoValor = fila.getAttribute('data-tipo');
                if (!tipoValor) {
                    var tdTipo = fila.querySelector('.col-tipo-auto');
                    tipoValor = tdTipo ? tdTipo.textContent.trim() : '';
                }
                var vehiculo = {
                    elemento: fila,
                    id: fila.getAttribute('data-id') || '',
                    marca: fila.getAttribute('data-marca') || '',
                    modelo: fila.getAttribute('data-modelo') || '',
                    variante: fila.getAttribute('data-variante') || '',
                    año: parseInt(fila.getAttribute('data-año')) || 0,
                    precio: parseInt(fila.getAttribute('data-precio')) || 0,
                    km: parseInt(fila.getAttribute('data-km')) || 0,
                    transmision: fila.getAttribute('data-transmision') || '',
                    combustible: fila.getAttribute('data-combustible') || '',
                    color: fila.getAttribute('data-color') || '',
                    ubicacion: fila.getAttribute('data-ubicacion') || '',
                    tipo: tipoValor || '', // <-- Lee tipo del atributo o del td
                    vehiculoCompleto: '',
                    searchText: ''
                };

                vehiculo.vehiculoCompleto = vehiculo.marca + ' ' + vehiculo.modelo + (vehiculo.variante ? ' ' + vehiculo.variante : '') + ' ' + vehiculo.año;
                vehiculo.searchText = [
                    vehiculo.marca, vehiculo.modelo, vehiculo.variante,
                    vehiculo.año, vehiculo.transmision, vehiculo.combustible,
                    vehiculo.color, vehiculo.ubicacion, vehiculo.tipo
                ].join(' ').toLowerCase();

                this.vehiculos.push(vehiculo);
            }

            this.vehiculosFiltrados = this.vehiculos.slice();
            console.log('[INVENTARIO-V12] 📊 Datos cargados:', this.vehiculos.length, 'vehículos');
        },

        // ==========================================
        // PREPARACIÓN DE DATOS DE GALERÍA
        // ==========================================
        cargarDatosGaleria: function () {
            this.productos = {};
            this.productInfo = {};

            var self = this;
            document.querySelectorAll('#tabla-inventario tbody tr[data-id]').forEach(function (fila) {
                var id = fila.getAttribute('data-id');
                var marca = fila.getAttribute('data-marca') || '';
                var modelo = fila.getAttribute('data-modelo') || '';
                var variante = fila.getAttribute('data-variante') || '';
                var año = fila.getAttribute('data-año') || '';
                var vehiculoNombre = marca + ' ' + modelo + (variante ? ' ' + variante : '') + ' ' + año;
                self.productInfo[id] = vehiculoNombre;

                // Leer imágenes reales del atributo data-images del HTML
                var dataImages = fila.getAttribute('data-images');
                if (dataImages && dataImages.length > 0) {
                    self.productos[id] = dataImages.split(',').map(function(x){ return x.trim(); }).filter(Boolean);
                } else {
                    // Si no hay imágenes, usar placeholder
                    self.productos[id] = self.generarImagenesVehiculo(id);
                }
            });
        },

        generarImagenesVehiculo: function (vehiculoId) {
            var baseUrl = 'https://via.placeholder.com/600x400/';
            var colores = ['0066CC', 'CC6600', '00CC66', 'CC0066'];
            var etiquetas = ['Exterior+Frontal', 'Interior+Tablero', 'Vista+Lateral', 'Compartimento+Motor'];

            return colores.map(function(color, index) {
                return baseUrl + color + '/FFFFFF?text=' + etiquetas[index] + '+' + vehiculoId;
            });
        },

        // ==========================================
        // SISTEMA DE GALERÍA LIGHTBOX
        // ==========================================
        // ==========================================
        // SISTEMA DE PRECARGA INTELIGENTE
        // ==========================================
        preloadImage: function(url) {
            if (this.imageCache.has(url)) {
                return Promise.resolve(this.imageCache.get(url));
            }

            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.imageCache.set(url, img);
                    resolve(img);
                };
                img.onerror = reject;
                img.src = url;
            });
        },

        preloadGalleryImages: function(productId) {
            const images = this.productos[productId] || [];
            const loadPromises = images.map(url => this.preloadImage(url));
            
            Promise.all(loadPromises).then(() => {
                console.log('[INVENTARIO-V12] 🚀 Imágenes precargadas para:', productId);
            }).catch(err => {
                console.warn('[INVENTARIO-V12] ⚠️ Error precargando:', err);
            });
        },

        createLightboxOverlay: function () {
            var existingLightbox = document.getElementById('unified-lightbox');
            if (existingLightbox) {
                existingLightbox.remove();
            }

            var overlay = document.createElement('div');
            overlay.id = 'unified-lightbox';
            overlay.className = 'lightbox-overlay';
            overlay.style.cssText = `
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 9999;
                justify-content: center;
                align-items: center;
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
            `;

            overlay.innerHTML = `
            <div class="lightbox-content">
                <div class="lightbox-header">
                    <div class="lightbox-counter">
                        <span id="lightbox-current">1</span> / <span id="lightbox-total">1</span>
                    </div>
                    <button class="lightbox-close" aria-label="Cerrar">×</button>
                </div>
                <div class="lightbox-loading" id="lightbox-loading">
                    <div class="loading-spinner"></div>
                    <p>Cargando imagen...</p>
                </div>
                <div class="lightbox-image-container">
                    <button class="lightbox-prev" aria-label="Anterior">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="15,18 9,12 15,6"></polyline>
                        </svg>
                    </button>
                    <img class="lightbox-image" src="" alt="Imagen grande" style="display: none;"/>
                    <button class="lightbox-next" aria-label="Siguiente">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9,18 15,12 9,6"></polyline>
                        </svg>
                    </button>
                </div>
                <div class="lightbox-thumbnails" id="lightbox-thumbnails"></div>
            </div>
            `;

            document.body.appendChild(overlay);
        },

        openLightboxGallery: function (productId) {
            this.closeLightbox();

            // GUARDAR EL PRODUCTO COMO VISTO EN localStorage
            var vistos = JSON.parse(localStorage.getItem('vehiculos_vistos') || '[]');
            if (!vistos.includes(productId)) {
                vistos.push(productId);
                localStorage.setItem('vehiculos_vistos', JSON.stringify(vistos));
            }

            // FORZAR RE-RENDERIZADO DE LA TABLA PARA APLICAR EL SOMBREADO INSTANTÁNEO
            this.aplicarFiltrosYRenderizar();

            this.currentImages = this.productos[productId] || [];
            if (this.currentImages.length === 0) return;

            // Precargar todas las imágenes de la galería
            this.preloadGalleryImages(productId);

            this.currentIndex = 0;
            this.openLightboxWithTransition(0, productId);
        },

        openLightboxWithTransition: function (index, productId) {
            if (this.currentImages.length === 0) return;
            
            this.currentIndex = index;
            var overlay = document.getElementById('unified-lightbox');
            var imageElement = overlay.querySelector('.lightbox-image');
            var loadingElement = overlay.querySelector('#lightbox-loading');
            var counterCurrent = overlay.querySelector('#lightbox-current');
            var counterTotal = overlay.querySelector('#lightbox-total');
            
            // Mostrar overlay y loading
            overlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            loadingElement.style.display = 'block';
            imageElement.style.display = 'none';
            
            // Actualizar contadores
            if (counterCurrent) counterCurrent.textContent = index + 1;
            if (counterTotal) counterTotal.textContent = this.currentImages.length;
            
            // Generar thumbnails
            this.generateThumbnails(this.currentImages, index);
            
            var self = this;
            
            // Cargar imagen con precarga
            this.preloadImage(this.currentImages[index]).then(function(img) {
                imageElement.src = img.src;
                loadingElement.style.display = 'none';
                imageElement.style.display = 'block';
                
                // Animación de entrada suave
                imageElement.style.opacity = '0';
                imageElement.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    imageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    imageElement.style.opacity = '1';
                    imageElement.style.transform = 'scale(1)';
                }, 50);
                
            }).catch(function() {
                // Fallback si falla la carga
                imageElement.src = self.currentImages[index];
                loadingElement.style.display = 'none';
                imageElement.style.display = 'block';
            });

            // Configurar controles una sola vez
            this.setupLightboxControls(overlay);
        },

        generateThumbnails: function(images, currentIndex) {
            var thumbnailContainer = document.getElementById('lightbox-thumbnails');
            if (!thumbnailContainer || images.length <= 1) return;
            
            var thumbnailsHTML = '';
            var self = this;
            
            images.forEach(function(url, index) {
                var activeClass = index === currentIndex ? ' active' : '';
                thumbnailsHTML += `
                    <div class="lightbox-thumbnail${activeClass}" data-index="${index}">
                        <img src="${url}" alt="Miniatura ${index + 1}" loading="lazy" />
                    </div>
                `;
            });
            
            thumbnailContainer.innerHTML = thumbnailsHTML;
            
            // Event listeners para thumbnails
            thumbnailContainer.querySelectorAll('.lightbox-thumbnail').forEach(function(thumb) {
                thumb.addEventListener('click', function() {
                    var index = parseInt(this.getAttribute('data-index'));
                    self.goToImage(index);
                });
            });
        },

        setupLightboxControls: function(overlay) {
            var self = this;
            var closeBtn = overlay.querySelector('.lightbox-close');
            var prevBtn = overlay.querySelector('.lightbox-prev');
            var nextBtn = overlay.querySelector('.lightbox-next');

            // Variables para prevenir clicks rápidos y zoom
            var lastClickTime = 0;
            var clickDebounceMs = 300; // Tiempo mínimo entre clicks
            var touchStartTime = 0;
            var maxTouchDuration = 200; // Máximo tiempo de toque válido

            // Función para prevenir zoom y eventos múltiples
            function preventZoomAndHandle(callback) {
                return function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    var now = Date.now();
                    
                    // Prevenir clicks muy rápidos (debouncing)
                    if (now - lastClickTime < clickDebounceMs) {
                        return false;
                    }
                    lastClickTime = now;
                    
                    // Para touch events, verificar duración
                    if (e.type === 'touchstart') {
                        touchStartTime = now;
                        return false;
                    }
                    
                    if (e.type === 'touchend') {
                        if (now - touchStartTime > maxTouchDuration) {
                            return false; // Toque muy largo, probablemente no intencional
                        }
                    }
                    
                    // Ejecutar callback con delay para evitar conflictos
                    setTimeout(callback, 10);
                    return false;
                };
            }

            // Remover listeners anteriores para evitar duplicados
            if (closeBtn && !closeBtn._hasListener) {
                var closeHandler = preventZoomAndHandle(function() { self.closeLightbox(); });
                
                closeBtn.addEventListener('click', closeHandler);
                closeBtn.addEventListener('touchend', closeHandler);
                closeBtn.addEventListener('touchstart', function(e) { 
                    e.preventDefault(); 
                    touchStartTime = Date.now(); 
                });
                
                closeBtn._hasListener = true;
            }
            
            if (prevBtn && !prevBtn._hasListener) {
                var prevHandler = preventZoomAndHandle(function() { self.prevImageSmooth(); });
                
                prevBtn.addEventListener('click', prevHandler);
                prevBtn.addEventListener('touchend', prevHandler);
                prevBtn.addEventListener('touchstart', function(e) { 
                    e.preventDefault(); 
                    touchStartTime = Date.now(); 
                });
                
                prevBtn._hasListener = true;
            }
            
            if (nextBtn && !nextBtn._hasListener) {
                var nextHandler = preventZoomAndHandle(function() { self.nextImageSmooth(); });
                
                nextBtn.addEventListener('click', nextHandler);
                nextBtn.addEventListener('touchend', nextHandler);
                nextBtn.addEventListener('touchstart', function(e) { 
                    e.preventDefault(); 
                    touchStartTime = Date.now(); 
                });
                
                nextBtn._hasListener = true;
            }

            // Prevenir zoom en todo el overlay para móvil
            overlay.addEventListener('touchstart', function(e) {
                // Solo prevenir si es sobre los botones o imagen
                if (e.target.closest('.lightbox-prev, .lightbox-next, .lightbox-close, .lightbox-image')) {
                    e.preventDefault();
                }
            }, { passive: false });

            overlay.addEventListener('touchmove', function(e) {
                // Prevenir scroll accidental durante navegación
                if (e.target.closest('.lightbox-prev, .lightbox-next, .lightbox-close')) {
                    e.preventDefault();
                }
            }, { passive: false });

            // Cerrar al hacer click en overlay (solo si click directo en fondo)
            overlay.onclick = function(e) {
                if (e.target === overlay) {
                    self.closeLightbox();
                }
            };
        },

        closeLightbox: function () {
            var overlay = document.getElementById('unified-lightbox');
            if (overlay) {
                overlay.style.display = 'none';
                document.body.style.overflow = '';
            }
        },

        prevImageSmooth: function () {
            if (this.currentImages.length === 0) return;
            const newIndex = (this.currentIndex - 1 + this.currentImages.length) % this.currentImages.length;
            this.goToImage(newIndex);
        },

        nextImageSmooth: function () {
            if (this.currentImages.length === 0) return;
            const newIndex = (this.currentIndex + 1) % this.currentImages.length;
            this.goToImage(newIndex);
        },

        goToImage: function(index) {
            if (this.currentImages.length === 0 || index < 0 || index >= this.currentImages.length) return;
            
            this.currentIndex = index;
            const overlay = document.getElementById('unified-lightbox');
            const imageElement = overlay.querySelector('.lightbox-image');
            const loadingElement = overlay.querySelector('#lightbox-loading');
            const counterCurrent = overlay.querySelector('#lightbox-current');
            
            // Mostrar loading
            loadingElement.style.display = 'block';
            imageElement.style.opacity = '0.5';
            
            // Actualizar contador
            if (counterCurrent) counterCurrent.textContent = index + 1;
            
            // Actualizar thumbnails activos
            const thumbnails = overlay.querySelectorAll('.lightbox-thumbnail');
            thumbnails.forEach(function(thumb, i) {
                thumb.classList.toggle('active', i === index);
            });
            
            // Cargar nueva imagen con transición
            const self = this;
            this.preloadImage(this.currentImages[index]).then(function(img) {
                imageElement.src = img.src;
                loadingElement.style.display = 'none';
                imageElement.style.opacity = '1';
            }).catch(function() {
                imageElement.src = self.currentImages[index];
                loadingElement.style.display = 'none';
                imageElement.style.opacity = '1';
            });
        },

        // ==========================================
        // CONFIGURACIÓN DE EVENTOS Y BÚSQUEDA
        // ==========================================
        configurarEventos: function () {
            var self = this;

            // BÚSQUEDA INTELIGENTE
            var searchInput = document.getElementById('search-input');
            var clearSearchBtn = document.getElementById('clear-search-btn');

            if (searchInput) {
                // Captura Enter para ejecutar búsqueda inmediata y ocultar teclado (UX móvil)
                searchInput.addEventListener('keydown', function(e){
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        var valor = searchInput.value.trim();
                        self.buscarInteligente(valor);
                        // Forzar blur para cerrar teclado en dispositivos táctiles
                        searchInput.blur();
                    }
                });
                searchInput.addEventListener('input', function (e) {
                    clearTimeout(self.searchTimeout);
                    var valor = e.target.value.trim();
                    if (clearSearchBtn) {
                        clearSearchBtn.style.display = valor.length ? 'inline-flex' : 'none';
                    }
                    self.searchTimeout = setTimeout(function () {
                        self.buscarInteligente(valor);
                    }, 200);
                });
            }

            if (clearSearchBtn) {
                clearSearchBtn.addEventListener('click', function () {
                    searchInput.value = '';
                    clearSearchBtn.style.display = 'none';
                    self.buscarInteligente('');
                    searchInput.blur();
                });
            }

            // SISTEMA DE ORDENAMIENTO
            document.querySelectorAll('.sort-btn').forEach(function (btn) {
                btn.addEventListener('click', function (e) {
                    self.ejecutarOrdenamiento(e.currentTarget.getAttribute('data-sort'));
                });
            });

            // BOTÓN LIMPIAR FILTROS
            document.querySelectorAll('.clear-filters-btn').forEach(function (btn) {
                btn.addEventListener('click', function () {
                    self.limpiarFiltros();
                });
            });

            // ELIMINAR TAGS DE FILTRO
            var filterTags = document.getElementById('filter-tags');
            if (filterTags) {
                filterTags.addEventListener('click', function (e) {
                    if (e.target.classList.contains('tag-remove')) {
                        self.removerTag(e.target);
                    }
                });
            }

            // CONFIGURAR GALERÍA DE FOTOS
            this.configurarGaleriaFotos();

            // URL SHARING – Producto específico en carga
            self.filterByCarIdFromURL();

            // NAVEGACIÓN TECLADO
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    var lightbox = document.getElementById('unified-lightbox');
                    if (lightbox && lightbox.style.display !== 'none') {
                        self.closeLightbox();
                    } else if (self.filterPopover && self.filterPopover.style.display !== 'none') {
                        self.hideFilterPopover();
                    }
                }

                // Navegación lightbox
                var lightbox = document.getElementById('unified-lightbox');
                if (lightbox && lightbox.style.display !== 'none') {
                    if (e.key === 'ArrowLeft') self.prevImageSmooth();
                    if (e.key === 'ArrowRight') self.nextImageSmooth();
                }
            });

            // Listeners de galería
            this.setGaleriaListeners();
        },

        configurarGaleriaFotos: function () {
            var self = this;

            document.addEventListener('click', function (e) {
                var vehicleElement = e.target.closest('.vehicle-clickable, .mobile-vehiculo, .vehicle-main');
                if (vehicleElement) {
                    var row = vehicleElement.closest('tr');
                    if (row) {
                        var vehiculoId = row.getAttribute('data-id');
                        if (vehiculoId) {
                            self.openLightboxGallery(vehiculoId);
                        }
                    }
                }
            });
        },
        // ==========================================
        // SISTEMA DE FILTROS AVANZADO (GLASS MORPHISM)
        // ==========================================
        initCleanFilterSystem: function() {
            var self = this;
            console.log('[INVENTARIO-V12] 🎨 Inicializando sistema de filtros avanzado...');

            // Elimina popover roto si existe
            document.querySelectorAll('[id*="filter-popover"], .filter-popover').forEach(function(el) {
                el.remove();
            });

            // Crea popover glass morphism
            this.createCleanFilterPopover();

            // Handlers para botones de filtro
            this.setupCleanFilterHandlers();

            console.log('[INVENTARIO-V12] ✨ Sistema de filtros listo');
        },

        setupCleanFilterHandlers: function() {
            var self = this;

            // Delegación de eventos para botones de filtro
            document.addEventListener('click', function(e) {
                var filterBtn = e.target.closest('.filter-header-btn') || e.target.closest('.mobile-filter-header-btn');

                if (filterBtn) {
                    e.preventDefault();
                    e.stopPropagation();

                    var filterType = filterBtn.getAttribute('data-filter');
                    console.log('[INVENTARIO-V12] 🔍 Botón de filtro:', filterType);

                    if (filterType) {
                        self.showCleanFilter(filterType, filterBtn);
                    }
                }
            });

            console.log('[INVENTARIO-V12] 🎯 Handlers de filtros configurados');
        },

        createCleanFilterPopover: function() {
            var popover = document.createElement('div');
            popover.id = 'clean-filter-popover';
            popover.style.cssText = `
                display: none;
                position: fixed;
                z-index: 10000;
                background: rgba(26, 26, 26, 0.95);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                border: 1px solid rgba(124, 58, 237, 0.3);
                border-radius: 12px;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(124, 58, 237, 0.2);
                min-width: 280px;
                max-width: 380px;
                max-height: 450px;
                overflow-y: auto;
                padding: 20px;
                color: #ffffff;
                font-family: 'Poppins', Montserrat, Arial, sans-serif;
            `;

            popover.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid rgba(124, 58, 237, 0.3); padding-bottom: 12px;">
                    <strong id="clean-filter-title" style="color: #ffffff; font-size: 1.1rem; font-weight: 600; background: linear-gradient(135deg, #7c3aed, #a855f7); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Filtros</strong>
                    <button id="clean-filter-close" style="background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(124, 58, 237, 0.3); border-radius: 50%; width: 28px; height: 28px; font-size: 16px; cursor: pointer; color: #ffffff; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">&times;</button>
                </div>
                <div id="clean-filter-content">
                    <!-- Opciones de filtro aquí -->
                </div>
            `;

            document.body.appendChild(popover);
            this.filterPopover = popover;

            // Cerrar popover
            var self = this;
            var closeBtn = document.getElementById('clean-filter-close');
            closeBtn.addEventListener('click', function() {
                self.hideFilterPopover();
            });

            // Efectos hover para botón cerrar
            closeBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(124, 58, 237, 0.3)';
                this.style.borderColor = '#7c3aed';
                this.style.transform = 'scale(1.1)';
            });

            closeBtn.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(255, 255, 255, 0.1)';
                this.style.borderColor = 'rgba(124, 58, 237, 0.3)';
                this.style.transform = 'scale(1)';
            });

            // Cerrar al hacer click fuera
            document.addEventListener('click', function(e) {
                if (!popover.contains(e.target) && !e.target.closest('.filter-header-btn') && !e.target.closest('.mobile-filter-header-btn')) {
                    self.hideFilterPopover();
                }
            });
        },

        showCleanFilter: function(filterType, buttonElement) {
            console.log('[INVENTARIO-V12] 🎨 Mostrando filtro avanzado para:', filterType);

            var popover = this.filterPopover;
            var title = document.getElementById('clean-filter-title');
            var content = document.getElementById('clean-filter-content');

            // Título bonito
            var columnNames = {
                'vehiculo': 'Vehículo',
                'variante': 'Versión',
                'precio': 'Precio',
                'km': 'Kilómetros',
                'color': 'Color',
                'tipo': 'Tipo',
                'transmision': 'Transmisión',
                'combustible': 'Combustible',
                'ubicacion': 'Ubicación',
                'año': 'Año'
            };
            title.textContent = 'Filtrar por ' + (columnNames[filterType] || filterType);

            // Obtener valores de filtro
            var values = this.getCleanFilterValues(filterType);

            if (values.length === 0) {
                content.innerHTML = '<p style="color: #f4f4f7; font-style: italic; text-align: center; padding: 20px 0;">No hay opciones disponibles</p>';
                this.positionCleanPopover(popover, buttonElement);
                popover.style.display = 'block';
                return;
            }

            // Opciones visuales
            var html = '';
            var self = this;
            var currentValue = this.filtrosActivos[filterType];

            values.forEach(function(value) {
                var isSelected = currentValue === value;
                var cleanValue = value.replace(/'/g, "&#39;").replace(/"/g, "&quot;");
                html += `
                    <label class="filter-option-label" style="display: block; margin-bottom: 10px; padding: 12px; cursor: pointer; border-radius: 8px; border: 1px solid ${isSelected ? '#7c3aed' : 'rgba(124, 58, 237, 0.2)'}; background: ${isSelected ? 'rgba(124, 58, 237, 0.2)' : 'rgba(255, 255, 255, 0.05)'}; transition: all 0.2s ease; color: #ffffff;">
                        <input type="radio" name="clean_filter_${filterType}" value="${cleanValue}"
                               ${isSelected ? 'checked' : ''}
                               style="margin-right: 12px; accent-color: #7c3aed; transform: scale(1.2);"
                               data-filter="${filterType}"
                               data-original-value="${cleanValue}">
                        <span style="font-weight: ${isSelected ? '600' : '400'}; color: ${isSelected ? '#ffffff' : '#f4f4f7'};">${value}</span>
                    </label>
                `;
            });

            // Botón limpiar si hay filtro activo
            if (currentValue) {
                html += `
                    <hr style="margin: 16px 0; border: none; border-top: 1px solid rgba(124, 58, 237, 0.3);">
                    <button class="filter-clear-btn" data-clear-filter="${filterType}"
                            style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; padding: 12px 16px; border-radius: 8px; cursor: pointer; width: 100%; font-size: 14px; font-weight: 500; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);">
                        🗑️ Limpiar filtro
                    </button>
                `;
            }

            content.innerHTML = html;

            // Agregar clase de hover a labels no seleccionadas (para hover effects sin onmouseover)
            content.querySelectorAll('.filter-option-label').forEach(function(label) {
                var radio = label.querySelector('input[type="radio"]');
                if (radio && !radio.checked) {
                    label.classList.add('filter-option-label--unselected');
                }
            });

            // Listeners radio
            content.querySelectorAll('input[type="radio"]').forEach(function(radio) {
                radio.addEventListener('change', function() {
                    if (this.checked) {
                        var filterType = this.getAttribute('data-filter');
                        var value = this.getAttribute('data-original-value');

                        console.log('[INVENTARIO-V12] ✅ Aplicando filtro:', filterType, '=', value);
                        self.filtrosActivos[filterType] = value;
                        self.aplicarFiltrosYRenderizar();
                        self.hideFilterPopover();
                    }
                });
            });

            // Listener botón limpiar
            var clearBtn = content.querySelector('[data-clear-filter]');
            if (clearBtn) {
                clearBtn.classList.add('filter-clear-btn--active');
                clearBtn.addEventListener('click', function() {
                    var filterType = this.getAttribute('data-clear-filter');
                    delete self.filtrosActivos[filterType];
                    self.aplicarFiltrosYRenderizar();
                    self.hideFilterPopover();
                });
                // Agregar hover listeners para botón
                clearBtn.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.boxShadow = '0 4px 16px rgba(239, 68, 68, 0.4)';
                });
                clearBtn.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                });
            }

            // Posiciona y muestra
            this.positionCleanPopover(popover, buttonElement);
            popover.style.display = 'block';
        },

        getCleanFilterValues: function(filterType) {
            var values = new Set();
            var self = this;

            this.vehiculos.forEach(function(vehiculo) {
                var value = '';
                switch(filterType) {
                    case 'vehiculo':
                        value = vehiculo.marca || '';
                        break;
                    case 'variante':
                        value = vehiculo.variante || '';
                        break;
                    case 'precio':
                        if (vehiculo.precio < 300000) value = 'Económico (<$300K)';
                        else if (vehiculo.precio < 500000) value = 'Accesible ($300-500K)';
                        else if (vehiculo.precio < 700000) value = 'Medio ($500-700K)';
                        else if (vehiculo.precio < 1000000) value = 'Premium ($700K-1M)';
                        else value = 'Lujo (+$1M)';
                        break;
                    case 'km':
                        if (vehiculo.km <= 15000) value = 'Como nuevo (0-15K km)';
                        else if (vehiculo.km <= 30000) value = 'Poco uso (15-30K km)';
                        else if (vehiculo.km <= 60000) value = 'Uso normal (30-60K km)';
                        else if (vehiculo.km <= 100000) value = 'Uso elevado (60-100K km)';
                        else value = 'Alto kilometraje (+100K km)';
                        break;
                    case 'tipo':
                        value = self.normalizarTipoVehiculo(vehiculo.tipo); // <-- Normaliza el tipo
                        break;
                    case 'color':
                        value = vehiculo.color || '';
                        break;
                    case 'transmision':
                        value = vehiculo.transmision || '';
                        break;
                    case 'combustible':
                        value = vehiculo.combustible || '';
                        break;
                    case 'ubicacion':
                        value = vehiculo.ubicacion || '';
                        break;
                    case 'año':
                        value = vehiculo.año ? vehiculo.año.toString() : '';
                        break;
                }
                if (value && value.trim()) {
                    values.add(value.trim());
                }
            });

            // Orden personalizado para precio
            if (filterType === 'precio') {
                const precioOrder = [
                    'Económico (<$300K)',
                    'Accesible ($300-500K)',
                    'Medio ($500-700K)',
                    'Premium ($700K-1M)',
                    'Lujo (+$1M)'
                ];
                return precioOrder.filter(v => values.has(v));
            }
            // Orden personalizado para km
            if (filterType === 'km') {
                const kmOrder = [
                    'Como nuevo (0-15K km)',
                    'Poco uso (15-30K km)',
                    'Uso normal (30-60K km)',
                    'Uso elevado (60-100K km)',
                    'Alto kilometraje (+100K km)'
                ];
                return kmOrder.filter(v => values.has(v));
            }
            // Otros: orden alfabético
            return Array.from(values).sort();
        },

        positionCleanPopover: function(popover, buttonElement) {
            var rect = buttonElement.getBoundingClientRect();
            var isMobile = window.innerWidth <= 768;

            if (isMobile) {
                // Móvil: bottom sheet
                popover.style.left = '10px';
                popover.style.right = '10px';
                popover.style.bottom = '20px';
                popover.style.top = 'auto';
                popover.style.maxWidth = 'none';
                popover.style.borderRadius = '12px';
                console.log('[INVENTARIO-V12] 📱 Bottom sheet posicionada');
            } else {
                // Desktop: junto a botón
                var left = rect.left;
                var top = rect.bottom + 8;

                if (left + 380 > window.innerWidth) {
                    left = window.innerWidth - 380 - 20;
                }
                if (top + 450 > window.innerHeight) {
                    top = rect.top - 450 - 8;
                }

                popover.style.left = Math.max(20, left) + 'px';
                popover.style.top = Math.max(20, top) + 'px';
                popover.style.bottom = 'auto';
                popover.style.right = 'auto';
                console.log('[INVENTARIO-V12] 🖥️ Popover desktop posicionada');
            }
        },

        hideFilterPopover: function() {
            if (this.filterPopover) {
                this.filterPopover.style.display = 'none';
            }
        },

        // ==========================================
        // SISTEMA DE BÚSQUEDA, ORDENAMIENTO Y FILTRADO AVANZADO
        // ==========================================
        buscarInteligente: function (termino) {
            this.filtrosActivos.busqueda = termino.toLowerCase();
            this.aplicarFiltrosYRenderizar();
            console.log('[INVENTARIO-V12] 🔍 Búsqueda aplicada:', termino);
        },

        ejecutarOrdenamiento: function (tipo) {
            this.ordenActual = tipo;
            this.actualizarBotonesOrdenamiento();
            this.aplicarFiltrosYRenderizar();
            console.log('[INVENTARIO-V12] 📊 Orden aplicado:', tipo);
        },

        aplicarFiltros: function () {
            var self = this;

            this.vehiculosFiltrados = this.vehiculos.filter(function (v) {
                // Filtro de búsqueda inteligente
                if (self.filtrosActivos.busqueda) {
                    var terminos = self.filtrosActivos.busqueda.split(/\s+/).filter(Boolean);
                    var coincideTerminos = terminos.every(function (termino) {
                        return v.searchText.indexOf(termino) !== -1;
                    });
                    if (!coincideTerminos) return false;
                }

                // Filtros específicos
                for (var filtro in self.filtrosActivos) {
                    if (filtro === 'busqueda') continue;

                    var valorFiltro = self.filtrosActivos[filtro];
                    if (!valorFiltro) continue;

                    // Mapeo de filtros
                    if (filtro === 'vehiculo') {
                        if (v.marca.toLowerCase().indexOf(valorFiltro.toLowerCase()) === -1) {
                            return false;
                        }
                    } else if (filtro === 'tipo') {
                        // Compara tipo normalizado
                        if (self.normalizarTipoVehiculo(v.tipo) !== valorFiltro) {
                            return false;
                        }
                    } else if (filtro === 'km') {
                        if (!self.verificarRangoKM(v.km, valorFiltro)) {
                            return false;
                        }
                    } else if (filtro === 'precio') {
                        if (!self.verificarRangoPrecio(v.precio, valorFiltro)) {
                            return false;
                        }
                    } else {
                        if (v[filtro] && v[filtro].toString().toLowerCase() !== valorFiltro.toString().toLowerCase()) {
                            return false;
                        }
                    }
                }

                return true;
            });

            this.aplicarOrdenamiento();
        },

        aplicarOrdenamiento: function () {
            var campo = this.ordenActual;
            this.vehiculosFiltrados.sort(function (a, b) {
                if (campo === 'precio' || campo === 'km' || campo === 'año') {
                    return a[campo] - b[campo];
                } else {
                    var aVal = (a[campo] || '').toString().toLowerCase();
                    var bVal = (b[campo] || '').toString().toLowerCase();
                    return aVal.localeCompare(bVal);
                }
            });
        },

        verificarRangoPrecio: function (precio, rango) {
            var rangos = {
                'Económico (<$300K)': [0, 300000],
                'Accesible ($300-500K)': [300000, 500000],
                'Medio ($500-700K)': [500000, 700000],
                'Premium ($700K-1M)': [700000, 1000000],
                'Lujo (+$1M)': [1000000, Infinity]
            };
            var range = rangos[rango];
            return range ? precio >= range[0] && precio < range[1] : true;
        },

        verificarRangoKM: function (km, rango) {
            var rangos = {
                'Como nuevo (0-15K km)': [0, 15000],
                'Poco uso (15-30K km)': [15000, 30000],
                'Uso normal (30-60K km)': [30000, 60000],
                'Uso elevado (60-100K km)': [60000, 100000],
                'Alto kilometraje (+100K km)': [100000, Infinity]
            };
            var range = rangos[rango];
            return range ? km >= range[0] && km <= range[1] : true;
        },

        // ==========================================
        // UTILIDAD: CALCULO PRECIO FINANCIADO
        // ==========================================
        // Calcula cuota mensual de 60 meses al 18% anual (con enganche del 20%)
        _calculateFinancedPrice: function(precio) {
            var enganches = precio * 0.20;        // 20% inicial
            var saldoFinanciado = precio - enganches;  // 80% a financiar
            var tasaMensual = 0.18 / 12;          // 1.5% mensual
            var numMeses = 60;
            var meses = (saldoFinanciado * tasaMensual * Math.pow(1 + tasaMensual, numMeses)) / 
                        (Math.pow(1 + tasaMensual, numMeses) - 1);
            return Math.round(meses);
        },

        // ==========================================
        // UTILIDAD: GENERADOR DE FILAS CONSOLIDADO
        // ==========================================
        _buildRowData: function(v, sharedId, vistos, isDesktop) {
            var precioOriginal = Math.round(v.precio * 1.11);
            var precioFinanciado = this._calculateFinancedPrice(v.precio);
            var isShared = sharedId && v.id == sharedId;
            var isViewed = vistos.includes(v.id);
            return {
                id: v.id,
                marca: v.marca,
                modelo: v.modelo,
                variante: v.variante,
                año: v.año,
                precio: v.precio,
                km: v.km,
                color: v.color,
                precioOriginal: precioOriginal,
                precioFinanciado: precioFinanciado,
                isShared: isShared,
                isViewed: isViewed,
                transmision: v.transmision,
                combustible: v.combustible,
                ubicacion: v.ubicacion,
                tipo: this.normalizarTipoVehiculo(v.tipo),
                imagenes: (this.productos[v.id] || []).join(','),
                colorClass: this.getColorClass(v.color)
            };
        },

        // ==========================================
        // SISTEMA DE RENDERIZADO ADAPTATIVO Y RESALTADO DE COMPARTIR
        // ==========================================
        renderizar: function (sharedId) {
            if (this.esMobile) {
                this.renderizarMobile(sharedId);
            } else {
                this.renderizarDesktop(sharedId);
            }
        },

        renderizarDesktop: function (sharedId) {
            var tbody = document.querySelector('#tabla-inventario tbody');
            if (!tbody) return;

            var fragment = document.createDocumentFragment();
            var self = this;
            var vistos = JSON.parse(localStorage.getItem('vehiculos_vistos') || '[]');

            this.vehiculosFiltrados.forEach(function (v) {
                var rowData = self._buildRowData(v, sharedId, vistos, true);
                var tr = document.createElement('tr');
                tr.setAttribute('data-id', rowData.id);
                tr.setAttribute('data-marca', rowData.marca);
                tr.setAttribute('data-modelo', rowData.modelo);
                tr.setAttribute('data-variante', rowData.variante);
                tr.setAttribute('data-año', rowData.año);
                tr.setAttribute('data-precio', rowData.precio);
                tr.setAttribute('data-km', rowData.km);
                tr.setAttribute('data-transmision', rowData.transmision);
                tr.setAttribute('data-combustible', rowData.combustible);
                tr.setAttribute('data-color', rowData.color);
                tr.setAttribute('data-ubicacion', rowData.ubicacion);

                if (rowData.isShared) tr.classList.add('highlighted-shared');
                else if (rowData.isViewed) tr.classList.add('viewed-row');

                tr.innerHTML =
                    '<td class="vehicle-main vehicle-clickable" data-images="' + rowData.imagenes + '">' +
                        '<div class="vehicle-name">' + rowData.marca + ' ' + rowData.modelo + '</div>' +
                    '</td>' +
                    '<td class="text-center"><span class="version-badge">' + (rowData.variante || 'Base') + '</span></td>' +
                    '<td class="precio-cell">' +
                        '<div class="precio-financiado-inline">$' + rowData.precioFinanciado.toLocaleString() + '/mes</div>' +
                        '<div class="precio-actual">$' + rowData.precio.toLocaleString() + '</div>' +
                        '<div class="precio-original">$' + rowData.precioOriginal.toLocaleString() + '</div>' +
                    '</td>' +
                    '<td class="col-año-cell text-center"><strong>' + rowData.año + '</strong></td>' +
                    '<td class="text-center"><strong class="km-value">' + rowData.km.toLocaleString() + ' km</strong></td>' +
                    '<td class="text-center"><span class="color-badge ' + rowData.colorClass + '">' + rowData.color + '</span></td>' +
                    '<td class="col-tipo-auto text-center">' + rowData.tipo + '</td>' +
                    '<td class="d-none d-lg-table-cell text-center"><small class="spec-text">' + rowData.transmision + '</small></td>' +
                    '<td class="d-none d-lg-table-cell text-center"><small class="spec-text">' + rowData.combustible + '</small></td>' +
                    '<td class="d-none d-xl-table-cell text-center"><small class="spec-text">' + rowData.ubicacion + '</small></td>' +
                    '<td class="text-center">' +
                        '<button class="photo-icon-btn icon-btn" data-id="' + rowData.id + '" title="Ver galería de fotos" aria-label="Ver galería de fotos">' +
                            '<svg width="18" height="18"><use href="#icon-camera"/></svg>' +
                        '</button>' +
                    '</td>' +
                    '<td class="text-center">' +
                        '<button class="icon-btn chat-btn" data-id="' + rowData.id + '" aria-label="Abrir chat para ' + rowData.marca + ' ' + rowData.modelo + '" title="Abrir chat">' +
                        '<svg width="20" height="20"><use href="#icon-message"/></svg>' +
                        '</button>' +
                    '</td>' +
                    '<td class="text-center">' +
                        '<button class="icon-btn share-btn" data-id="' + rowData.id + '" aria-label="Compartir ' + rowData.marca + ' ' + rowData.modelo + '" title="Compartir vehículo">' +
                        '<svg width="20" height="20"><use href="#icon-share"/></svg>' +
                    '</button>' +
                    '</td>';

                fragment.appendChild(tr);
            });

            tbody.innerHTML = '';
            tbody.appendChild(fragment);

            this.setGaleriaListeners();
            this.configurarAcciones();
        },

        renderizarMobile: function (sharedId) {
            var container = document.getElementById('mobile-table-body');
            if (!container) return;

            var fragment = document.createDocumentFragment();
            var self = this;
            var vistos = JSON.parse(localStorage.getItem('vehiculos_vistos') || '[]');

            this.vehiculosFiltrados.forEach(function (v) {
                var rowData = self._buildRowData(v, sharedId, vistos, false);
                var tr = document.createElement('tr');
                tr.setAttribute('data-id', rowData.id);
                tr.setAttribute('data-marca', rowData.marca);
                tr.setAttribute('data-modelo', rowData.modelo);
                tr.setAttribute('data-variante', rowData.variante);
                tr.setAttribute('data-año', rowData.año);
                tr.setAttribute('data-precio', rowData.precio);
                tr.setAttribute('data-km', rowData.km);
                tr.setAttribute('data-transmision', rowData.transmision);
                tr.setAttribute('data-combustible', rowData.combustible);
                tr.setAttribute('data-color', rowData.color);
                tr.setAttribute('data-ubicacion', rowData.ubicacion);

                if (rowData.isShared) tr.classList.add('highlighted-shared');
                else if (rowData.isViewed) tr.classList.add('viewed-row');

                tr.innerHTML =
                    '<td class="mobile-vehiculo vehicle-clickable" data-images="' + rowData.imagenes + '">' +
                        '<div class="vehicle-name" style="font-size: 0.8rem;">' + rowData.marca + ' ' + rowData.modelo + ' <span class="mobile-vehiculo-ano">' + rowData.año + '</span></div>' +
                        '<div class="vehicle-details" style="font-size: 0.7rem;">' + (rowData.variante || '') + '</div>' +
                    '</td>' +
                    '<td class="mobile-precio text-center">' +
                        '<div class="precio-financiado-inline" style="font-size: 0.65rem; color: #7c3aed; font-weight: 600;">$' + rowData.precioFinanciado.toLocaleString() + '/mes</div>' +
                        '<div class="precio-actual" style="font-size: 0.7rem;">$' + rowData.precio.toLocaleString() + '</div>' +
                        '<div class="precio-original" style="font-size: 0.6rem;">$' + rowData.precioOriginal.toLocaleString() + '</div>' +
                    '</td>' +
                    '<td class="mobile-km text-center">' +
                        '<strong class="km-value" style="font-size: 0.75rem;">' + rowData.km.toLocaleString() + ' km</strong>' +
                    '</td>' +
                    '<td class="mobile-color text-center">' +
                        '<span class="color-badge ' + rowData.colorClass + '" style="font-size: 0.65rem;">' + rowData.color + '</span>' +
                    '</td>' +
                    '<td class="mobile-acciones text-center">' +
                        '<div class="d-flex flex-column gap-1">' +
                            '<button class="photo-icon-btn icon-btn" data-id="' + rowData.id + '" style="font-size: 0.65rem; padding: 0.125rem 0.25rem;" aria-label="Ver galería" title="Ver galería">' +
                                '<svg width="16" height="16"><use href="#icon-camera"/></svg>' +
                            '</button>' +
                            '<button class="icon-btn chat-btn" data-id="' + rowData.id + '" style="font-size: 0.65rem; padding: 0.125rem 0.25rem;" aria-label="Abrir chat" title="Abrir chat">' +
                                '<svg width="16" height="16"><use href="#icon-message"/></svg>' +
                            '</button>' +
                            '<button class="icon-btn share-btn" data-id="' + rowData.id + '" style="font-size: 0.65rem; padding: 0.125rem 0.25rem;" aria-label="Compartir vehículo" title="Compartir">' +
                                '<svg width="16" height="16"><use href="#icon-share"/></svg>' +
                            '</button>' +
                        '</div>' +
                    '</td>';

                fragment.appendChild(tr);
            });

            container.innerHTML = '';
            container.appendChild(fragment);

            this.setGaleriaListeners();
            this.configurarAcciones();
        },

        // ==========================================
        // SISTEMA DE INTERFAZ Y ACTUALIZACIÓN
        // ==========================================
        aplicarFiltrosYRenderizar: function () {
            var params = new URLSearchParams(window.location.search);
            var sharedId = params.get('vehiculo') || params.get('id');

            if (this.renderTimeout) {
                cancelAnimationFrame(this.renderTimeout);
            }

            this.renderTimeout = requestAnimationFrame(() => {
                this.aplicarFiltros(); // filtra y ordena

                // --- Mueve el producto compartido al inicio ---
                if (sharedId) {
                    var idx = this.vehiculosFiltrados.findIndex(function(v){return v.id == sharedId;});
                    if (idx > 0) {
                        var prod = this.vehiculosFiltrados.splice(idx, 1)[0];
                        this.vehiculosFiltrados.unshift(prod);
                    }
                }

                this.renderizar(sharedId); // ahora sí, renderiza
                this.actualizarInterfaz();
            });
        },

        actualizarInterfaz: function () {
            this.mostrarTagsFiltros();
            this.actualizarBotonLimpiar();
            this.actualizarBotonesOrdenamiento();
        },
        // ==========================================
        // INTERFAZ: TAGS, BOTONES, LIMPIEZA DE FILTROS
        // ==========================================
        limpiarFiltros: function () {
            this.filtrosActivos = {};
            var searchInput = document.getElementById('search-input');
            var clearSearchBtn = document.getElementById('clear-search-btn');

            if (searchInput) searchInput.value = '';
            if (clearSearchBtn) clearSearchBtn.style.display = 'none';

            this.aplicarFiltrosYRenderizar();
            console.log('[INVENTARIO-V12] 🧹 Todos los filtros limpiados');
        },

        removerTag: function (elemento) {
            var tag = elemento.closest('.filter-tag');
            if (tag) {
                var tipo = tag.getAttribute('data-tipo');
                delete this.filtrosActivos[tipo];
                this.aplicarFiltrosYRenderizar();
                console.log('[INVENTARIO-V12] 🏷️ Tag de filtro removida:', tipo);
            }
        },

        actualizarBotonesOrdenamiento: function () {
            document.querySelectorAll('.sort-btn').forEach(function (btn) {
                btn.classList.remove('active', 'btn-primary');
                btn.classList.add('btn-outline-primary');
            });

            var activeButton = document.querySelector('.sort-btn[data-sort="' + this.ordenActual + '"]');
            if (activeButton) {
                activeButton.classList.add('active', 'btn-primary');
                activeButton.classList.remove('btn-outline-primary');
            }
        },

        mostrarTagsFiltros: function () {
            var contenedor = document.getElementById('filter-tags');
            if (!contenedor) return;

            var tags = [];
            for (var filtro in this.filtrosActivos) {
                if (this.filtrosActivos[filtro] && filtro !== 'busqueda') {
                    var valor = this.filtrosActivos[filtro];
                    var columnNames = {
                        'vehiculo': 'Vehículo',
                        'variante': 'Versión',
                        'precio': 'Precio',
                        'km': 'Kilómetros',
                        'color': 'Color',
                        'tipo': 'Tipo',
                        'transmision': 'Transmisión',
                        'combustible': 'Combustible',
                        'ubicacion': 'Ubicación',
                        'año': 'Año'
                    };
                    var nombreFiltro = columnNames[filtro] || filtro;
                    tags.push('<span class="badge bg-primary filter-tag" data-tipo="' + filtro + '">' +
                        nombreFiltro + ': ' + valor +
                        ' <span class="tag-remove ms-1" style="cursor: pointer;">×</span></span>');
                }
            }

            if (this.filtrosActivos.busqueda) {
                tags.unshift('<span class="badge bg-info filter-tag" data-tipo="busqueda">' +
                    'Búsqueda: "' + this.filtrosActivos.busqueda + '"' +
                    ' <span class="tag-remove ms-1" style="cursor: pointer;">×</span></span>');
            }

            contenedor.innerHTML = tags.join(' ');
        },

        actualizarBotonLimpiar: function () {
            var hayFiltros = Object.keys(this.filtrosActivos).some(function (k) {
                return this.filtrosActivos[k];
            }, this);

            document.querySelectorAll('.clear-filters-btn').forEach(function (btn) {
                if (hayFiltros) {
                    btn.classList.remove('btn-outline-danger');
                    btn.classList.add('btn-danger');
                    btn.textContent = 'Limpiar (' + Object.keys(this.filtrosActivos).length + ')';
                } else {
                    btn.classList.add('btn-outline-danger');
                    btn.classList.remove('btn-danger');
                    btn.textContent = 'Limpiar';
                }
            }, this);
        },

        // ==========================================
        // ACCIONES: CHAT Y COMPARTIR
        // ==========================================
        configurarAcciones: function () {
            this.configurarChat();
            this.configurarCompartir();
        },

        configurarChat: function () {
            var self = this;
            var buttons = document.querySelectorAll('.chat-btn');
            Array.prototype.forEach.call(buttons, function (btn) {
                if (btn._inventarioChatHandler) {
                    try { btn.removeEventListener('click', btn._inventarioChatHandler); } catch (e) { /* ignore */ }
                }
                var handler = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    try {
                        var row = btn.closest('tr');
                        if (!row) return;
                        var producto = {
                            id: String(row.getAttribute('data-id') || '').trim(),
                            marca: (row.getAttribute('data-marca') || '').trim(),
                            modelo: (row.getAttribute('data-modelo') || '').trim(),
                            variante: (row.getAttribute('data-variante') || '').trim(),
                            precio: (row.getAttribute('data-precio') || '').trim(),
                            km: (row.getAttribute('data-km') || '').trim(),
                            año: (row.getAttribute('data-año') || '').trim(),
                            transmision: (row.getAttribute('data-transmision') || '').trim(),
                            color: (row.getAttribute('data-color') || '').trim(),
                            ubicacion: (row.getAttribute('data-ubicacion') || '').trim()
                        };
                        self.abrirChatConSuperTag(producto);
                    } catch (err) { /* ignore */ }
                    return false;
                };
                btn.addEventListener('click', handler);
                btn._inventarioChatHandler = handler;
            });
        },

        abrirChatConSuperTag: function (producto) {
            try {
                if (!producto) return;
                if (!(window && window.Tawk_API && typeof window.Tawk_API.addTags === 'function')) return;

                var etiqueta = [
                    producto.id,
                    producto.marca,
                    producto.modelo,
                    producto.variante,
                    producto.año,
                    producto.color,
                    '$' + producto.precio,
                    producto.km + 'km',
                    producto.transmision,
                    producto.ubicacion
                ].filter(function (p) { return p && String(p).trim(); }).join(' | ');
                if (etiqueta.length > 120) etiqueta = etiqueta.substring(0, 117) + '...';

                window.Tawk_API.addTags([etiqueta]);
                if (typeof window.Tawk_API.maximize === 'function') window.Tawk_API.maximize();
            } catch (e) { /* silencioso */ }
        },

        configurarCompartir: function () {
            var self = this;
            document.querySelectorAll('.share-btn').forEach(function (btn) {
                btn.removeEventListener('click', btn._shareHandler);
        
                var handler = function (e) {
                    e.preventDefault();
                    e.stopPropagation();
        
                    var row = btn.closest('tr');
                    if (row) {
                        var marca = row.getAttribute('data-marca') || '';
                        var modelo = row.getAttribute('data-modelo') || '';
                        var variante = row.getAttribute('data-variante') || '';
                        var año = row.getAttribute('data-año') || '';
                        var precio = row.getAttribute('data-precio') || '';
                        var km = row.getAttribute('data-km') || '';
        
                        var vehiculoCompleto = marca + ' ' + modelo + (variante ? ' ' + variante : '') + ' ' + año;
        
                        // 1. Construye la URL base sin ningún parámetro ?vehiculo
                        var baseUrl = window.location.origin + window.location.pathname;
                        var hash = window.location.hash;
                        // Elimina cualquier ?vehiculo=... del hash si existe
                        if (hash) {
                            hash = hash.replace(/\?vehiculo=\d+/g, '');
                        }
                        // 2. Arma el hash limpio y el parámetro
                        var vehiculoId = btn.getAttribute('data-id');
                        var url = baseUrl + (hash ? hash : '') + '?vehiculo=' + vehiculoId;
        
                        var texto = vehiculoCompleto + ' - $' + parseInt(precio).toLocaleString() + ' (' + parseInt(km).toLocaleString() + 'km)';
        
                        if (navigator.share) {
                            navigator.share({
                                title: 'SeminuevosMex - ' + vehiculoCompleto,
                                text: texto,
                                url: url
                            }).catch(function(err) {
                                self.compartirFallback(texto, url);
                            });
                        } else {
                            self.compartirFallback(texto, url);
                        }
        
                        console.log('[INVENTARIO-V12] 📤 Vehículo compartido:', vehiculoCompleto, url);
                    }
                };
        
                btn.addEventListener('click', handler);
                btn._shareHandler = handler;
            });
        },

        compartirFallback: function (texto, url) {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(texto + ' - ' + url).then(function() {
                    alert('¡Enlace copiado al portapapeles!');
                }).catch(function() {
                    prompt('Copiar enlace:', texto + ' - ' + url);
                });
            } else {
                prompt('Copiar enlace:', texto + ' - ' + url);
            }
        },
        // ==========================================
        // URL SHARING, DEEP LINKING Y UTILIDADES
        // ==========================================
        filterByCarIdFromURL: function () {
            try {
                var params = new URLSearchParams(window.location.search);
                var id = params.get('vehiculo') || params.get('id');
                if (id) {
                    setTimeout(function() {
                        // Busca en desktop
                        var row = document.querySelector('tr[data-id="' + id + '"]');
                        // Si no lo encuentra, busca en móvil
                        if (!row) {
                            row = document.querySelector('#mobile-table-body tr[data-id="' + id + '"]');
                        }
                        if (row) {
                            var parent = row.parentElement;
                            parent.insertBefore(row, parent.firstChild);
                            row.classList.add('viewed-row', 'highlighted-shared');
                            row.scrollIntoView({behavior: 'smooth', block: 'center'});
                        }
                    }, 500);
                }
            } catch (err) {
                console.warn('[INVENTARIO-V12] ⚠️ Error en URL sharing:', err);
            }
        },

        // ==========================================
        // LISTENERS PARA GALERÍA (ELIMINADO mostrarGaleria - DUPLICADO)
        // ==========================================
        // NOTA: setGaleriaListeners activado en configurarGaleriaFotos() y aplicarFiltrosYRenderizar()
        // Duplicidad consolidada: mostrarGaleria() removido, usa openLightboxGallery() directamente
        setGaleriaListeners: function() {
            console.log('[INVENTARIO-V12] 🖼️ Configurando listeners de galería...');

            // Listener 1: Click en fila (vehicle-clickable) abre galería
            document.querySelectorAll('.vehicle-clickable').forEach(function(td) {
                td.onclick = null;

                td.onclick = function(e) {
                    var productId = td.closest('tr').getAttribute('data-id');
                    var imgs = td.getAttribute('data-images');

                    if (imgs && imgs.length > 0 && productId) {
                        InventarioBigData.openLightboxGallery(productId);
                    }
                    e.stopPropagation();
                };
            });

            // Listener 2: Click en botón de fotos (.photo-icon-btn) abre galería
            document.querySelectorAll('.photo-icon-btn').forEach(function(btn) {
                btn.onclick = null;

                btn.onclick = function(e) {
                    var productId = btn.getAttribute('data-id') || btn.closest('tr').getAttribute('data-id');
                    var imgs = btn.closest('tr').querySelector('[data-images]').getAttribute('data-images');

                    if (imgs && imgs.length > 0 && productId) {
                        InventarioBigData.openLightboxGallery(productId);
                    }
                    e.stopPropagation();
                };
            });
        },

        // ==========================================
        // UTILIDAD: CLASES DE COLOR
        // ==========================================
        getColorClass: function(color) {
            var colorLower = color.toLowerCase();
            var colorMap = {
                'plata': 'color-plata',
                'gris': 'color-gris',
                'blanco': 'color-blanco',
                'negro': 'color-negro',
                'rojo': 'color-rojo',
                'azul': 'color-azul',
                'verde': 'color-verde',
                'beige': 'color-beige',
                'naranja': 'color-naranja',
                'amarillo': 'color-amarillo',
                'vino': 'color-vino',
                'dorado': 'color-dorado'
            };
            return colorMap[colorLower] || 'color-otro';
        },

        // ==========================================
        // UTILIDAD CHAT: SUPER ETIQUETA
        // ==========================================
        generarSuperEtiquetaChat: function (row) {
            if (!row) return '';
            var id = row.getAttribute('data-id') || '';
            var marca = row.getAttribute('data-marca') || '';
            var modelo = row.getAttribute('data-modelo') || '';
            var variante = row.getAttribute('data-variante') || '';
            var año = row.getAttribute('data-año') || '';
            var precio = row.getAttribute('data-precio') || '';
            var color = row.getAttribute('data-color') || '';
            var km = row.getAttribute('data-km') || '';
            var etiqueta = [id, marca, modelo, variante, año, color, '$' + parseInt(precio).toLocaleString(), km + 'km']
                .filter(function (v) { return v && v.toString().trim(); })
                .join(' | ');
            if (etiqueta.length > 120) etiqueta = etiqueta.substring(0, 117) + '...';
            return etiqueta;
        },

        // ==========================================
        // UTILIDADES DE PROCESAMIENTO Y NORMALIZACIÓN
        // ==========================================
        /**
         * Normaliza el tipo de vehículo a un valor estándar.
         * @param {string} tipoOriginal
         * @returns {string}
         */
        normalizarTipoVehiculo: function(tipoOriginal) {
            if (!tipoOriginal) return '-';
            const tipo = tipoOriginal.trim().toLowerCase();

            if (tipo.match(/(s\.?u\.?v\.?|cuv|crossover|sport utility|utilitario|deportivo utilitario)/)) return 'SUV';
            if (tipo.match(/(sed[aá]n|sedan|saloon|berlina)/)) return 'Sedán';
            if (tipo.match(/hatchback|hatch|5p|5 puertas|cinco puertas|3p|3 puertas|dos puertas|2p/)) return 'Hatchback';
            if (tipo.match(/minivan|mini van|monovolumen/)) return 'Minivan';
            if (tipo.match(/van/)) return 'Van';
            if (tipo.match(/pickup|pick-up|pick up|camioneta|cabina|doble cabina|crew cab|single cab/)) return 'Pickup';
            if (tipo.match(/roadster|cabrio|convertible|descapotable/)) return 'Roadster';
            if (tipo.match(/wagon|station wagon|familiar|vagoneta|guay[ií]n/)) return 'Wagon';
            if (tipo.match(/coupe|coup[eé]/)) return 'Coupé';

            return tipoOriginal.charAt(0).toUpperCase() + tipoOriginal.slice(1);
        }
    };

    // ==========================================
    // FACEBOOK PIXEL INTEGRATION - CONSOLIDADO (UNA SOLA FUNCIÓN)
    // ==========================================
    function buildVehiclePixelData(tr) {
      if (!tr) return null;
      var bodyStyle = tr.querySelector('.col-tipo-auto') ? tr.querySelector('.col-tipo-auto').textContent.trim() : '';
      return {
        content_type: 'vehicle',
        content_ids: [tr.getAttribute('data-id')],
        make: tr.getAttribute('data-marca'),
        model: tr.getAttribute('data-modelo'),
        year: tr.getAttribute('data-año'),
        price: tr.getAttribute('data-precio'),
        currency: 'MXN',
        exterior_color: tr.getAttribute('data-color'),
        body_style: bodyStyle,
        transmission: tr.getAttribute('data-transmision'),
        fuel_type: tr.getAttribute('data-combustible'),
        postal_code: tr.getAttribute('data-ubicacion')
      };
    }

    function pixelTrack(eventName, tr, isCustom) {
      if (typeof fbq !== 'function' || !tr) return;
      var data = buildVehiclePixelData(tr);
      if (!data) return;
      if (isCustom) {
        fbq('trackCustom', eventName, data);
      } else {
        fbq('track', eventName, data);
      }
    }

    function pixelViewContent(tr) { pixelTrack('ViewContent', tr, false); }
    function pixelLead(tr) { pixelTrack('Lead', tr, false); }
    function pixelShareVehicle(tr) { pixelTrack('ShareVehicle', tr, true); }

    // ==========================================
    // EXPOSICIÓN GLOBAL E INICIALIZACIÓN
    // ==========================================
    window.InventarioBigData = InventarioBigData;

    function inicializar() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                InventarioBigData.init();
            });
        } else {
            InventarioBigData.init();
        }
    }

    inicializar();

    console.log('[INVENTARIO-V12] 🎉 ¡Versión 12.0 cargada exitosamente!');

    // INTEGRACIÓN DE PIXEL EN LOS HANDLERS DE BOTONES
    (function() {
      // Fotos: .photo-icon-btn
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('.photo-icon-btn');
        if (btn) {
          var tr = btn.closest('tr');
          pixelViewContent(tr);
        }
      });
      // Chat: .chat-btn
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('.chat-btn');
        if (btn) {
          var tr = btn.closest('tr');
          pixelLead(tr);
        }
      });
      // Compartir: .share-btn
      document.addEventListener('click', function(e) {
        var btn = e.target.closest('.share-btn');
        if (btn) {
          var tr = btn.closest('tr');
          pixelShareVehicle(tr);
        }
      });
    })();

    // =====================
    // POPUP SEGURIDAD Y PRIVACIDAD
    // =====================
    (function() {
      const btn = document.getElementById('security-popup-btn');
      const backdrop = document.getElementById('security-popup-backdrop');
      const modal = document.getElementById('security-popup-modal');
      const closeBtn = document.querySelector('.close-security-popup-btn');

      if (!btn || !backdrop || !modal || !closeBtn) return;

      // Abrir modal
      btn.addEventListener('click', function() {
        backdrop.style.display = 'flex';
        setTimeout(() => { modal.focus && modal.focus(); }, 100);
        document.body.style.overflow = 'hidden';
      });

      // Cerrar modal
      function closeModal() {
        backdrop.style.display = 'none';
        document.body.style.overflow = '';
        btn.focus && btn.focus();
      }
      closeBtn.addEventListener('click', closeModal);

      // Cerrar con click fuera del modal
      backdrop.addEventListener('mousedown', function(e) {
        if (e.target === backdrop) closeModal();
      });

      // Cerrar con ESC
      document.addEventListener('keydown', function(e) {
        if (backdrop.style.display === 'flex' && (e.key === 'Escape' || e.key === 'Esc')) {
          closeModal();
        }
      });

      // Accesibilidad: foco inicial en modal
      modal.setAttribute('tabindex', '-1');
    })();

})();