# Campus I.A.

Plataforma educativa de cursos de Inteligencia Artificial con contenido interactivo, progreso de estudiantes y panel de administración.

## Stack

- **Frontend:** HTML + CSS + JavaScript vanilla
- **Backend:** Supabase (Auth + Database)
- **Emails:** Google Apps Script (welcome + acceptance)
- **Hosting:** GitHub Pages

## Estructura

```
LAB_MARIA_M.L/
├── index.html                  # Landing page
├── perfil.html                 # Login y dashboard del estudiante
├── admin.html                  # Panel de administración (Supabase Auth)
├── inscripcion.html            # Formulario de registro
├── supabase.js                 # Config de Supabase (URL + anon key)
├── sheets.js                   # Bridge a Google Apps Script para emails
├── google-apps-script.js       # Código para copiar al editor de Apps Script
├── regresion-lineal.html       # Curso: Regresión Lineal
├── infraestructura.html        # Curso: Infraestructura y Despliegue
├── algoritmos-geneticos.html   # Curso: Algoritmos Genéticos
├── aprendizaje-por-refuerzo.html # Curso: Aprendizaje por Refuerzo
├── arboles-decision.html       # Curso: Árboles de Decisión
├── nlp.html                    # Curso: Procesamiento de Lenguaje Natural
├── ia-general.html             # Curso: IA General
├── redes-neuronales.html       # Curso: Redes Neuronales y Deep Learning
└── assets/                     # (reservado para assets futuros)
```

## Setup

### Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Tabla `profiles` con columnas: `full_name`, `email`, `username`, `course`, `status`, `created_at`
3. Copiar `SUPABASE_URL` y `SUPABASE_ANON_KEY` a `supabase.js`
4. En Authentication > Users, crear el usuario admin (`olaya1726@gmail.com`)

### Google Apps Script

1. Ir a [script.google.com](https://script.google.com)
2. Copiar el contenido de `google-apps-script.js` en el editor
3. Reemplazar `SITE_URL` con la URL real del sitio
4. Publicar > Implementar > Nueva implementación (tipo: Web app)
5. Copiar la URL generada a `GOOGLE_SCRIPT_URL` en `sheets.js`

### Admin

- **Email:** `olaya1726@gmail.com`
- **Contraseña:** `admin123`
- Crear el usuario en Supabase > Authentication > Users con ese email y contraseña

## Funcionalidades

- **Estudiantes:** registro con username único, login por username o email, progreso localStorage, contenido bloqueado para no logueados
- **Cursos:** vista simplificada para estudiantes logueados (solo lecciones + Mi Perfil en nav)
- **Admin:** dashboard con KPIs, gestión de estudiantes, cursos, pagos y estadísticas
- **Emails:** bienvenida con contraseña temporal al registrarse, notificación al ser aceptado
