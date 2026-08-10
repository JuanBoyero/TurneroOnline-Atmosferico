# AGENTS.md

## Descripción del Proyecto

Aplicación web HTML/CSS/JS vanilla para un sistema de turnos online para una empresa de servicios atmosféricos. Todo el texto de la interfaz está en español. El backend apunta a PHP (`solicitar_turno.php`) pero aún no existen archivos PHP — el backend no está implementado.

## Estructura

```
HTML/       → Páginas estáticas (index, request, consult)
JS/         → Lógica del cliente (app.js, turnos.js) — mínimo, mayormente stubs
CSS/        → styles.css único (tema glassmorphism, fuente Inter)
BD/         → Esquema MySQL (createBD.sql)
images/     → Logos y banners
```

- Punto de entrada: `HTML/index.html` (página principal con navegación a request/consult)
- Sin sistema de build, sin gestor de paquetes, sin servidor de desarrollo. Abrir archivos HTML directamente en el navegador.
- Sin linter, sin typecheck, sin framework de tests, sin CI configurado.

## Problemas Conocidos (En Progreso)

Estos son bugs reales en el código actual — no repetirlos:

- `JS/app.js:7` llama a `guardarTurnoEnBD(turno)` pero `turno` está indefinido en ese scope (está declarado en `turnos.js` pero no importado).
- `JS/turnos.js` usa sintaxis de módulos ES con `import` de `app.js` pero nunca `export`ea `turno` ni `guardarTurnoEnBD`.
- `HTML/request.html:49-50` — falta el tag de cierre `</div>` del telefono antes del botón de envío.
- El formulario hace POST a `solicitar_turno.php` que aún no existe.

## Base de Datos

MySQL. Esquema en `BD/createBD.sql`. Restricción clave: `localidad` debe ser `'Mattaldi'` o `'Jovita'` (CHECK constraint). Credenciales por defecto en comentarios: `turnero_user` / `turnero_password`.

## Convenciones

- CSS usa propiedades personalizadas definidas en `:root` (`--dorado`, `--naranja`, etc.). Usar estas en lugar de hardcodear colores.
- Breakpoints responsivos: 1024px (tablet), 600px (mobile).
- Español para todo texto visible, comentarios y nombres de variables.
- Rutas relativas entre directorios (`../CSS/styles.css`, `../JS/app.js`).
