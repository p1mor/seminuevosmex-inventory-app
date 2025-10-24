# Deployment Guide

**Production Deployment Procedures and Checklist**

---

## 🚀 Deployment Overview

This guide covers deploying the SeminuevosMex Inventory App to production, including pre-deployment verification, Odoo integration, and post-deployment validation.

---

## 📋 Pre-Deployment Checklist

### Code Quality

- [ ] **No Console Errors**: Run in browser DevTools
  ```bash
  # Check for errors in console
  # Should see only informational logs, no errors
  ```

- [ ] **No Linting Issues**: Run code through linter (if ESLint configured)
  ```bash
  npm run lint
  ```

- [ ] **File Synchronization Verified**: HTML/CSS/JS match
  - [ ] All data-* attributes used in JS exist in HTML
  - [ ] All CSS selectors target existing HTML elements
  - [ ] All CSS classes applied by JS are defined in CSS
  - [ ] All breakpoints match (768px everywhere)

- [ ] **Version Numbers Match**: All three files
  - [ ] HTML header: `VERSIÓN X.Y`
  - [ ] CSS header: `VERSIÓN X.Y`
  - [ ] JS header: `VERSIÓN X.Y`

### Browser Compatibility Testing

Test on all supported browsers:

- [ ] **Chrome** (latest + one version back)
- [ ] **Firefox** (latest + one version back)
- [ ] **Safari** (14+)
- [ ] **Edge** (latest)
- [ ] **Chrome Mobile** (latest)
- [ ] **Safari iOS** (14+)

### Device Testing

Test on all device sizes:

- [ ] **Mobile** (320px - 575px)
  - [ ] iPhone SE
  - [ ] iPhone X/11/12
  - [ ] Android 5-6 inch
  
- [ ] **Tablet** (576px - 767px)
  - [ ] iPad (7th gen)
  - [ ] Android tablet
  
- [ ] **Desktop** (768px+)
  - [ ] 1024px (laptop)
  - [ ] 1366px (standard)
  - [ ] 1920px (HD)
  - [ ] 2560px (4K - optional)

### Functionality Testing

#### Search & Filter
- [ ] Search by brand works
- [ ] Search by model works
- [ ] Search by keywords works (multi-word)
- [ ] Filter by price range works
- [ ] Filter by mileage works
- [ ] Filter by vehicle type works
- [ ] Combined filters work together
- [ ] Clear filters resets view

#### Sorting
- [ ] Sort by price (ascending)
- [ ] Sort by mileage (ascending)
- [ ] Sort by date (newest first)
- [ ] Sort by demand works

#### Gallery
- [ ] Images load correctly
- [ ] Lightbox opens on click
- [ ] Previous/next navigation works
- [ ] Swipe navigation works on mobile
- [ ] Keyboard navigation works (arrow keys)
- [ ] Close button works
- [ ] Keyboard Escape closes lightbox

#### Actions
- [ ] Chat button opens Tawk.to
- [ ] Chat includes vehicle context
- [ ] Share button works on browsers with Web Share API
- [ ] Share fallback works (copy to clipboard)
- [ ] URL copying includes correct vehicle ID

#### Responsive
- [ ] Mobile view switches at < 768px
- [ ] Desktop view displays at >= 768px
- [ ] Bottom sheet appears on mobile
- [ ] Popover appears on desktop
- [ ] Table/grid layout changes appropriately
- [ ] Font sizes scale correctly

### Performance Testing

Use Chrome DevTools Lighthouse:

```
Performance Score: >= 80
Accessibility Score: >= 90
Best Practices Score: >= 90
SEO Score: >= 90
```

### Accessibility Testing

- [ ] **Keyboard Navigation**: Tab through all interactive elements
- [ ] **Screen Reader**: Test with NVDA (Windows) or VoiceOver (Mac)
- [ ] **Focus Indicators**: Visible on all interactive elements
- [ ] **Color Contrast**: Text meets WCAG AA standards
- [ ] **Image Alt Text**: All images have descriptions
- [ ] **Form Labels**: All inputs have associated labels
- [ ] **ARIA Roles**: Implemented correctly

### Security Testing

- [ ] **XSS Prevention**: No `innerHTML` used unsafely
- [ ] **Input Validation**: All user inputs validated
- [ ] **URL Validation**: Share URLs safe and valid
- [ ] **No API Keys in Code**: Sensitive data not exposed
- [ ] **CSRF Tokens**: Included in Odoo forms

---

## 📦 Deployment Steps

### Step 1: Prepare Release

1. **Update Version Numbers**
   ```
   Old: VERSIÓN 1.0.0 (October 1, 2025)
   New: VERSIÓN 1.1.0 (October 24, 2025)
   ```

2. **Update CHANGELOG**
   ```markdown
   ## v1.1.0 (October 24, 2025)
   - Added virtual scroll for large datasets
   - Fixed mobile filter positioning
   - Improved gallery performance
   - Updated documentation
   ```

3. **Create Git Tag**
   ```bash
   git tag -a v1.1.0 -m "Release version 1.1.0"
   git push origin v1.1.0
   ```

