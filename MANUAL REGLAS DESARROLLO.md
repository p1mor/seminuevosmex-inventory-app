# Manual de Reglas y Protocolo de Desarrollo Frontend  
## Entorno: Odoo Website SaaS QWeb-Bootstrap

### 1. Identidad y Alcance técnico  
- Todo desarrollo se basa en la sincronización estricta de los tres archivos clave del frontend: plantilla HTML/QWeb, CSS global y JavaScript global.  
- Cada modificación en una capa debe considerar y detallar el impacto que genera en las otras dos.  
- Todas las instrucciones, documentación y explicaciones relacionadas deben estar en español; solo el código fuente, identificadores y procesos irán en inglés.

### 2. Estructura de plantillas  
- La plantilla base siempre hereda de `website.layout` e incluye bloques `<t t-set="head">` para insertar estilos y scripts globales o específicos.  
- No se permiten comentarios de JS `//` ni `/* */` dentro de los .xml; emplear solamente comentarios HTML `<!-- comentario -->`.  
- No se admite código inline disperso fuera de las estructuras permitidas.

### 3. Reglas de inserción y escape  
- CSS y JS inline solo en el bloque `<t t-set="head">` y de manera justificada.  
- Escapar obligatoriamente los operadores y caracteres conflictivos en cualquier código embebido:  
  - `&` por `&amp;`  
  - `<` por `&lt;`  
  - `>` por `&gt;`  
  - `&&` por `&amp;&amp;`  
  - `<=` por `&lt;=`  
  - `>=` por `&gt;=`  
- Insertar comentarios solo en formato HTML dentro de XML.

### 4. Organización de assets  
- Mantener un solo entrypoint CSS (SCSS compilado) y un solo entrypoint JS por sitio, evitando duplicidad de código específico por página en los bundles globales.  
- Modularizar el código interno de los bundles por imports y scopes; activar JS siempre por selectores o atributos contextuales y jamás por URL.  
- Definir clases semánticas en el root del HTML/QWeb para facilitar la activación contextual de JS y la especialización de estilos.

### 5. Políticas operativas en modificaciones  
- Al solicitar o ejecutar una instrucción, especificar el archivo, sección, acción concreta (eliminar, mantener, cambiar, agregar) y la justificación UX o técnica.  
- Antes de subir cualquier cambio, pasar una validación automática para reemplazo y escape correcto de operadores y caracteres; testear en dos navegadores.  
- Nunca realizar cambios aislados; toda modificación debe venir acompañada de la revisión y ajuste necesario en las otras capas.

### 6. Validaciones y síntomas de error  
- Validar la estructura XML y el bundle producido tras cada cambio; revisar consistencia del render y la funcionalidad JS.  
- Síntomas de error típicos a detectar: página en blanco, errores HTTP 500, “Template not found”, “XML parsing errors”, “JavaScript execution failed”.

### 7. Restricciones de Seguridad  
- Prohibido uso de `eval`, `Function`, y atributos inline de evento (onclick, onload) dentro de las plantillas.  
- Jamás inyectar HTML sin sanitizar; respetar siempre la política CSP del Website.

### 8. Buenas prácticas de QWeb y modularización  
- Heredar siempre `website.layout` para encabezados/pies; encapsular bloques repetidos como subplantillas.  
- Lógica compleja a resolver en JS, nunca en QWeb.  
- El CSS debe seguir convenciones BEM, facilitando la expansibilidad y claridad semántica.

### 9. Política de excepciones y operación emergente  
- Se permite el código inline únicamente si el cambio es urgente y no puede esperar el ciclo de publicación del bundle global; tales cambios deben programarse con absoluta validación y migrarse al bundle en la primera oportunidad posible.  
- Registrar cada excepción en el histórico del proyecto para futura refactorización.

### 10. Entregables mínimos tras cada intervención  
- Diff del archivo afectado, fragmento CSS/JS con los escapes validados, lista de selectores de scope implicados, evidencia de prueba en navegadores y validación por linter de XML.

***