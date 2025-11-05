# SeminuevosMex Inventory App

**Professional Inventory Management System for Used Vehicles**

---

## 📋 Project Overview

SeminuevosMex Inventory App is a sophisticated, production-grade inventory management system for used vehicles (seminuevos) built for the Mexican automotive market. This is a comprehensive, mobile-responsive dashboard built with modern web technologies integrated into Odoo's QWeb framework.

**Version:** 1.0.0  
**Status:** Production Ready  
**Last Updated:** October 24, 2025  
**Author:** Camilo Pimor  
**Repository:** seminuevosmex-inventory-app

---

## 🎯 Key Features

### Core Functionality
- **Responsive Dashboard**: Works seamlessly on desktop, tablet, and mobile devices
- **Advanced Filtering System**: Glass morphism-styled filter interface with intelligent UX
- **Smart Search**: Multi-keyword intelligent search with dynamic tags
- **Image Gallery**: Lightbox functionality with smooth navigation for vehicle images
- **Real-time Sorting**: Multiple sort options (price, mileage, date, etc.)
- **Accessibility**: ARIA compliant, keyboard navigation, screen reader support
- **Performance Optimized**: Debouncing, lazy loading, requestAnimationFrame optimization

### UI/UX Features
- **Glass Morphism Design**: Modern, frosted glass aesthetic
- **Bottom Sheet Mobile**: Native-like mobile interface for filtering
- **SVG Icon System**: Lightweight, scalable iconography
- **Smooth Animations**: Micro-interactions for enhanced user engagement
- **Color Coding**: Dynamic badges for vehicle types, conditions, and pricing
- **Dark Theme**: Eye-friendly, modern dark mode design

### Integration
- **Odoo QWeb Framework**: Fully compatible with Odoo's template system
- **Bootstrap 5**: Native Bootstrap components with minimal overrides
- **Schema.org Markup**: SEO-optimized structured data
- **Tawk.to Integration**: Real-time chat support
- **Web Share API**: Built-in sharing capabilities with fallback support

---

## 📁 Project Structure

```
seminuevosmex-inventory-app/
├── src/                           # Source code
│   ├── html/
│   │   ├── inventory.html        # Main inventory dashboard (QWeb template)
│   │   └── app-production.html   # Production-ready app template
│   ├── css/
│   │   └── inventory.css         # Styling (Glass morphism, responsive)
│   ├── js/
│   │   └── inventory.js          # Core logic (InventarioBigData module)
│   └── assets/                   # Placeholder for images, SVGs
├── docs/                          # Documentation
│   ├── ARCHITECTURE.md           # System architecture
│   ├── API_REFERENCE.md          # JavaScript API documentation
│   ├── STYLING_GUIDE.md          # CSS design tokens and guidelines
│   ├── SYNC_REQUIREMENTS.md      # Synchronization rules
│   └── DEPLOYMENT.md             # Deployment procedures
├── config/                        # Configuration files
│   └── odoo-validation-rules.json # Odoo XML/QWeb validation rules
├── tests/                         # Test files (placeholder)
├── .gitignore                     # Git ignore rules
├── package.json                   # Project metadata
└── README.md                      # This file
```

---

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Odoo 14+ instance (for production deployment)
- Node.js 16+ (for development tools)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/p1mor/seminuevosmex-inventory-app.git
   cd seminuevosmex-inventory-app
   ```

2. **Install dependencies** (optional, for linting/build tools)
   ```bash
   npm install
   ```

3. **Development Server**
   - For local testing, use any static server:
   ```bash
   npx http-server src/ -p 8000
   ```
   - Open `http://localhost:8000/html/inventory.html`

4. **Odoo Deployment**
   - Copy QWeb template to your Odoo module
   - Place CSS/JS files in static directories
   - Update template references in Odoo XML files

---

## 📚 Documentation

### Core Documentation Files

| File | Purpose |
|------|---------|
| `docs/ARCHITECTURE.md` | System design, module structure, data flow |
| `docs/API_REFERENCE.md` | InventarioBigData API, methods, events |
| `docs/STYLING_GUIDE.md` | CSS variables, design tokens, breakpoints |
| `docs/SYNC_REQUIREMENTS.md` | HTML/CSS/JS synchronization rules |
| `docs/DEPLOYMENT.md` | Production deployment checklist |

### Key Documentation Sections

#### 1. **InventarioBigData Module**
The JavaScript module is organized into 22 functional sections:
- IIFE wrapper for encapsulation
- Core data structures and state management
- Device detection and responsive handling
- Vehicle data loading from DOM attributes
- Gallery and lightbox system
- Advanced filtering with glass morphism
- Intelligent search with debouncing
- Multi-criteria sorting
- Optimized rendering for desktop/mobile
- Chat and sharing integrations
- Performance optimizations

#### 2. **Styling Architecture**
- **Glass Morphism System**: Frosted glass effects with backdrop blur
- **Design Tokens**: CSS variables for colors, spacing, shadows
- **Responsive Grid**: Mobile-first approach with breakpoints
- **Animation Framework**: Smooth transitions and micro-interactions
- **Accessibility**: High contrast, focus states, motion preferences

#### 3. **HTML Structure**
- Semantic markup following HTML5 standards
- QWeb-compatible template syntax
- Data attributes for JavaScript binding
- ARIA roles for accessibility
- SVG sprite system for icons

---

## 🔄 File Synchronization

**Critical Rule**: HTML, CSS, and JavaScript files must be kept in perfect synchronization.

### Synchronization Checklist

When modifying any file, update all three:

- **HTML Changes**: Update `data-*` attributes → Update JS selectors → Update CSS classes
- **CSS Changes**: Add new classes → Use in HTML → Add JS handlers if needed
- **JS Changes**: Update selectors → Update CSS → Update HTML markup