### Step 2: Build Artifacts (Optional)

If using a build process:

```bash
# Minify CSS
npm run build:css
# Output: dist/inventory.min.css

# Minify JavaScript
npm run build:js
# Output: dist/inventory.min.js

# Verify builds
npm run build
```

### Step 3: Odoo Deployment

#### 3a. Copy Files to Odoo Module

```bash
# From your seminuevosmex_module
cp src/html/inventory.html odoo_modules/seminuevosmex/views/
cp src/css/inventory.css odoo_modules/seminuevosmex/static/src/css/
cp src/js/inventory.js odoo_modules/seminuevosmex/static/src/js/
```

#### 3b. Update Odoo Template References

In your Odoo XML template file:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <data noupdate="1">
        <!-- Update version in comments -->
        <template id="website.inventario_mexico_seminuevosmexnet" 
                  name="Inventario Seminuevos México - v1.1.0">
            
            <!-- Link to CSS -->
            <link rel="stylesheet" 
                  href="/seminuevosmex/static/src/css/inventory.css?v=1.1.0"/>
            
            <!-- Template content -->
            <t t-name="website.inventario-mexico-seminuevosmexnet">
                <!-- Your template here -->
            </t>
            
            <!-- Link to JS -->
            <script type="text/javascript" 
                    src="/seminuevosmex/static/src/js/inventory.js?v=1.1.0">
            </script>
        </template>
    </data>
</odoo>
```

**Note**: Version query parameter forces browser to fetch fresh files.

#### 3c. Clear Odoo Cache

```bash
# On your Odoo server
cd /opt/odoo
python manage.py web_clean