### Versioning Pattern

All files should have matching version numbers in their headers:
```
SEMINUEVOSMEX INVENTARIO – VERSIÓN [X.Y] STABLE ([DATE])
Sincronía: [HTML: vX-...] + [CSS: vX-...] + [JS: vX-...]
```

---

## 🎨 Design System

### Color Palette
```
Primary Purple:      #262633
Dark Purple:         #4c1d95
Brand Black:         #181425
Glass Background:    rgba(19, 17, 34, 0.80)
Text Primary:        #f9fafb
Text Secondary:      #d1d5db
```

### Responsive Breakpoints
- **Mobile**: < 576px
- **Tablet**: 576px - 768px
- **Desktop**: > 768px

### Typography
- **Font Family**: Poppins (Google Fonts)
- **Weights**: 400 (Regular), 600 (Semi-bold), 700 (Bold)
- **Scale**: Follows Bootstrap 5 heading hierarchy

---

## 🛠️ Development Workflow

### Making Changes

1. **Identify Change Scope**: Is it HTML, CSS, or JS?
2. **Update All Three Files**: 
   - HTML: Update markup/attributes
   - CSS: Add/modify styles
   - JS: Update selectors/logic
3. **Test Responsiveness**: Check desktop, tablet, mobile
4. **Validate QWeb**: Test in Odoo environment
5. **Update Version**: Increment version in all file headers
6. **Commit with Message**: `git commit -m "feat: [specific change]"`

### Testing Checklist

- [ ] Desktop view (1920px, 1366px)
- [ ] Tablet view (768px)
- [ ] Mobile view (320px, 375px)
- [ ] Filter functionality works
- [ ] Search works with multiple keywords
- [ ] Gallery opens and navigates
- [ ] Chat integration loads
- [ ] Sharing works (Web Share API + fallback)
- [ ] No console errors
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

---

## 📊 Key Statistics

| Metric | Value |
|--------|-------|
| HTML Lines | 1,032 |
| CSS Lines | 1,889 |
| JavaScript Lines | 1,852 |
| Total Code Lines | 4,773 |
| Design Tokens | 20+ |
| Responsive Breakpoints | 3 |
| ARIA Roles | 15+ |
| JavaScript Modules | 1 (InventarioBigData) |
| CSS Classes | 80+ |

---

## 🔐 Security & Validation

### Odoo QWeb Rules
All code must follow Odoo XML/QWeb validation:
- Only HTML comments allowed (no `//` or `/* */`)
- XML special characters must be escaped (`&amp;`, `&lt;`, `&gt;`)
- Logical operators: `&&` → `&amp;amp;&amp;amp;`, `||` → `||` (no escape)
- Reference: `config/odoo-validation-rules.json`

### Input Validation
- Search input sanitized for XSS prevention
- Filter values type-checked before application
- Vehicle data validated against schema

---

## 🚢 Deployment

### Development Environment
```bash
# Local testing
npx http-server src/ -p 8000
```

### Production Deployment (Odoo)
1. Minify CSS and JavaScript
2. Optimize images in assets/
3. Test on staging Odoo instance
4. Verify all integrations (Tawk.to, analytics)
5. Update CDN references if applicable
6. Deploy to production
7. Monitor console for errors

### Environment Variables
- **TAWK_PROPERTY_ID**: Tawk.to property identifier
- **TAWK_WIDGET_ID**: Tawk.to widget identifier
- **WHATSAPP_NUMBER**: WhatsApp business number (international format, e.g., +52551234567)
- **CDN_BASE_URL**: Image CDN base URL

---

## 🤝 Contributing

### Contribution Guidelines
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes following the synchronization rules
3. Test thoroughly on all breakpoints
4. Commit with descriptive messages
5. Push to branch: `git push origin feature/your-feature`
6. Create Pull Request with detailed description

### Code Style
- Use consistent indentation (2 spaces for HTML/CSS, 4 for JS)
- Follow existing naming conventions
- Comment complex logic
- Keep functions focused and single-purpose

---

## 📝 Version History

### v1.0.0 (October 24, 2025)
- Initial production-ready release
- Extracted from v18 legacy versioning
- Comprehensive documentation created
- Professional repository structure established
- Git versioning implemented

### Previous Versions
- v18: Last legacy version (September 27, 2025)
- v17: Initial QWeb/Bootstrap integration
- v16-v10: Legacy development versions

---

## 🐛 Known Issues & Roadmap

### Current Known Issues
- Mobile bottom sheet animation can flicker on slow devices
- Gallery preloading may delay initial render on slow connections

### Planned Improvements (v1.1.0)
- [ ] Virtual scrolling for large datasets (1000+ vehicles)
- [ ] Advanced comparison tool for vehicles
- [ ] Saved searches and favorites
- [ ] Email notifications for price drops
- [ ] Vehicle history/accident report integration
- [ ] Progressive Web App (PWA) capabilities
- [ ] Multi-language support (EN/ES)

---

## 📞 Support & Contact

- **Author**: Camilo Pimor
- **Email**: camilo@seminuevosmex.net
- **Website**: https://www.seminuevosmex.net
- **Repository**: https://github.com/p1mor/seminuevosmex-inventory-app

---

## 📄 License

This project is proprietary and confidential. All rights reserved to SeminuevosMex.Net (2025).

---

## 🙏 Acknowledgments

- **Odoo Framework**: For the QWeb templating system
- **Bootstrap 5**: For responsive grid and components
- **Google Fonts**: For Poppins typeface
- **Tawk.to**: For customer support integration
- **MDN Web Docs**: For Web APIs documentation

---

**Last Updated**: October 24, 2025 | **Status**: ✅ Production Ready