# Or via Odoo CLI
odoo -d database_name -u seminuevosmex --no-demo
```

### Step 4: Test in Staging

1. **Deploy to Staging Server**
   ```bash
   ssh staging-server
   # Copy files and deploy
   ```

2. **Run Smoke Tests**
   - Open inventory page
   - Load 5+ vehicles
   - Test search and filters
   - Check gallery
   - Verify responsiveness

3. **Test Integrations**
   - Tawk.to chat loads
   - Analytics tracking works
   - Share functionality works

4. **Performance Check**
   - Page load < 2 seconds
   - Interactions < 100ms

### Step 5: Production Deployment

1. **Schedule Downtime** (if needed)
   - Notify users
   - Prepare rollback plan

2. **Deploy Files**
   ```bash
   ssh production-server
   # Backup current version
   cp src/css/inventory.css src/css/inventory.css.backup
   cp src/js/inventory.js src/js/inventory.js.backup
   
   # Deploy new version
   cp new_files/* src/
   ```

3. **Clear Browser Cache**
   - Update CDN cache headers
   - Force asset refresh with version query params

4. **Verify Deployment**
   - Check page loads without errors
   - Monitor error logs
   - Check analytics events

---

## 🔄 Rollback Procedures

### Quick Rollback

If critical issue found:

```bash
# Go back to previous version
git checkout v1.0.0 -- src/

# Restore from backup
cp src/css/inventory.css.backup src/css/inventory.css
cp src/js/inventory.js.backup src/js/inventory.js

# Clear Odoo cache
odoo -d database_name -u seminuevosmex
```

### Full Rollback

If complete version revert needed:

```bash
# Reset to previous tag
git reset --hard v1.0.0

# Redeploy files
deploy_to_production.sh

# Verify
curl https://www.seminuevosmex.net/inventario
```

---

## 📊 Post-Deployment Monitoring

### 1. Error Monitoring

**Check browser console for errors** (first 1 hour):
```javascript
// Should be clean
console.error   // No messages
console.warn    // Only informational warnings
```

**Check server logs**:
```bash
tail -f /var/log/odoo/odoo.log | grep -i error
```

**Sentry Integration** (if configured):
- Monitor error rates
- Alert on new errors
- Track error trends

### 2. Performance Monitoring

**Page Load Time**:
- Target: < 2 seconds
- Alert if: > 3 seconds

**Interaction Response**:
- Target: < 100ms
- Alert if: > 200ms

**First Contentful Paint (FCP)**:
- Target: < 1 second
- Alert if: > 1.5 seconds

### 3. User Engagement Monitoring

**Analytics Tracking**:
- Track page views
- Monitor filter usage
- Track search queries
- Monitor gallery opens

**Chat Integration**:
- Monitor chat volume
- Check chat response time
- Review common questions

### 4. Alerting Rules

Set up alerts for:
- [ ] Error rate > 1%
- [ ] Page load time > 3 seconds
- [ ] Chat integration down
- [ ] Share API failing
- [ ] Critical JavaScript errors

---

## 🐛 Troubleshooting Deployment Issues

### Issue: Page shows blank / nothing loads

**Possible Causes**:
1. CSS/JS files not found (404)
2. QWeb template syntax error
3. JavaScript IIFE not executing

**Solution**:
1. Check file paths in Odoo template
2. Validate XML syntax: `xmllint file.xml`
3. Open DevTools, check Network tab for 404s
4. Check console for syntax errors

### Issue: Styles not applying

**Possible Causes**:
1. CSS file path incorrect
2. Browser cache not cleared
3. CSS rules have specificity issues
4. QWeb escaping XML special characters

**Solution**:
1. Verify href in template matches file location
2. Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
3. Clear browser cache or use private window
4. Verify `&amp;` escaping in QWeb

### Issue: JavaScript not executing

**Possible Causes**:
1. Script tag has wrong path
2. IIFE not wrapping code properly
3. Syntax error preventing execution
4. Script tag placed before DOM ready

**Solution**:
1. Check `<script src="...">` path
2. Verify JavaScript file has no syntax errors
3. Run through JSHint/JSLint
4. Add `defer` attribute to script tag

### Issue: Filters/search not working

**Possible Causes**:
1. Data attributes not matching selectors
2. Event listeners not attached
3. Filter logic has bugs
4. Browser compatibility issue

**Solution**:
1. Open DevTools, inspect elements
2. Check Network tab for JavaScript errors
3. Add `console.log()` to debug filter logic
4. Test in different browser

### Issue: Mobile layout broken

**Possible Causes**:
1. Viewport meta tag missing
2. CSS breakpoints wrong
3. Media queries not applied
4. JavaScript not detecting mobile

**Solution**:
1. Verify `<meta name="viewport">` in HTML
2. Check breakpoints: should be 768px
3. Test with DevTools device emulation
4. Call `detectarDispositivo()` manually

---

## 📋 Deployment Checklist (Copy & Use)

```markdown
## Production Deployment Checklist - v[VERSION]

### Pre-Deployment
- [ ] All tests passing
- [ ] Code reviewed
- [ ] Version numbers match
- [ ] Browser compatibility verified
- [ ] Performance acceptable (Lighthouse >= 80)
- [ ] Accessibility verified (WCAG AA)
- [ ] Security check passed
- [ ] No console errors

### Deployment Day
- [ ] Feature branch merged to main
- [ ] Tag created: git tag v[VERSION]
- [ ] Files backed up
- [ ] Staging deployment successful
- [ ] Staging smoke tests passed
- [ ] Go/No-Go decision made

### Production Deployment
- [ ] Files deployed to production
- [ ] Odoo cache cleared
- [ ] Browser cache invalidated
- [ ] Manual testing completed
- [ ] Monitoring active
- [ ] Users notified

### Post-Deployment (1 hour)
- [ ] No critical errors reported
- [ ] Performance metrics normal
- [ ] Chat integration working
- [ ] Analytics tracking working
- [ ] No rollback needed

### Post-Deployment (24 hours)
- [ ] Monitoring data reviewed
- [ ] Error rates acceptable
- [ ] User feedback positive
- [ ] Document lessons learned
```

---

## 🔐 Production Environment Setup

### Environment Variables

Create `.env` file (keep out of version control):

```env
# Odoo Configuration
ODOO_DB_NAME=seminuevosmex_production
ODOO_MODULE_NAME=seminuevosmex
ODOO_STATIC_PATH=/seminuevosmex/static/src/

# Analytics
ANALYTICS_ID=UA-XXXXXXXXX-X

# Tawk.to Configuration
TAWK_PROPERTY_ID=xxxxxxxxxxxxxxx
TAWK_WIDGET_ID=xxxxxxxxxxxxxxx

# CDN Configuration (if using CDN)
CDN_BASE_URL=https://cdn.example.com/images/

# Monitoring
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxxxx
```

### Server Configuration

**Nginx Caching** (example):

```nginx
location ~* \.(css|js)$ {
    expires 7d;
    add_header Cache-Control "public, immutable";
}

location ~* \.(jpg|jpeg|png|gif|ico|svg)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}

# Force fresh load for version updates
location ~ /v[0-9]+\. {
    expires 1h;
}
```

**Odoo Configuration** (odoo.conf):

```ini
[odoo]
# Odoo database
db_name = seminuevosmex_production

# Module path
addons_path = /opt/odoo/addons,/opt/odoo/custom_addons

# Asset pipeline
assets_backend_minified = True
assets_frontend_minified = True

# Performance
workers = 4
limit_memory_hard = 2684354560
limit_memory_soft = 2147483648

# Logging
log_level = warning
log_handler = [":WARNING"]
```

---

## 📞 Support & Escalation

### During Deployment

**For Urgent Issues**:
1. Contact: Camilo Pimor (camilo@seminuevosmex.net)
2. Backup support: Engineering team
3. Escalation path: CTO → VP Engineering

**Issue Severity Levels**:
- **Critical** (P1): No users can see inventory → Immediate rollback
- **High** (P2): Partial functionality broken → Fix in prod or rollback
- **Medium** (P3): UI glitch, non-blocking → Monitor, fix in next release
- **Low** (P4): Minor visual issue → Fix in next release

---

**Deployment Guide Version**: 1.0.0  
**Last Updated**: October 24, 2025  
**Author**: Camilo Pimor
